"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
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
import { toast } from "sonner";
import { api } from "../../../../../../../convex/_generated/api";

// Form schema
const livestockSchema = z.object({
  farmId: z.string().min(1, "Please select a farm"),
  name: z.string().min(1, "Animal name is required"),
  type: z.string().min(1, "Animal type is required"),
  trackingType: z.enum(["individual", "group"], {
    required_error: "Please select a tracking type",
  }),
  quantity: z.number().min(1, "Quantity must be at least 1").optional(),
  tagId: z.string().optional(),
  acquisitionDate: z.date({
    required_error: "Acquisition date is required",
  }),
  healthStatus: z.enum(["excellent", "good", "fair", "poor", "sick"], {
    required_error: "Please select a health status",
  }),
  purpose: z.enum(["meat", "dairy", "breeding", "work", "companion", "other"], {
    required_error: "Please select a purpose",
  }),
});

type LivestockFormValues = z.infer<typeof livestockSchema>;

interface AddLivestockModalProps {
  organizationId: string;
}

export function AddLivestockModal({ organizationId }: AddLivestockModalProps) {
  const [open, setOpen] = useState(false);

  // Get farms for the organization
  const farms = useQuery(api.farms.getFarmsByOrganization, {
    organizationId,
  });

  // Mutation to create livestock
  const createLivestock = useMutation(api.livestock.createLivestock);

  const form = useForm<LivestockFormValues>({
    resolver: zodResolver(livestockSchema),
    defaultValues: {
      name: "",
      type: "",
      trackingType: "individual",
      quantity: undefined,
      tagId: "",
      acquisitionDate: new Date(),
      healthStatus: "good",
      purpose: "meat",
    },
  });

  const trackingType = form.watch("trackingType");

  const onSubmit = async (values: LivestockFormValues) => {
    try {
      await createLivestock({
        farmId: values.farmId as any, // Type assertion for Convex ID
        name: values.name,
        type: values.type,
        trackingType: values.trackingType,
        quantity: values.trackingType === "group" ? values.quantity : undefined,
        tagId: values.tagId || undefined,
        acquisitionDate: values.acquisitionDate.getTime(),
        healthStatus: values.healthStatus,
        purpose: values.purpose,
        organizationId,
      });

      toast.success("Livestock Added", {
        description: `${values.name} has been successfully added to your farm.`,
      });

      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error("Error", {
        description: "Failed to add livestock. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Livestock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Livestock</DialogTitle>
          <DialogDescription>
            Add a new animal to your farm livestock inventory.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="farmId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a farm" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {farms?.map((farm: any) => (
                        <SelectItem key={farm._id} value={farm._id}>
                          {farm.name} - {farm.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Animal Name/Identifier</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Bessie, Cattle Group A"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Animal Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select animal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cattle">Cattle</SelectItem>
                      <SelectItem value="sheep">Sheep</SelectItem>
                      <SelectItem value="goats">Goats</SelectItem>
                      <SelectItem value="pigs">Pigs</SelectItem>
                      <SelectItem value="chickens">Chickens</SelectItem>
                      <SelectItem value="horses">Horses</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trackingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracking Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tracking type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="individual">
                        Individual Animal
                      </SelectItem>
                      <SelectItem value="group">Group/Herd</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose individual for tracking specific animals, or group
                    for herds/flocks
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {trackingType === "group" && (
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of animals in group"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {trackingType === "individual" && (
              <FormField
                control={form.control}
                name="tagId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag ID (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., EID-12345, Tag-001"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ear tag, RFID, or other identification number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="acquisitionDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Acquisition Date</FormLabel>
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When did you acquire this animal/group?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="healthStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Health Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select health status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="sick">Sick</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Purpose</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="meat">Meat Production</SelectItem>
                      <SelectItem value="dairy">Dairy Production</SelectItem>
                      <SelectItem value="breeding">Breeding</SelectItem>
                      <SelectItem value="work">Work/Labor</SelectItem>
                      <SelectItem value="companion">Companion</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Adding..." : "Add Livestock"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
