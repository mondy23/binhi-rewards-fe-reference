"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  Invoice01Icon,
  GiftIcon,
  Shield01Icon,
  Settings05Icon,
} from "@hugeicons/core-free-icons"
import { useInstitution } from "@/lib/context/institution-context"

interface SidebarSubItem {
  title: string
  description?: string
  url: string
}

interface SidebarNavItem {
  title: string
  description?: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: SidebarSubItem[]
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { userPermissions, currentUser } = useInstitution()

  const navItems = React.useMemo(() => {
    const items: SidebarNavItem[] = [
      {
        title: "Dashboard",
        description: "Overview of your institution ledger.",
        url: "/",
        icon: <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />,
        isActive: pathname === "/",
        items: [],
      },
    ]

    // Ledger Section
    const ledgerChildren: SidebarSubItem[] = []
    if (userPermissions.ledgerView) {
      ledgerChildren.push({
        title: "Transactions",
        description: "View balanced double-entry transactions.",
        url: "/transactions",
      })
    }
    if (userPermissions.membersView) {
      ledgerChildren.push({
        title: "Members",
        description: "View customer ledger accounts and balances.",
        url: "/members",
      })
    }

    if (ledgerChildren.length > 0) {
      items.push({
        title: "Ledger",
        description: "Track immutable reward movements.",
        url: "/transactions",
        icon: <HugeiconsIcon icon={Invoice01Icon} strokeWidth={2} />,
        isActive: pathname.startsWith("/transactions") || pathname.startsWith("/members"),
        items: ledgerChildren,
      })
    }

    // Rewards Section
    const rewardsChildren: SidebarSubItem[] = []
    if (userPermissions.rewardsView) {
      rewardsChildren.push({
        title: "Rewards",
        description: "Reward catalog & asset definitions.",
        url: "/rewards",
      })
    }
    if (userPermissions.redemptionsPerform || userPermissions.rewardsView) {
      rewardsChildren.push({
        title: "Redemptions",
        description: "Member reward redemptions & counter fulfillment.",
        url: "/redemptions",
      })
    }
    if (userPermissions.gamesManage || currentUser.role !== "STORE_STAFF") {
      rewardsChildren.push({
        title: "Games",
        description: "Reward-based engagement games.",
        url: "/games",
      })
    }

    if (rewardsChildren.length > 0) {
      items.push({
        title: "Rewards",
        description: "Manage rewards, redemptions, and games.",
        url: "/rewards",
        icon: <HugeiconsIcon icon={GiftIcon} strokeWidth={2} />,
        isActive: pathname.startsWith("/rewards") || pathname.startsWith("/redemptions") || pathname.startsWith("/games"),
        items: rewardsChildren,
      })
    }

    // Administration Section
    const adminChildren: SidebarSubItem[] = []
    if (userPermissions.usersManage || currentUser.role === "SUPER_ADMIN" || currentUser.role === "INSTITUTION_ADMIN") {
      adminChildren.push({
        title: "Access Control",
        description: "ARBAC users, roles, and scopes.",
        url: "/access-control",
      })
    }
    if (userPermissions.institutionsManage || currentUser.role === "SUPER_ADMIN") {
      adminChildren.push({
        title: "Institutions",
        description: "Manage multi-tenant institutions and branches.",
        url: "/institutions",
      })
    }

    if (adminChildren.length > 0) {
      items.push({
        title: "Administration",
        description: "System governance & tenant management.",
        url: "/access-control",
        icon: <HugeiconsIcon icon={Shield01Icon} strokeWidth={2} />,
        isActive: pathname.startsWith("/access-control") || pathname.startsWith("/institutions"),
        items: adminChildren,
      })
    }

    // Settings Section
    items.push({
      title: "Settings",
      description: "Tenant branding and platform settings.",
      url: "/settings",
      icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
      isActive: pathname.startsWith("/settings"),
      items: [],
    })

    return items
  }, [pathname, userPermissions, currentUser])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}