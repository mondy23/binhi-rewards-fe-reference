"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UnfoldMoreIcon,
  Tick02Icon,
  LockKeyIcon,
} from "@hugeicons/core-free-icons"
import { useInstitution } from "@/lib/context/institution-context"
import { Badge } from "@/components/ui/badge"

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const {
    activeInstitution,
    authorizedInstitutions,
    setActiveInstitutionId,
    currentUser,
    isBranchLocked,
    institutionBranches,
  } = useInstitution()

  const userBranch = institutionBranches.find((b) => b.id === currentUser.branchId)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-sidebar-border/60 hover:bg-sidebar-accent/50"
            >
              <div
                className="flex aspect-square size-8 items-center justify-center rounded-lg font-bold text-xs tracking-wider text-white shadow-xs"
                style={{
                  backgroundColor: activeInstitution.branding.primaryColor || "#029456",
                }}
              >
                {activeInstitution.branding.logoText?.slice(0, 3) || activeInstitution.code?.slice(0, 3) || "BNH"}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold tracking-tight">{activeInstitution.name}</span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="truncate">{activeInstitution.plan}</span>
                  {isBranchLocked && userBranch && (
                    <span className="flex items-center gap-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                      <HugeiconsIcon icon={LockKeyIcon} size={10} strokeWidth={2} />
                      {userBranch.name}
                    </span>
                  )}
                </div>
              </div>
              {authorizedInstitutions.length > 1 ? (
                <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} className="ml-auto size-4 opacity-60" />
              ) : (
                <Badge variant="outline" className="ml-auto text-[10px] py-0 px-1 font-mono">
                  Tenant
                </Badge>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {authorizedInstitutions.length > 1 && (
            <DropdownMenuContent
              className="w-64"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Authorized Institutions ({authorizedInstitutions.length})
              </DropdownMenuLabel>
              {authorizedInstitutions.map((inst) => {
                const isActive = inst.id === activeInstitution.id
                return (
                  <DropdownMenuItem
                    key={inst.id}
                    onClick={() => setActiveInstitutionId(inst.id)}
                    className="gap-2 p-2 cursor-pointer"
                  >
                    <div
                      className="flex size-7 items-center justify-center rounded-md font-bold text-[10px] text-white shadow-xs shrink-0"
                      style={{ backgroundColor: inst.branding.primaryColor }}
                    >
                      {inst.branding.logoText?.slice(0, 3) || inst.code?.slice(0, 3)}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="truncate text-sm font-medium">{inst.name}</span>
                      <span className="text-[11px] text-muted-foreground">{inst.plan}</span>
                    </div>
                    {isActive && (
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        strokeWidth={2.5}
                        className="size-4 shrink-0"
                        style={{ color: inst.branding.primaryColor }}
                      />
                    )}
                  </DropdownMenuItem>
                )
              })}
              <DropdownMenuSeparator />
              <div className="p-2 text-[11px] text-muted-foreground bg-muted/40 rounded-sm">
                <span className="font-medium text-foreground">Multi-tenant boundary:</span> Switching institution immediately re-scopes data, ledger, branches, and active brand theme.
              </div>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
