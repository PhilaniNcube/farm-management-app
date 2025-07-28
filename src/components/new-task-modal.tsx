"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { api } from "../../convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";

// Form schema
const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Task description is required")
    .max(500, "Description must be less than 500 characters"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"], {
    required_error: "Please select a status",
  }),
  relatedId: z.string().optional(),
  relatedType: z.enum(["crops", "livestock", "none"]).optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export function NewTaskModal() {
  const [open, setOpen] = useState(false);

  const { organization } = useOrganization();

  // Get labor/workers for task assignment
  const labor = useQuery(
    api.labor.getLaborByOrganizationId,
    organization ? { organizationId: organization.id } : "skip"
  );

  // Get crops and livestock for potential task relations
  const crops = useQuery(
    api.crops.getCropsByOrganizationId,
    organization ? { organizationId: organization.id } : "skip"
  );
  const livestock = useQuery(
    api.livestock.getLivestockByOrganization,
    organization ? { organizationId: organization.id } : "skip"
  );

  // Mutation to create task
  const createTask = useMutation(api.tasks.createTask);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
      status: "pending",
      relatedId: "",
      relatedType: "none",
    },
  });

  console.log(crops, livestock);

  const relatedType = form.watch("relatedType");

  const onSubmit = async (values: TaskFormValues) => {
    try {
      await createTask({
        title: values.title,
        description: values.description,
        dueDate: values.dueDate.getTime(),
        status: values.status,
        relatedId: values.relatedId ? (values.relatedId as any) : undefined,
        organizationId: organization?.id || "",
      });

      toast.success("Task Created", {
        description: `"${values.title}" has been successfully created.`,
      });

      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create task. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Create a new task to track work that needs to be done on your farm.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Plant corn in north field"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed instructions or notes about this task..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="relatedType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related To (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select what this task relates to" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">
                        Not related to anything specific
                      </SelectItem>
                      <SelectItem value="crops">Crop</SelectItem>
                      <SelectItem value="livestock">Livestock</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Link this task to a specific crop or livestock for better
                    organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {relatedType === "crops" && (
              <FormField
                control={form.control}
                name="relatedId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Crop</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a crop" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {crops?.map((crop: any) => (
                          <SelectItem key={crop._id} value={crop._id}>
                            {crop.name} - {crop.variety}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {relatedType === "livestock" && (
              <FormField
                control={form.control}
                name="relatedId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Livestock</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose livestock" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {livestock?.map((animal: any) => (
                          <SelectItem key={animal._id} value={animal._id}>
                            {animal.name} - {animal.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
