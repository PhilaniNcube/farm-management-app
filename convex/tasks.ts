// write a function to get pending tasks

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getPendingTasks = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Fetch tasks that are pending for the given organization
    return await ctx.db
      .query("tasks")
      .filter((q) =>
        q.and(
          q.eq(q.field("organizationId"), args.organizationId),
          q.eq(q.field("status"), "pending")
        )
      )
      .collect();
  },
});

export const getTasksByOrganization = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("organizationId"), args.organizationId))
      .collect();
  },
});

export const getTaskById = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.taskId);
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Update the status of the task
    const result = await ctx.db.patch(args.taskId, {
      status: args.status,
    });
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Update the task
    await ctx.db.patch(args.taskId, {
      title: args.title,
      description: args.description,
      dueDate: args.dueDate,
      status: args.status,
    });
  },
});

export const updateTaskDueDate = mutation({
  args: {
    taskId: v.id("tasks"),
    dueDate: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Update the due date of the task
    await ctx.db.patch(args.taskId, {
      dueDate: args.dueDate,
    });
  },
});

export const createTask = mutation({
  args: {
    farmId: v.id("farms"),
    title: v.string(),
    description: v.string(),
    dueDate: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    assignedTo: v.id("labor"),
    relatedId: v.optional(
      v.union(v.id("crops"), v.id("animalAssets"), v.null())
    ),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Create the task
    const taskId = await ctx.db.insert("tasks", {
      farmId: args.farmId,
      title: args.title,
      description: args.description,
      dueDate: args.dueDate,
      status: args.status,
      assignedTo: args.assignedTo,
      relatedId: args.relatedId,
      organizationId: args.organizationId,
    });

    return taskId;
  },
});
