"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconPlant,
  IconMeat,
  IconCoin,
  IconCalendarEvent,
  IconUserCheck,
  IconMapPin,
  IconTractor,
  IconCurrencyDollar,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavDocuments } from "./nav-documents";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import Link from "next/link";
import FarmSelector from "./farm-selector";
import {
  OrganizationSwitcher,
  useOrganization,
  UserButton,
} from "@clerk/nextjs";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Farms",
      url: "/dashboard/farms",
      icon: IconMapPin,
    },
    {
      title: "Crops",
      url: "/dashboard/crops",
      icon: IconPlant,
    },
    {
      title: "Livestock",
      url: "/dashboard/livestock",
      icon: IconMeat,
    },
    {
      title: "Tasks",
      url: "/dashboard/tasks",
      icon: IconCalendarEvent,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: IconCoin,
    },
    {
      title: "Labor",
      url: "/dashboard/labor",
      icon: IconUserCheck,
    },
    {
      title: "Equipment",
      url: "/dashboard/equipment",
      icon: IconTractor,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { invitations, isLoaded, organization } = useOrganization();

  organization?.id;

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Crops",
      url: `/dashboard/${organization?.id}/crops`,
      icon: IconPlant,
    },
    {
      title: "Livestock",
      url: `/dashboard/${organization?.id}/livestock`,
      icon: IconMeat,
    },
    {
      title: "Tasks",
      url: `/dashboard/${organization?.id}/tasks`,
      icon: IconCalendarEvent,
    },
    {
      title: "Transactions",
      url: `/dashboard/${organization?.id}/transactions`,
      icon: IconCoin,
    },
    {
      title: "Budgets",
      url: `/dashboard/${organization?.id}/budgets`,
      icon: IconCurrencyDollar,
    },
    {
      title: "Labour",
      url: `/dashboard/${organization?.id}/labour`,
      icon: IconUserCheck,
    },
    {
      title: "Equipment",
      url: `/dashboard/${organization?.id}/equipment`,
      icon: IconTractor,
    },
    {
      title: "Analytics",
      url: `/dashboard/${organization?.id}/analytics`,
      icon: IconChartBar,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <OrganizationSwitcher
                hidePersonal
                afterSelectOrganizationUrl="/dashboard/:id"
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
