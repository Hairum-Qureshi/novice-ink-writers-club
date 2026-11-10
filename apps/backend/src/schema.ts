import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const userRoles = pgEnum('roles', [
  'admin',
  'president',
  'vice president',
  'secretary',
  'magazine selector',
  'member',
]);

export const usersTable = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    first_name: text('first_name').notNull(),
    last_name: text('last_name').notNull(),
    email: text('email').notNull(),
    profile_picture: text('profile_picture').notNull(),
    password: text('password'),
    role: userRoles().notNull().default('member'),
    is_verified: boolean('is_verified').default(false),
    verification_code: text('verification_code'),
    verification_code_expiry: timestamp('verification_code_expiry'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    uniqueUser: uniqueIndex('unique_user').on(
      table.email,
      table.verification_code,
    ),
  }),
);
