"use client";

import { useCreateFarmFromOrganization } from "@/hooks/useCreateFarmFromOrganization";

export default function OrganizationInitializer() {
  useCreateFarmFromOrganization();
  return null;
}
