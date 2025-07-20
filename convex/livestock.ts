import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createLivestock = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the current user
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Create the livestock entry
    const livestockId = await ctx.db.insert("animalAssets", {
      farmId: args.farmId,
      name: args.name,
      type: args.type,
      trackingType: args.trackingType,
      quantity: args.quantity,
      tagId: args.tagId,
      acquisitionDate: args.acquisitionDate,
      healthStatus: args.healthStatus,
      purpose: args.purpose,
      organizationId: args.organizationId,
    });

    return livestockId;
  },
});

export const getLivestockByFarm = query({
  args: { farmId: v.id("farms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("animalAssets")
      .filter((q) => q.eq(q.field("farmId"), args.farmId))
      .collect();
  },
});

export const getLivestockByOrganization = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("animalAssets")
      .filter((q) => q.eq(q.field("organizationId"), args.organizationId))
      .collect();
  },
});

export const getLivestockById = query({
  args: { livestockId: v.id("animalAssets") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("animalAssets")
      .filter((q) => q.eq(q.field("_id"), args.livestockId))
      .first();
  },
});

export const updateLivestock = mutation({
  args: {
    livestockId: v.id("animalAssets"),
    updates: v.object({
      name: v.optional(v.string()),
      type: v.optional(v.string()),
      trackingType: v.optional(v.string()),
      quantity: v.optional(v.number()),
      tagId: v.optional(v.string()),
      acquisitionDate: v.optional(v.number()),
      healthStatus: v.optional(v.string()),
      purpose: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { livestockId, updates } = args;

    // Update the livestock entry
    await ctx.db.patch(livestockId, updates);

    return livestockId;
  },
});
