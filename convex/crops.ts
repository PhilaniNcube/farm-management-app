import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createCrop = mutation({
  args: {
    farmId: v.id("farms"),
    name: v.string(),
    variety: v.string(),
    plantingDate: v.number(),
    harvestDate: v.number(),
    areaPlanted: v.number(),
    status: v.string(),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Create the crop
    const cropId = await ctx.db.insert("crops", {
      farmId: args.farmId,
      name: args.name,
      variety: args.variety,
      plantingDate: args.plantingDate,
      harvestDate: args.harvestDate,
      areaPlanted: args.areaPlanted,
      status: args.status,
      organizationId: args.organizationId,
    });

    return cropId;
  },
});

export const getCropsByFarmId = query({
  args: { farmId: v.id("farms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("crops")
      .filter((q) => q.eq(q.field("farmId"), args.farmId))
      .collect();
  },
});

export const getCropsByOrganizationId = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("crops")
      .filter((q) => q.eq(q.field("organizationId"), args.organizationId))
      .collect();
  },
});

export const getCropById = query({
  args: { cropId: v.id("crops") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("crops")
      .filter((q) => q.eq(q.field("_id"), args.cropId))
      .first();
  },
});

export const updateCrop = mutation({
  args: {
    cropId: v.id("crops"),
    name: v.optional(v.string()),
    variety: v.optional(v.string()),
    plantingDate: v.optional(v.number()),
    harvestDate: v.optional(v.number()),
    areaPlanted: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Update the crop
    const { cropId, ...updateData } = args;
    await ctx.db.patch(cropId, updateData);
  },
});
