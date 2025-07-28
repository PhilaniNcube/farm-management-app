"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";
import { useOrganization } from "@clerk/nextjs";

const createCropSchema = z
  .object({
    farmId: z.string().min(1, "Please select a farm"),
    name: z.string().min(1, "Crop name is required"),
    variety: z.string().min(1, "Variety is required"),
    plantingDate: z.date({
      required_error: "Planting date is required",
    }),
    harvestDate: z.date({
      required_error: "Harvest date is required",
    }),
    areaPlanted: z.number().min(0.01, "Area planted must be greater than 0"),
    status: z.string().min(1, "Please select a status"),
    organizationId: z.string().min(1, "Organization ID is required"),
  })
  .refine((data) => data.harvestDate > data.plantingDate, {
    message: "Harvest date must be after planting date",
    path: ["harvestDate"],
  });

type CreateCropFormData = z.infer<typeof createCropSchema>;

interface CreateCropFormProps {
  farms: Doc<"farms">[];
}

const cropStatuses = [
  { value: "planned", label: "Planned" },
  { value: "seedbed", label: "Seedbed" },
  { value: "planting", label: "Planting" },
  { value: "growing", label: "Growing" },
  { value: "harvested", label: "Harvested" },
  { value: "failed", label: "Failed" },
];

export function CreateCropForm({ farms }: CreateCropFormProps) {
  const { organization } = useOrganization();

  const newCropMutation = useMutation(api.crops.createCrop);

  // get the farmId by filtering the farms array to get the farm with the matching ID
  const farmId = farms.filter(
    (farm) => farm.organizationId === organization?.id
  )[0]?._id;

  const form = useForm<CreateCropFormData>({
    resolver: zodResolver(createCropSchema),
    defaultValues: {
      farmId: farmId,
      name: "",
      variety: "",
      areaPlanted: 0,
      status: "planned",
      organizationId: organization?.id || "",
    },
  });

  const handleSubmit = async (data: CreateCropFormData) => {
    try {
      await newCropMutation({
        ...data,
        farmId: data.farmId as Id<"farms">,
        plantingDate: data.plantingDate.getTime(),
        harvestDate: data.harvestDate.getTime(),
        status: data.status as
          | "seedbed"
          | "planting"
          | "growing"
          | "harvested"
          | "failed"
          | "planned",
      });
      form.reset();
    } catch (error) {
      console.error("Error creating crop:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crop Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Corn, Wheat, Tomatoes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="variety"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variety</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Sweet Corn, Winter Wheat"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="plantingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Planting Date</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="harvestDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expected Harvest Date</FormLabel>
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
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="areaPlanted"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area Planted (acres)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number.parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
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
                    {cropStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={form.formState.isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create Crop"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
