import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// User Roles
// ============================================================================
export type UserRole = 'admin' | 'real-estate-agent';

// ============================================================================
// User Table (BetterAuth compatible)
// ============================================================================
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('real-estate-agent').$type<UserRole>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

// ============================================================================
// Property Table
// ============================================================================
export const property = pgTable('property', {
  id: uuid('id').primaryKey().notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  addressCommonName: text('address_common_name').notNull(),
  bedroomCount: integer('bedroom_count'),
  bathroomCount: integer('bathroom_count'),
  propertyType: text('property_type'),
  landAreaSqm: numeric('land_area_sqm'),
  propertyImageUrl: text('property_image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  addressIdx: index('idx_property_address').on(table.addressCommonName),
  userIdIdx: index('idx_property_user_id').on(table.userId),
}));

export type Property = typeof property.$inferSelect;
export type NewProperty = typeof property.$inferInsert;

// ============================================================================
// Appraisal Table
// ============================================================================
export const appraisal = pgTable('appraisal', {
  id: uuid('id').primaryKey().notNull(),
  propertyId: uuid('property_id').notNull().references(() => property.id, { onDelete: 'cascade' }),
  data: jsonb('data').notNull(),
  status: text('status').notNull().default('pending'),
  pdfUrl: text('pdf_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  propertyIdIdx: index('idx_appraisal_property_id').on(table.propertyId),
}));

export type Appraisal = typeof appraisal.$inferSelect;
export type NewAppraisal = typeof appraisal.$inferInsert;

// ============================================================================
// Relations
// ============================================================================
export const userRelations = relations(user, ({ many }) => ({
  properties: many(property),
}));

export const propertyRelations = relations(property, ({ one, many }) => ({
  user: one(user, {
    fields: [property.userId],
    references: [user.id],
  }),
  appraisals: many(appraisal),
}));

export const appraisalRelations = relations(appraisal, ({ one }) => ({
  property: one(property, {
    fields: [appraisal.propertyId],
    references: [property.id],
  }),
}));
