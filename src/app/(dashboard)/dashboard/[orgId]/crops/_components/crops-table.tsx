"use client";
import { useQuery } from "convex/react";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { api } from "../../../../../../../convex/_generated/api";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NewCropModal from "./new-crop-modal";
import { useRouter } from "next/navigation";

// Type for crop data (based on schema)
type Crop = {
  _id: string;
  farmId: string;
  name: string;
  variety: string;
  plantingDate: number;
  harvestDate: number;
  areaPlanted: number;
  status: string;
  organizationId: string;
};

const CropsTable = ({ orgId }: { orgId: string }) => {
  const crops = useQuery(api.crops.getCropsByOrganizationId, {
    organizationId: orgId,
  });

  const router = useRouter();

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "planted":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "growing":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "harvested":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "completed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Format date helper
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate days until harvest
  const getDaysUntilHarvest = (harvestDate: number) => {
    const now = Date.now();
    const days = Math.ceil((harvestDate - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Define columns
  const columns: ColumnDef<Crop>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Crop Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "variety",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Variety
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "areaPlanted",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Area (acres)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-left font-mono">
          {row.getValue("areaPlanted")} acres
        </div>
      ),
    },
    {
      accessorKey: "plantingDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Planting Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const plantingDate = row.getValue("plantingDate") as number;
        return <div>{formatDate(plantingDate)}</div>;
      },
    },
    {
      accessorKey: "harvestDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Harvest Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const harvestDate = row.getValue("harvestDate") as number;
        const daysUntil = getDaysUntilHarvest(harvestDate);
        return (
          <div className="space-y-1">
            <div>{formatDate(harvestDate)}</div>
            {daysUntil > 0 && (
              <div className="text-xs text-muted-foreground">
                {daysUntil} days to go
              </div>
            )}
            {daysUntil < 0 && (
              <div className="text-xs text-red-500">
                {Math.abs(daysUntil)} days overdue
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant="secondary" className={getStatusColor(status)}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const crop = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/${orgId}/crops/${crop._id}`)
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit crop
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete crop
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Loading state
  if (crops === undefined) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-64"></div>
        <div className="h-96 bg-gray-100 animate-pulse rounded"></div>
      </div>
    );
  }

  // Error or empty state
  if (crops === null || crops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <img
            src="/placeholder-crop.svg"
            alt="No crops"
            className="h-8 w-8 text-muted-foreground"
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">No crops found</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          No crops have been planted yet for this organization. Start by adding
          your first crop to begin tracking your agricultural operations.
        </p>
        <NewCropModal />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Crops</h2>
          <p className="text-muted-foreground">
            Manage and track your {crops.length} crop
            {crops.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div>
          <NewCropModal />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={crops}
        searchKey="name"
        searchPlaceholder="Search crops..."
      />
    </div>
  );
};

export default CropsTable;
