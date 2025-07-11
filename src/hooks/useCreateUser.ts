import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export const useCreateUser = () => {
  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    if (isAuthenticated && user) {
      const createUserInDb = async () => {
        try {
          await createUser({
            name: user.fullName || user.firstName || "Unknown",
            email: user.primaryEmailAddress?.emailAddress || "",
            clerkId: user.id,
          });
        } catch (error) {
          console.error("Error creating user:", error);
        }
      };

      createUserInDb();
    }
  }, [isAuthenticated, user, createUser]);
};
