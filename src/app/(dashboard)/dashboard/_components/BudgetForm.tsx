"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";

import { useOrganization } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";

const budgetFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(0, "Amount must be positive"),
  dateRequired: z.date(),
  category: z.enum([
    "operational",
    "capital",
    "research",
    "marketing",
    "other",
  ]),
  relatedId: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurrenceInterval: z
    .enum(["weekly", "monthly", "quarterly", "annually"])
    .optional(),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  budgetItem?: Doc<"budgets">;
  onClose: () => void;
}

export function BudgetForm({ budgetItem, onClose }: BudgetFormProps) {
  const { organization } = useOrganization();
  const createBudgetItem = useMutation(api.budgets.createBudgetItem);
  const updateBudgetItem = useMutation(api.budgets.updateBudgetItem);

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: budgetItem?.name ?? "",
      description: budgetItem?.description ?? "",
      amount: budgetItem?.amount ?? 0,
      dateRequired: budgetItem?.dateRequired
        ? new Date(budgetItem.dateRequired)
        : new Date(),
      category: budgetItem?.category ?? "operational",
      relatedId: budgetItem?.relatedId ?? undefined,
      isRecurring: budgetItem?.isRecurring ?? false,
      recurrenceInterval: budgetItem?.recurrenceInterval ?? undefined,
    },
  });

  const onSubmit = async (values: BudgetFormValues) => {
    if (!organization) return;

    if (budgetItem) {
      // For updates, only send the fields that can be updated
      await updateBudgetItem({
        budgetId: budgetItem._id,
        name: values.name,
        description: values.description,
        amount: values.amount,
        dateRequired: values.dateRequired.getTime(),
        category: values.category,
        relatedId: values.relatedId as any,
        isRecurring: values.isRecurring,
        recurrenceInterval: values.recurrenceInterval,
      });
    } else {
      // For creation, include organizationId
      await createBudgetItem({
        organizationId: organization.id,
        name: values.name,
        description: values.description,
        amount: values.amount,
        dateRequired: values.dateRequired.getTime(),
        category: values.category,
        relatedId: values.relatedId as any,
        isRecurring: values.isRecurring,
        recurrenceInterval: values.recurrenceInterval,
      });
    }
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Fertilizer Purchase" {...field} />
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
                  placeholder="Detailed description of the budget item"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateRequired"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date Required</FormLabel>
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
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="capital">Capital</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Is Recurring</FormLabel>
              </div>
            </FormItem>
          )}
        />
        {form.watch("isRecurring") && (
          <FormField
            control={form.control}
            name="recurrenceInterval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recurrence Interval</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an interval" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">
          {budgetItem ? "Update" : "Create"} Budget Item
        </Button>
      </form>
    </Form>
  );
}
