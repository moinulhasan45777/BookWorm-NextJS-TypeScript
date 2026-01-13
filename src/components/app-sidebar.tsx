"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userData } = useAuth();
  console.log(userData);

  const data = {
    user: {
      name: userData?.name || "Guest",
      email: userData?.email || "guest@example.com",
      avatar: userData?.photo || "/avatars/default.jpg",
    },
    navMain: [
      {
        title: "Manage Users",
        url: "/admin/manage-users",
        icon: IconUsers,
      },
      {
        title: "Manage Books",
        url: "/admin/manage-books",
        icon: IconDashboard,
      },
      {
        title: "Manage Genres",
        url: "/admin/manage-genres",
        icon: IconListDetails,
      },
      {
        title: "Moderate Reviews",
        url: "/admin/moderate-reviews",
        icon: IconChartBar,
      },
      {
        title: "Manage Tutorials",
        url: "/manage-tutorials",
        icon: IconFolder,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/admin/overview">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">BookWorm</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
