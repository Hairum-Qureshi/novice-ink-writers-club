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

export const grades = pgEnum('grades', [
  'freshman',
  'sophomore',
  'junior',
  'senior',
]);

export const genders = pgEnum('genders', [
  'male',
  'female',
  'prefer not to say',
]);

export const usersTable = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull(),
    profilePicture: text('profile_picture').notNull(),
    password: text('password').notNull(),
    role: userRoles().notNull().default('member'),
    biography: text('biography')
      .default('This user prefers to keep an air of mystery about them')
      .notNull(),
    gender: genders(),
    grade: grades(),
    isVerified: boolean('is_verified').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    uniqueUser: uniqueIndex('unique_user').on(table.email),
  }),
);
