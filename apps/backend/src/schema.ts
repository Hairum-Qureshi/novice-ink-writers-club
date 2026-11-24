import { relations } from 'drizzle-orm';
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
  'prefer not to say',
]);

export const genders = pgEnum('genders', [
  'male',
  'female',
  'prefer not to say',
]);

export const genres = pgEnum('genres', [
  'apocalyptic',
  'dystopian',
  'poetry',
  'essays',
  'sci-fi',
  'fantasy',
  'mystery',
]);

export const storiesTable = pgTable('stories', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  genre: genres().notNull(),
  content: text('content').notNull(),
  authorId: text('author_id').references(() => usersTable.id), // intentionally left nullable
  authorName: text('author_name').notNull(), // added because some authors posted a story, but don't have an account
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const commentsTable = pgTable('comments', {
  id: text('id').primaryKey(),
  storyId: text('story_id')
    .notNull()
    .references(() => storiesTable.id),
  authorId: text('author_id')
    .notNull()
    .references(() => usersTable.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

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
    gender: genders().notNull().default('prefer not to say'),
    grade: grades().notNull().default('prefer not to say'),
    isVerified: boolean('is_verified').notNull().default(false),
    isLegacyMember: boolean('is_legacy_member').notNull().default(false),
    backdropImage: text('backdrop_image')
      .notNull()
      .default(
        'https://i.pinimg.com/originals/1a/2f/ce/1a2fce9d9ad2c08b01995324bff7a9b3.jpg',
      ),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    uniqueUser: uniqueIndex('unique_user').on(table.email),
  }),
);

export const storiesRelations = relations(storiesTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [storiesTable.authorId],
    references: [usersTable.id],
  }),
}));
