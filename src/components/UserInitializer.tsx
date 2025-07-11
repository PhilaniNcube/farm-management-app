"use client";

import { useCreateUser } from "@/hooks/useCreateUser";

export default function UserInitializer() {
  useCreateUser();
  return null;
}
