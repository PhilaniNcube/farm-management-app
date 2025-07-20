"use client";

import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { CreateCropForm } from "./create-crop-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const NewCropModal = () => {
  const farms = useQuery(api.farms.getMyFarms);

  if (!farms) {
    return <Skeleton className="w-[150px] animate-pulse h-5" />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn btn-primary">
          <Plus className="mr-2" />
          Add New Crop
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create New Crop</DialogTitle>
        <CreateCropForm farms={farms.filter((farm) => farm !== null)} />
      </DialogContent>
    </Dialog>
  );
};

export default NewCropModal;
