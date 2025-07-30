import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    farmIds: v.array(v.id("farms")),
  }),
  farms: defineTable({
    name: v.string(),
    location: v.string(),
    size: v.number(),
    ownerId: v.id("users"),
    organizationId: v.optional(v.string()), // Clerk organization ID
    orgSlug: v.optional(v.string()), // Optional slug for organization
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),
  crops: defineTable({
    farmId: v.id("farms"),
    name: v.string(),
    variety: v.string(),
    plantingDate: v.number(),
    harvestDate: v.number(),
    areaPlanted: v.number(),
    status: v.union(
      v.literal("seedbed"),
      v.literal("planting"),
      v.literal("growing"),
      v.literal("harvested"),
      v.literal("failed"),
      v.literal("planned")
    ),
    organizationId: v.string(),
  }),
  animalAssets: defineTable({
    farmId: v.id("farms"),
    name: v.string(),
    type: v.string(),
    trackingType: v.string(),
    quantity: v.optional(v.number()),
    tagId: v.optional(v.string()),
    acquisitionDate: v.number(),
    healthStatus: v.string(),
    purpose: v.string(),
    organizationId: v.string(),
  }),
  transactions: defineTable({
    farmId: v.id("farms"),
    type: v.string(),
    totalAmount: v.number(),
    date: v.number(),
    vendor: v.string(),
    description: v.string(),
    receiptStorageId: v.optional(v.union(v.string(), v.null())),
    organizationId: v.string(),
  }),
  transactionItems: defineTable({
    transactionId: v.id("transactions"),
    farmId: v.id("farms"),
    category: v.string(),
    amount: v.number(),
    description: v.string(),
    relatedId: v.optional(
      v.union(v.id("crops"), v.id("animalAssets"), v.null())
    ),
    organizationId: v.string(),
  }),
  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    dueDate: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    relatedId: v.optional(
      v.union(v.id("crops"), v.id("animalAssets"), v.null())
    ),
    organizationId: v.string(),
  }),
  labor: defineTable({
    name: v.string(),
    contactInfo: v.string(),
    role: v.string(),
    organizationId: v.string(),
  }),
  payroll: defineTable({
    laborId: v.id("labor"),
    transactionId: v.id("transactions"),
    payPeriodStart: v.number(),
    payPeriodEnd: v.number(),
    hoursWorked: v.optional(v.number()),
    organizationId: v.string(),
  }),
  budgets: defineTable({
    organizationId: v.string(),
    name: v.string(),
    description: v.string(),
    amount: v.number(),
    dateRequired: v.number(),
    category: v.union(
      v.literal("operational"),
      v.literal("capital"),
      v.literal("research"),
      v.literal("marketing"),
      v.literal("other")
    ),
    relatedId: v.optional(
      v.union(v.id("crops"), v.id("animalAssets"), v.id("farms"), v.null())
    ),
    isRecurring: v.optional(v.boolean()),
    recurrenceInterval: v.optional(
      v.union(
        v.literal("weekly"),
        v.literal("monthly"),
        v.literal("quarterly"),
        v.literal("annually")
      )
    ),
  }),
});
