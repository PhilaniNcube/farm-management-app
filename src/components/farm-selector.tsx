"use client";

import {
  OrganizationList,
  useClerk,
  useOrganization,
  useOrganizationList,
} from "@clerk/nextjs";
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

const FarmSelector = () => {
  return (
    <div className="p-4 border rounded-lg">
      <Dialog>
        <DialogTrigger>
          <Button className="w-full">Select Farm</Button>
        </DialogTrigger>
        <DialogContent className="bg-transparent border-0 shadow-none">
          <OrganizationList />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FarmSelector;
