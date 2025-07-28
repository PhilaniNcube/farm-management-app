import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getMetrics = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const { organizationId } = args;

    // get current date as a timestamp
    const currentDate = Date.now();

    const pendingTasks = await ctx.db
      .query("tasks")
      .filter((q) =>
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.eq(q.field("status"), "pending")
        )
      )
      .collect();

    const livestockCount = await ctx.db
      .query("animalAssets")
      .filter((q) => q.eq(q.field("organizationId"), args.organizationId))
      .collect();

    //  get active crops where status is not "harvested" or "failed"
    const activeCrops = await ctx.db
      .query("crops")
      .filter((q) =>
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.not(q.eq(q.field("status"), "harvested")),
          q.not(q.eq(q.field("status"), "failed")),
          q.gt(q.field("harvestDate"), currentDate),
          q.lt(q.field("plantingDate"), currentDate) // Ensure plantingDate is set
        )
      )
      .collect();

    const transactions = await ctx.db
      .query("transactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.gt(q.field("date"), currentDate - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        )
      )
      .collect();

    // labor
    const labor = await ctx.db
      .query("labor")
      .filter((q) =>
        q.and(q.eq(q.field("organizationId"), args.organizationId))
      )
      .collect();

    return {
      pendingTasks,
      livestockCount,
      activeCrops,
      transactions,
      labor,
    };
  },
});
