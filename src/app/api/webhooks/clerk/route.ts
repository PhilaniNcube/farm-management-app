import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as any;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  try {
    switch (eventType) {
      case "organization.created":
        await handleOrganizationCreated(evt.data);
        break;
      case "organizationMembership.created":
        await handleOrganizationMembershipCreated(evt.data);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}

async function handleOrganizationCreated(data: any) {
  console.log(
    "Organization created - Full payload:",
    JSON.stringify(data, null, 2)
  );

  // Get the creator's ID
  const createdBy = data.created_by;

  if (!createdBy) {
    console.error("No creator found for organization");
    return;
  }

  // Log the specific fields we're trying to extract
  console.log("Organization ID:", data.id);
  console.log("Organization Name:", data.name);
  console.log("Organization Slug:", data.slug);
  console.log("Created By:", createdBy);

  try {
    // Create farm in Convex
    const farmId = await convex.mutation(api.farms.createFarmFromOrganization, {
      organizationId: data.id,
      organizationName: data.name,
      orgSlug: data.slug || data.slug_url || data.slug_id || null, // Try different possible slug fields
      createdByClerkId: createdBy,
    });

    console.log("Farm created successfully:", farmId);
  } catch (error) {
    console.error("Error creating farm from organization:", error);
    console.error("Error details:", error);
  }
}

async function handleOrganizationMembershipCreated(data: any) {
  console.log("Organization membership created:", data);
  // Handle additional logic if needed when someone joins an organization
}
