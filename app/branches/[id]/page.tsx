"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { useInstitution } from "@/lib/context/institution-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Store01Icon,
  ArrowLeft02Icon,
  Mail01Icon,
  CallIcon,
  Location01Icon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

export default function BranchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  const {
    institutionBranches,
    institutions,
    institutionMembers,
    institutionTransactions,
    institutionRedemptions,
    allUsers,
  } = useInstitution()

  const branch = institutionBranches.find((b) => b.id === id || b.branchCode === id)

  if (!branch) {
    return (
      <>
        <AppHeader
          breadcrumbs={[
            { label: "Administration", href: "/access-control" },
            { label: "Branches" },
            { label: "Not Found" },
          ]}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <h2 className="text-lg font-bold">Branch Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Branch with identifier &apos;{id}&apos; was not found in the current institution.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4 text-xs">
            <Link href="/institutions">
              <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="mr-1.5" />
              Return to Institutions
            </Link>
          </Button>
        </div>
      </>
    )
  }

  const institution = institutions.find((i) => i.id === branch.institutionId)

  // Scoped data for this branch
  const branchMembers = institutionMembers.filter((m) => m.primaryBranchId === branch.id)
  const branchTransactions = institutionTransactions.filter((t) => t.branchId === branch.id)
  const branchRedemptions = institutionRedemptions.filter((r) => r.branchId === branch.id)
  const branchUsers = allUsers.filter((u) => u.branchId === branch.id)

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Administration", href: "/access-control" },
          { label: institution?.name || "Institution", href: `/institutions/${institution?.id}` },
          { label: branch.name },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
              <Link href={`/institutions/${institution?.id}`}>
                <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="mr-1" />
                {institution?.name}
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <HugeiconsIcon icon={Store01Icon} size={20} className="text-primary" />
                  {branch.name}
                </h1>
                <Badge variant="outline" className="font-mono text-xs">
                  {branch.branchCode}
                </Badge>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                  {branch.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Physical store location under <strong className="text-foreground">{institution?.name}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Branch Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <span className="text-xs text-muted-foreground">Store Members</span>
            <div className="text-2xl font-bold font-mono mt-1 text-foreground">
              {branch.memberCount.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Primary registered accounts</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <span className="text-xs text-muted-foreground">Transactions Processed</span>
            <div className="text-2xl font-bold font-mono mt-1 text-foreground">
              {branch.transactionCount.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Originated at this store</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <span className="text-xs text-muted-foreground">Redemptions Fulfillled</span>
            <div className="text-2xl font-bold font-mono mt-1 text-rose-600 dark:text-rose-400">
              {branch.redemptionCount.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Store counter claims</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <span className="text-xs text-muted-foreground">Assigned Staff</span>
            <div className="text-2xl font-bold font-mono mt-1 text-foreground">
              {branchUsers.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Managers & cashiers</p>
          </div>
        </div>

        {/* Branch Details Card */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-2xs">
          <h3 className="font-bold text-sm text-foreground">Branch Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-2">
              <HugeiconsIcon icon={Location01Icon} size={16} className="text-muted-foreground mt-0.5" />
              <div>
                <span className="text-muted-foreground block text-[11px]">Physical Address</span>
                <span className="font-medium text-foreground">{branch.address}, {branch.city}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <HugeiconsIcon icon={Mail01Icon} size={16} className="text-muted-foreground mt-0.5" />
              <div>
                <span className="text-muted-foreground block text-[11px]">Contact Email</span>
                <span className="font-medium text-foreground">{branch.contactEmail}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <HugeiconsIcon icon={CallIcon} size={16} className="text-muted-foreground mt-0.5" />
              <div>
                <span className="text-muted-foreground block text-[11px]">Contact Phone</span>
                <span className="font-medium text-foreground">{branch.contactPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scoped Tabs */}
        <Tabs defaultValue="members" className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="members" className="text-xs">
              Members ({branchMembers.length})
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs">
              Transactions ({branchTransactions.length})
            </TabsTrigger>
            <TabsTrigger value="redemptions" className="text-xs">
              Redemptions ({branchRedemptions.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs">
              Store Staff ({branchUsers.length})
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3 text-right">Points Balance</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {branchMembers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                        No members assigned primarily to this branch yet.
                      </td>
                    </tr>
                  ) : (
                    branchMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-muted/30">
                        <td className="py-3 px-4 font-mono font-semibold">
                          <Link href={`/members/${m.id}`} className="hover:underline">
                            {m.externalReference}
                          </Link>
                        </td>
                        <td className="py-3 px-3 font-medium text-foreground">{m.name}</td>
                        <td className="py-3 px-3 text-muted-foreground">{m.email}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-foreground">
                          {m.balances["POINT"]?.toLocaleString() || 0} PTS
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="text-[10px] text-emerald-600">
                            {m.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3 text-right">Change</th>
                    <th className="py-3 px-3">Source System</th>
                    <th className="py-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {branchTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground font-sans">
                        No transactions recorded for this branch yet.
                      </td>
                    </tr>
                  ) : (
                    branchTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-muted/30">
                        <td className="py-3 px-4 font-semibold text-foreground">
                          <Link href={`/transactions/${t.id}`} className="hover:underline">
                            {t.reference}
                          </Link>
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <Badge variant="outline" className="text-[10px]">
                            {t.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-foreground">
                          {t.changeAmount > 0 ? `+${t.changeAmount}` : t.changeAmount}
                        </td>
                        <td className="py-3 px-3 font-sans text-muted-foreground text-[11px]">
                          {t.sourceSystem}
                        </td>
                        <td className="py-3 px-4 text-right font-sans text-muted-foreground text-[11px]">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Redemptions Tab */}
          <TabsContent value="redemptions">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Redemption Code</th>
                    <th className="py-3 px-3">Member</th>
                    <th className="py-3 px-3">Reward Fulfillled</th>
                    <th className="py-3 px-3 text-right">Points Spent</th>
                    <th className="py-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {branchRedemptions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground font-sans">
                        No redemptions at this branch yet.
                      </td>
                    </tr>
                  ) : (
                    branchRedemptions.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/30">
                        <td className="py-3 px-4 font-semibold text-foreground">{r.redemptionCode}</td>
                        <td className="py-3 px-3 font-sans">{r.memberName}</td>
                        <td className="py-3 px-3 font-sans">{r.rewardName}</td>
                        <td className="py-3 px-3 text-right font-bold text-rose-500">
                          -{r.pointsSpent} PTS
                        </td>
                        <td className="py-3 px-4 text-right font-sans text-muted-foreground text-[11px]">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Store Staff Tab */}
          <TabsContent value="users">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {branchUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs text-muted-foreground">
                        No staff specifically assigned to this store branch.
                      </td>
                    </tr>
                  ) : (
                    branchUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/30">
                        <td className="py-3 px-4 font-semibold text-foreground">{u.name}</td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="text-[10px]">
                            {u.role.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">{u.email}</td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="text-[10px] text-emerald-600">
                            {u.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
