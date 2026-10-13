"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { useInstitution } from "@/lib/context/institution-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Shield01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  LockKeyIcon,
  Building03Icon,
  Store01Icon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons"

export default function AccessControlPage() {
  const {
    allUsers,
    roles,
    currentUser,
    setCurrentUserId,
    institutions,
    institutionBranches,
  } = useInstitution()

  const [activeTab, setActiveTab] = React.useState("users")

  const institutionMap = React.useMemo(() => {
    return new Map(institutions.map((i) => [i.id, i.name]))
  }, [institutions])

  const branchMap = React.useMemo(() => {
    return new Map(institutionBranches.map((b) => [b.id, b.name]))
  }, [institutionBranches])

  const getRoleBadge = (role: string) => {
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
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Administration", href: "/access-control" },
          { label: "Access Control" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <HugeiconsIcon icon={Shield01Icon} size={22} className="text-primary" strokeWidth={2} />
              ARBAC & Access Governance
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Attribute and Role-Based Access Control, tenant boundaries, and operator permissions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono py-1 px-2.5">
              Active Actor: <strong className="ml-1 text-foreground">{currentUser.name}</strong> ({currentUser.role})
            </Badge>
          </div>
        </div>

        {/* Conceptual Distinction Callout Banner */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3 text-xs leading-relaxed">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <HugeiconsIcon icon={SecurityCheckIcon} size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground text-xs">
              Architectural Domain Distinction: Binhi Users vs. Institution Members
            </h4>
            <p className="text-muted-foreground">
              <strong>Binhi Users</strong> are administrative operators governed by ARBAC roles (Super Admin, Institution Admin, Store Staff). They access this portal to manage ledgers, configure rewards, and execute redemptions.
              In contrast, <strong>Members</strong> are external customer ledger accounts whose reward point balances are tracked by Binhi. Members do not log into Binhi.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="users" className="text-xs">
              Binhi Users ({allUsers.length})
            </TabsTrigger>
            <TabsTrigger value="roles" className="text-xs">
              Roles & Permissions Matrix
            </TabsTrigger>
            <TabsTrigger value="hierarchy" className="text-xs">
              Privilege Hierarchy & Security Rules
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: USERS */}
          <TabsContent value="users" className="space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                      <th className="py-3 px-4">Operator User</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Tenant Scope</th>
                      <th className="py-3 px-3">Branch Scope</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Last Active</th>
                      <th className="py-3 px-4 text-right">ARBAC Simulation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {allUsers.map((user) => {
                      const isSimulated = user.id === currentUser.id
                      const instName = user.institutionId
                        ? institutionMap.get(user.institutionId) || user.institutionId
                        : "Global Platform (All)"
                      const branchName = user.branchId
                        ? branchMap.get(user.branchId) || user.branchId
                        : "All Branches"

                      return (
                        <tr
                          key={user.id}
                          className={`transition-colors ${
                            isSimulated ? "bg-primary/5" : "hover:bg-muted/30"
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="size-7 rounded-md border border-border">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="text-[10px]">
                                  {user.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="font-semibold text-foreground flex items-center gap-1.5">
                                  {user.name}
                                  {isSimulated && (
                                    <Badge className="text-[9px] py-0 px-1 bg-primary text-primary-foreground">
                                      Active Session
                                    </Badge>
                                  )}
                                </span>
                                <span className="text-[11px] text-muted-foreground block">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getRoleBadge(
                                user.role
                              )}`}
                            >
                              {user.role.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-medium text-foreground truncate max-w-40">
                            <div className="flex items-center gap-1">
                              <HugeiconsIcon icon={Building03Icon} size={12} className="text-muted-foreground" />
                              <span>{instName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground truncate max-w-36">
                            <div className="flex items-center gap-1">
                              <HugeiconsIcon icon={Store01Icon} size={12} className="text-muted-foreground" />
                              <span>{branchName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            >
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground text-[11px]">
                            {user.lastActive}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant={isSimulated ? "secondary" : "outline"}
                              size="sm"
                              disabled={isSimulated}
                              onClick={() => setCurrentUserId(user.id)}
                              className="h-7 text-xs px-2.5"
                            >
                              {isSimulated ? "Current Actor" : "Simulate As"}
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: ROLES & PERMISSIONS MATRIX */}
          <TabsContent value="roles" className="space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                      <th className="py-3 px-4">Role Title</th>
                      <th className="py-3 px-3">Boundary Scope</th>
                      <th className="py-3 px-2 text-center">Ledger View</th>
                      <th className="py-3 px-2 text-center">Ledger Export</th>
                      <th className="py-3 px-2 text-center">Members Mgmt</th>
                      <th className="py-3 px-2 text-center">Rewards Mgmt</th>
                      <th className="py-3 px-2 text-center">Redeem Counter</th>
                      <th className="py-3 px-2 text-center">Games Mgmt</th>
                      <th className="py-3 px-2 text-center">Tenants Mgmt</th>
                      <th className="py-3 px-2 text-center">Users Mgmt</th>
                      <th className="py-3 px-2 text-center">Branding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {roles.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/20">
                        <td className="py-3 px-4 font-semibold text-foreground">
                          <div>
                            <span>{r.title}</span>
                            <span className="block font-mono text-[10px] text-muted-foreground">
                              {r.role}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <Badge variant="outline" className="text-[10px]">
                            {r.scope}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-center">
                          {r.permissions.ledgerView ? (
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="text-emerald-500 inline" />
                          ) : (
                            <HugeiconsIcon icon={Cancel01Icon} size={15} className="text-muted-foreground/40 inline" />
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {r.permissions.ledgerExport ? (
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="text-emerald-500 inline" />
                          ) : (
                            <HugeiconsIcon icon={Cancel01Icon} size={15} className="text-muted-foreground/40 inline" />
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {r.permissions.membersManage ? (
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="text-emerald-500 inline" />
                          ) : (
                            <HugeiconsIcon icon={Cancel01Icon} size={15} className="text-muted-foreground/40 inline" />
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {r.permissions.rewardsManage ? (
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="text-emerald-500 inline" />
                          ) : (
                            <HugeiconsIcon icon={Cancel01Icon} size={15} className="text-muted-foreground/40 inline" />
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {r.permissions.redemptionsPerform ? (
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="text-emerald-500 inline" />
                          ) : (
                            <HugeiconsIcon icon={Cancel01Icon} size={15} className="text-muted-foreground/40 inline" />
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {r.permissions.gamesManage ? (
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="text-emerald-500 inline" />
                          ) : (
                            <HugeiconsIcon icon={Cancel01Icon} size={15} className="text-muted-foreground/40 inline" />
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {r.permissions.institutionsManage ? (
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="text-emerald-500 inline" />
                          ) : (
                            <HugeiconsIcon icon={Cancel01Icon} size={15} className="text-muted-foreground/40 inline" />
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {r.permissions.usersManage ? (
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="text-emerald-500 inline" />
                          ) : (
                            <HugeiconsIcon icon={Cancel01Icon} size={15} className="text-muted-foreground/40 inline" />
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {r.permissions.brandingManage ? (
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="text-emerald-500 inline" />
                          ) : (
                            <HugeiconsIcon icon={Cancel01Icon} size={15} className="text-muted-foreground/40 inline" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: HIERARCHY */}
          <TabsContent value="hierarchy" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <HugeiconsIcon icon={LockKeyIcon} size={16} className="text-primary" />
                  Role Hierarchy & Privilege Boundaries
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Binhi enforces strict monotonic privilege isolation. Lower-privilege administrators cannot grant, revoke, or escalate privileges above their ceiling.
                </p>

                <div className="space-y-2 font-mono text-xs pt-2">
                  <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/5">
                    <span className="font-bold text-rose-600 dark:text-rose-400">1. SUPER_ADMIN (Global Platform)</span>
                    <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                      Cross-tenant control, institution provisioning, global audit access.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 ml-3">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">2. INSTITUTION_ADMIN (Tenant Scoped)</span>
                    <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                      Full authority strictly inside tenant boundary. Cannot see other institutions.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 ml-6">
                    <span className="font-bold text-amber-600 dark:text-amber-400">3. STORE_MANAGER (Branch Scoped)</span>
                    <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                      Manages store redemptions, staff oversight, and branch-level metrics.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 ml-9">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">4. STORE_STAFF (Counter Staff)</span>
                    <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                      Redemption counter execution only. Cannot modify configurations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <HugeiconsIcon icon={SecurityCheckIcon} size={16} className="text-primary" />
                  Golden Security Invariants
                </h3>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>
                      <strong className="text-foreground">Never Trust the Frontend:</strong> All tenant and branch boundaries must be validated server-side. RLS establishes tenant context via <code className="font-mono text-foreground">SET LOCAL app.current_institution_id</code>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>
                      <strong className="text-foreground">Append-Only Ledger:</strong> Historical ledger transactions and balance mutations cannot be updated or deleted. Corrections require explicit reversal events.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>
                      <strong className="text-foreground">Store Isolation:</strong> Store staff in Makati cannot view or alter Cebu store data. Scope is locked at the database session level.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
