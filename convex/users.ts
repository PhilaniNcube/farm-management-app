import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      clerkId: args.clerkId,
      farmIds: [],
    });

    return userId;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    console.log("getCurrentUser called with identity:", identity);

    if (!identity) {
      console.log("No identity found");
      return null;
    }

    // Look up the user by Clerk ID (subject is the user ID from Clerk)
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    console.log("User found in database:", user);

    return user;
  },
});

export const debugAuth = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    console.log("=== DEBUG AUTH ===");
    console.log("Identity:", identity);
    console.log("Identity subject (Clerk ID):", identity?.subject);
    console.log("Identity email:", identity?.email);

    if (identity) {
      // Check if user exists in database
      const userByClerkId = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), identity.subject))
        .first();

      console.log("User found by Clerk ID:", userByClerkId);

      // Check all users in database
      const allUsers = await ctx.db.query("users").collect();
      console.log("All users in database:", allUsers);
    }

    return {
      identity,
      hasIdentity: !!identity,
      clerkId: identity?.subject,
      email: identity?.email,
    };
  },
});
