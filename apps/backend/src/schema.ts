import { pgTable, text, bigint, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const userRoles = pgEnum('roles', ['user', 'admin']);

export const usersTable = pgTable('users', {
  id: bigint({ mode: 'bigint' }).primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull(),
  profile_picture: text('profile_picture').notNull(),
  role: userRoles().default('user'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
