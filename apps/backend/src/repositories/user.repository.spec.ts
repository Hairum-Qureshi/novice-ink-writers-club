import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test } from '@nestjs/testing';
import type { SafeUser, User } from '@repo/shared-types';
import { UserRepository } from './user.repository';

describe('UserRepository user caching', () => {
  const user: SafeUser = {
    id: 'user-1',
    firstName: 'First',
    lastName: 'Last',
    email: 'user@example.com',
    profilePicture: 'picture',
    biography: 'biography',
    role: 'member',
    grade: null,
    gender: null,
    isVerified: false,
    isLegacyMember: false,
    backdropImage: 'backdrop',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  let repository: UserRepository;
  let records: Map<string, unknown>;
  let findFirst: jest.Mock;
  let cache: {
    get: jest.Mock;
    set: jest.Mock;
    del: jest.Mock;
  };
  let updateReturning: jest.Mock;
  let deleteReturning: jest.Mock;
  let insertValues: jest.Mock;

  beforeEach(async () => {
    records = new Map();
    findFirst = jest.fn().mockResolvedValue(user);
    updateReturning = jest.fn().mockResolvedValue([user]);
    deleteReturning = jest.fn().mockResolvedValue([user]);
    insertValues = jest.fn().mockResolvedValue(undefined);
    cache = {
      get: jest.fn(async (key: string) => records.get(key)),
      set: jest.fn(async (key: string, value: unknown) =>
        records.set(key, value),
      ),
      del: jest.fn(async (key: string) => records.delete(key)),
    };
    const db = {
      query: { usersTable: { findFirst } },
      insert: jest.fn(() => ({ values: insertValues })),
      update: jest.fn(() => ({
        set: () => ({ where: () => ({ returning: updateReturning }) }),
      })),
      delete: jest.fn(() => ({
        where: () => ({ returning: deleteReturning }),
      })),
    };

    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: 'NeonDBProvider', useValue: db },
        { provide: CACHE_MANAGER, useValue: cache },
      ],
    }).compile();
    repository = module.get(UserRepository);
  });

  it('caches a safe user on a miss and reuses it on a hit', async () => {
    expect(await repository.getCachedUserById(user.id)).toEqual(user);
    expect(cache.set).toHaveBeenCalledWith(
      `user:${user.id}`,
      user,
      30 * 60 * 1000,
    );
    expect(await repository.getCachedUserById(user.id)).toEqual(user);
    expect(findFirst).toHaveBeenCalledTimes(1);
    expect(findFirst.mock.calls[0][0].columns).toEqual({ password: false });
  });

  it('does not cache missing users', async () => {
    findFirst.mockResolvedValue(undefined);
    expect(await repository.getCachedUserById('missing')).toBeUndefined();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('keeps uncached reads available for authorization-sensitive operations', async () => {
    records.set(`user:${user.id}`, user);
    const updatedUser = { ...user, isLegacyMember: true };
    findFirst.mockResolvedValue(updatedUser);

    expect(await repository.getUserById(user.id)).toEqual(updatedUser);
    expect(cache.get).not.toHaveBeenCalled();
  });

  it('invalidates both caches after an update and reloads the updated user', async () => {
    await repository.getCachedUserById(user.id);
    records.set('users:all', [user]);
    const updatedUser = { ...user, firstName: 'Updated' };
    updateReturning.mockResolvedValue([updatedUser]);
    findFirst.mockResolvedValue(updatedUser);

    await repository.updateUser(user.id, { firstName: 'Updated' });

    expect(records.has(`user:${user.id}`)).toBe(false);
    expect(records.has('users:all')).toBe(false);
    expect(await repository.getCachedUserById(user.id)).toEqual(updatedUser);
    expect(findFirst).toHaveBeenCalledTimes(2);
  });

  it('invalidates both caches after deletion', async () => {
    records.set(`user:${user.id}`, user);
    records.set('users:all', [user]);

    await repository.deleteUser(user.id);

    expect(records.has(`user:${user.id}`)).toBe(false);
    expect(records.has('users:all')).toBe(false);
    findFirst.mockResolvedValue(undefined);
    expect(await repository.getCachedUserById(user.id)).toBeUndefined();
  });

  it('invalidates the user list after creation', async () => {
    records.set('users:all', []);
    const newUser: User = { ...user, password: 'hash' };

    await repository.createUser(newUser);

    expect(records.has('users:all')).toBe(false);
  });

  it('does not invalidate caches when a database update fails', async () => {
    records.set(`user:${user.id}`, user);
    records.set('users:all', [user]);
    updateReturning.mockRejectedValue(new Error('database error'));

    await expect(repository.updateUser(user.id, {})).rejects.toThrow(
      'database error',
    );
    expect(cache.del).not.toHaveBeenCalled();
  });
});
