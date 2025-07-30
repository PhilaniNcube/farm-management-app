import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getThisMonthsBudgets = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // use date-fns to get the start and end of the current month
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return await ctx.db
      .query("budgets")
      .filter((q) =>
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.gte(q.field("dateRequired"), startOfMonth.getTime()),
          q.lte(q.field("dateRequired"), endOfMonth.getTime())
        )
      )
      .collect();
  },
});

export const getNextMonthsBudgets = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // use date-fns to get the start and end of the next month
    const today = new Date();
    const startOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );
    const endOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 2,
      0
    );

    return await ctx.db
      .query("budgets")
      .filter((q) =>
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.gte(q.field("dateRequired"), startOfNextMonth.getTime()),
          q.lte(q.field("dateRequired"), endOfNextMonth.getTime())
        )
      )
      .collect();
  },
});

export const createBudgetItem = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const budgetId = await ctx.db.insert("budgets", {
      organizationId: args.organizationId,
      name: args.name,
      description: args.description,
      amount: args.amount,
      dateRequired: args.dateRequired,
      category: args.category,
      relatedId: args.relatedId,
      isRecurring: args.isRecurring,
      recurrenceInterval: args.recurrenceInterval,
    });

    return budgetId;
  },
});

export const updateBudgetItem = mutation({
  args: {
    budgetId: v.id("budgets"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    amount: v.optional(v.number()),
    dateRequired: v.optional(v.number()),
    category: v.optional(
      v.union(
        v.literal("operational"),
        v.literal("capital"),
        v.literal("research"),
        v.literal("marketing"),
        v.literal("other")
      )
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { budgetId, ...updateData } = args;

    await ctx.db.patch(budgetId, updateData);
  },
});

export const getBudgetItemById = query({
  args: { budgetId: v.id("budgets") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.get(args.budgetId);
  },
});

export const deleteBudgetItem = mutation({
  args: { budgetId: v.id("budgets") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.delete(args.budgetId);
  },
});
