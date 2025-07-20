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
import { AddLivestockModal } from "./add-livestock-modal";
import { useRouter } from "next/navigation";

// Type for livestock data (based on schema)
type Livestock = {
  _id: string;
  farmId: string;
  name: string;
  type: string;
  trackingType: string;
  quantity?: number;
  tagId?: string;
  acquisitionDate: number;
  healthStatus: string;
  purpose: string;
  organizationId: string;
};

const LivestockTable = ({ orgId }: { orgId: string }) => {
  const livestock = useQuery(api.livestock.getLivestockByOrganization, {
    organizationId: orgId,
  });

  const router = useRouter();

  // Health status color mapping
  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "good":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "fair":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "poor":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "sick":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Purpose color mapping
  const getPurposeColor = (purpose: string) => {
    switch (purpose.toLowerCase()) {
      case "meat":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "dairy":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "breeding":
        return "bg-pink-100 text-pink-700 hover:bg-pink-100";
      case "work":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100";
      case "companion":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
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

  // Calculate age since acquisition
  const getAgeInDays = (acquisitionDate: number) => {
    const now = Date.now();
    const days = Math.floor((now - acquisitionDate) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Define columns
  const columns: ColumnDef<Livestock>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name/ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("type")}</div>
      ),
    },
    {
      accessorKey: "trackingType",
      header: "Tracking",
      cell: ({ row }) => {
        const trackingType = row.getValue("trackingType") as string;
        const quantity = row.original.quantity;
        return (
          <div className="space-y-1">
            <Badge variant="outline">
              {trackingType === "individual" ? "Individual" : "Group"}
            </Badge>
            {trackingType === "group" && quantity && (
              <div className="text-xs text-muted-foreground">
                {quantity} animals
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "tagId",
      header: "Tag ID",
      cell: ({ row }) => {
        const tagId = row.getValue("tagId") as string;
        return (
          <div className="font-mono text-sm">
            {tagId || <span className="text-muted-foreground">—</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "acquisitionDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Acquired
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const acquisitionDate = row.getValue("acquisitionDate") as number;
        const ageInDays = getAgeInDays(acquisitionDate);
        return (
          <div className="space-y-1">
            <div>{formatDate(acquisitionDate)}</div>
            <div className="text-xs text-muted-foreground">
              {ageInDays} days ago
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "healthStatus",
      header: "Health",
      cell: ({ row }) => {
        const healthStatus = row.getValue("healthStatus") as string;
        return (
          <Badge
            variant="secondary"
            className={getHealthStatusColor(healthStatus)}
          >
            {healthStatus}
          </Badge>
        );
      },
    },
    {
      accessorKey: "purpose",
      header: "Purpose",
      cell: ({ row }) => {
        const purpose = row.getValue("purpose") as string;
        return (
          <Badge variant="outline" className={getPurposeColor(purpose)}>
            {purpose === "meat"
              ? "Meat Production"
              : purpose === "dairy"
                ? "Dairy Production"
                : purpose === "breeding"
                  ? "Breeding"
                  : purpose === "work"
                    ? "Work/Labor"
                    : purpose === "companion"
                      ? "Companion"
                      : "Other"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const animal = row.original;

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
                onClick={() => navigator.clipboard.writeText(animal._id)}
              >
                Copy animal ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/${orgId}/livestock/${animal._id}`)
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit animal
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete animal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Loading state
  if (livestock === undefined) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-64"></div>
        <div className="h-96 bg-gray-100 animate-pulse rounded"></div>
      </div>
    );
  }

  // Error or empty state
  if (livestock === null || livestock.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <div className="h-8 w-8 text-muted-foreground">🐄</div>
        </div>
        <h3 className="text-lg font-semibold mb-2">No livestock found</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          No animals have been added yet for this organization. Start by adding
          your first livestock to begin tracking your animal assets.
        </p>
        <AddLivestockModal organizationId={orgId} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Livestock</h2>
          <p className="text-muted-foreground">
            Manage and track your {livestock.length} animal
            {livestock.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div>
          <AddLivestockModal organizationId={orgId} />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={livestock}
        searchKey="name"
        searchPlaceholder="Search livestock..."
      />
    </div>
  );
};

export default LivestockTable;
