"use client"

import * as React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ModeToggle } from "@/components/mode-toggle"
import { useInstitution } from "@/lib/context/institution-context"
import { HugeiconsIcon } from "@hugeicons/react"
import { Store01Icon, LockKeyIcon } from "@hugeicons/core-free-icons"
import Link from "next/link"

interface AppHeaderProps {
  breadcrumbs?: {
    label: string
    href?: string
  }[]
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
  const {
    activeInstitution,
    institutionBranches,
    activeBranchId,
    setActiveBranchId,
    isBranchLocked,
    currentUser,
  } = useInstitution()

  const lockedBranch = institutionBranches.find((b) => b.id === currentUser.branchId)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/50 bg-background/95 px-4 backdrop-blur-xs">
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="truncate">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Binhi</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1
              return (
                <React.Fragment key={crumb.label}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast || !crumb.href ? (
                      <BreadcrumbPage className="font-medium text-foreground">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Branch Context Selector / Lock Status */}
        {isBranchLocked && lockedBranch ? (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium">
            <HugeiconsIcon icon={LockKeyIcon} size={13} strokeWidth={2} />
            <span>Branch:</span>
            <span className="font-semibold text-foreground">{lockedBranch.name}</span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <HugeiconsIcon icon={Store01Icon} size={13} strokeWidth={2} />
              Branch:
            </span>
            <Select value={activeBranchId} onValueChange={setActiveBranchId}>
              <SelectTrigger className="h-8 w-44 text-xs font-normal">
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="ALL" className="text-xs">
                  All Branches ({institutionBranches.length})
                </SelectItem>
                {institutionBranches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id} className="text-xs">
                    {branch.name} ({branch.branchCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

     

        <ModeToggle />
      </div>
    </header>
  )
}
