import { useOrganization, useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export const useCreateFarmFromOrganization = () => {
  const { organization } = useOrganization();
  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const createFarmFromOrganization = useMutation(
    api.farms.createFarmFromOrganization
  );

  useEffect(() => {
    if (isAuthenticated && organization && user) {
      const createFarmInDb = async () => {
        try {
          await createFarmFromOrganization({
            organizationId: organization.id,
            organizationName: organization.name,
            createdByClerkId: user.id,
          });
        } catch (error) {
          console.error("Error creating farm from organization:", error);
        }
      };

      createFarmInDb();
    }
  }, [isAuthenticated, organization, user, createFarmFromOrganization]);
};
