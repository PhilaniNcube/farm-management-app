# Farm Management App

A comprehensive farm management system built with Next.js, Convex, and Clerk.

## Features

- **User Authentication**: Secure sign-up/sign-in with Clerk
- **Organization Management**: Create organizations that automatically generate farms
- **Farm Management**: Track farms, crops, livestock, and more
- **Real-time Updates**: Powered by Convex for real-time data synchronization

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set up Convex

```bash
npx convex dev
```

This will guide you through setting up your Convex project.

### 3. Set up Clerk

1. Create a Clerk account at https://clerk.com
2. Create a new application
3. Copy your publishable key and secret key to your `.env.local` file

### 4. Set up Webhooks

1. Go to Clerk Dashboard > Webhooks
2. Create a new webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `organization.created`, `organizationMembership.created`
4. Copy the webhook secret and add it to your `.env.local` file

### 5. Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

## How Organization-to-Farm Creation Works

1. **User Signs Up**: User creates an account with Clerk
2. **User Created in Convex**: Our system automatically creates a corresponding user record in Convex
3. **Organization Created**: When a user creates an organization in Clerk, it triggers a webhook
4. **Farm Created**: The webhook handler automatically creates a farm in Convex linked to the organization
5. **User Association**: The farm is associated with the user who created the organization

## Development

```bash
# Start the development server
pnpm dev

# Start Convex development server (in another terminal)
npx convex dev
```

## Architecture

- **Frontend**: Next.js with App Router
- **Database**: Convex (real-time, serverless)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI

## Key Files

- `convex/schema.ts`: Database schema definitions
- `convex/users.ts`: User-related database operations
- `convex/farms.ts`: Farm-related database operations
- `src/app/api/webhooks/clerk/route.ts`: Clerk webhook handler
- `src/components/FarmManagement.tsx`: Farm management interface
- `src/hooks/useCreateUser.ts`: User creation hook
- `src/hooks/useCreateFarmFromOrganization.ts`: Organization-to-farm creation hook
