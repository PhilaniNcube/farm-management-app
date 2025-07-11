import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createFarm = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    size: v.number(),
    organizationId: v.optional(v.string()),
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

    // Create the farm
    const farmId = await ctx.db.insert("farms", {
      name: args.name,
      location: args.location,
      size: args.size,
      ownerId: user._id,
      organizationId: args.organizationId,
      createdAt: Date.now(),
    });

    // Update user's farmIds array
    await ctx.db.patch(user._id, {
      farmIds: [...user.farmIds, farmId],
    });

    return farmId;
  },
});

export const createFarmFromOrganization = mutation({
  args: {
    organizationId: v.string(),
    organizationName: v.string(),
    createdByClerkId: v.string(),
    orgSlug: v.optional(v.string()), // Optional slug for organization
  },
  handler: async (ctx, args) => {
    console.log("createFarmFromOrganization called with args:", args);

    // Check if farm already exists for this organization
    const existingFarm = await ctx.db
      .query("farms")
      .filter((q) => q.eq(q.field("organizationId"), args.organizationId))
      .first();

    if (existingFarm) {
      console.log("Farm already exists for organization:", existingFarm._id);
      return existingFarm._id;
    }

    // Get the user who created the organization
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.createdByClerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    console.log("Creating farm with orgSlug:", args.orgSlug);

    // Create the farm based on the organization
    const farmId = await ctx.db.insert("farms", {
      name: args.organizationName,
      location: "Not specified", // Can be updated later
      size: 0, // Can be updated later
      ownerId: user._id,
      organizationId: args.organizationId,
      orgSlug: args.orgSlug, // Optional slug for organization
      createdAt: Date.now(),
    });

    console.log("Farm created with ID:", farmId);

    // Get the created farm to verify orgSlug was saved
    const createdFarm = await ctx.db.get(farmId);
    console.log("Created farm details:", createdFarm);

    // Update user's farmIds array
    await ctx.db.patch(user._id, {
      farmIds: [...user.farmIds, farmId],
    });

    return farmId;
  },
});

export const getFarmsByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      return [];
    }

    const farms = await Promise.all(
      user.farmIds.map(async (farmId) => {
        return await ctx.db.get(farmId);
      })
    );

    return farms.filter((farm) => farm !== null);
  },
});

export const getFarmsByOrganization = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("farms")
      .filter((q) => q.eq(q.field("organizationId"), args.organizationId))
      .collect();
  },
});

export const getAllFarms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("farms").collect();
  },
});

export const getFarmById = query({
  args: { farmId: v.id("farms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.farmId);
  },
});
