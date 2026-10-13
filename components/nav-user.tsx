"use client"

import * as React from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
  Shield01Icon,
  Tick02Icon,
  Settings05Icon,
} from "@hugeicons/core-free-icons"
import { useInstitution } from "@/lib/context/institution-context"
import Link from "next/link"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { currentUser, allUsers, setCurrentUserId } = useInstitution()

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
      case "INSTITUTION_ADMIN":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
      case "STORE_MANAGER":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "STORE_STAFF":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-sidebar-border/50"
            >
              <Avatar className="h-8 w-8 rounded-lg border border-border/60">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="rounded-lg text-xs font-semibold">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentUser.name}</span>
                <span className="truncate text-xs text-muted-foreground">{currentUser.role.replace("_", " ")}</span>
              </div>
              <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} className="ml-auto size-4 opacity-60" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-72"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2.5 px-2 py-2 text-left">
                <Avatar className="h-9 w-9 rounded-lg border border-border">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="rounded-lg text-xs font-semibold">
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-foreground">{currentUser.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{currentUser.email}</span>
                  <div className="mt-1">
                    <span
                      className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getRoleBadgeVariant(
                        currentUser.role
                      )}`}
                    >
                      {currentUser.role.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
              Simulate ARBAC User & Scope
            </DropdownMenuLabel>
            <div className="max-h-56 overflow-y-auto space-y-0.5 py-0.5">
              {allUsers.map((u) => {
                const isSelected = u.id === currentUser.id
                return (
                  <DropdownMenuItem
                    key={u.id}
                    onClick={() => setCurrentUserId(u.id)}
                    className="flex items-center justify-between text-xs p-2 cursor-pointer"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="font-medium truncate">{u.name}</span>
                      <span className="text-[11px] text-muted-foreground truncate">
                        {u.role.replace("_", " ")} {u.branchId ? "• Store Scoped" : ""}
                      </span>
                    </div>
                    {isSelected && (
                      <HugeiconsIcon icon={Tick02Icon} strokeWidth={2.5} className="size-4 text-primary shrink-0" />
                    )}
                  </DropdownMenuItem>
                )
              })}
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/access-control" className="flex items-center gap-2 cursor-pointer">
                  <HugeiconsIcon icon={Shield01Icon} strokeWidth={2} className="size-4" />
                  <span>Access Control & Permissions</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                  <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} className="size-4" />
                  <span>Platform Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
