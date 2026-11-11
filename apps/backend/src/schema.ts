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
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull(),
    profilePicture: text('profile_picture').notNull(),
    password: text('password'),
    role: userRoles().notNull().default('member'),
    isVerified: boolean('is_verified').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    uniqueUser: uniqueIndex('unique_user').on(table.email),
  }),
);
