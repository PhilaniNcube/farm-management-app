import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createLabor = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    contactInfo: v.string(),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Create the labor entry
    const laborId = await ctx.db.insert("labor", {
      name: args.name,
      role: args.role,
      contactInfo: args.contactInfo,
      organizationId: args.organizationId,
    });

    return laborId;
  },
});

export const getLaborByOrganizationId = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("labor")
      .filter((q) => q.eq(q.field("organizationId"), args.organizationId))
      .collect();
  },
});

export const getLaborById = query({
  args: { laborId: v.id("labor") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.laborId);
  },
});

export const updateLabor = mutation({
  args: {
    laborId: v.id("labor"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    contactInfo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Update the labor entry
    const updates: any = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.role !== undefined) updates.role = args.role;
    if (args.contactInfo !== undefined) updates.contactInfo = args.contactInfo;

    await ctx.db.patch(args.laborId, updates);

    return args.laborId;
  },
});

export const deleteLabor = mutation({
  args: { laborId: v.id("labor") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Delete the labor entry
    await ctx.db.delete(args.laborId);
    return args.laborId;
  },
});
