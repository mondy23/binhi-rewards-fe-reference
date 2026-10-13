"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { useInstitution } from "@/lib/context/institution-context"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  UserGroupIcon,
  Coins01Icon,
  Exchange01Icon,
  Store01Icon,
  ArrowRight02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

export default function MembersPage() {
  const { institutionMembers, institutionBranches, activeInstitution } = useInstitution()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedBranch, setSelectedBranch] = React.useState<string>("ALL")
  const [selectedStatus, setSelectedStatus] = React.useState<string>("ALL")

  const branchMap = React.useMemo(() => {
    return new Map(institutionBranches.map((b) => [b.id, b.name]))
  }, [institutionBranches])

  const filteredMembers = React.useMemo(() => {
    return institutionMembers.filter((m) => {
      const matchesSearch =
        searchTerm === "" ||
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.externalReference.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesBranch = selectedBranch === "ALL" || m.primaryBranchId === selectedBranch
      const matchesStatus = selectedStatus === "ALL" || m.status === selectedStatus

      return matchesSearch && matchesBranch && matchesStatus
    })
  }, [institutionMembers, searchTerm, selectedBranch, selectedStatus])

  const totalPointsInCirculation = React.useMemo(() => {
    return institutionMembers.reduce((sum, m) => sum + (m.balances["POINT"] || 0), 0)
  }, [institutionMembers])

  const totalEarnedAll = React.useMemo(() => {
    return institutionMembers.reduce((sum, m) => sum + m.totalPointsEarned, 0)
  }, [institutionMembers])

  const totalRedeemedAll = React.useMemo(() => {
    return institutionMembers.reduce((sum, m) => sum + m.totalPointsRedeemed, 0)
  }, [institutionMembers])

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ledger", href: "/transactions" },
          { label: "Members" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <HugeiconsIcon icon={UserGroupIcon} size={22} className="text-primary" strokeWidth={2} />
              Member Ledger Accounts
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customer reward balances tracked by Binhi for <span className="font-medium text-foreground">{activeInstitution.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs px-2.5 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground">
              External Customers • <strong className="text-foreground">Non-Login Accounts</strong>
            </div>
          </div>
        </div>

        {/* Member Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Tracked Members</span>
              <HugeiconsIcon icon={UserGroupIcon} size={16} strokeWidth={2} />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
              {institutionMembers.length.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Tenant-scoped ledger entities
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Circulating Points</span>
              <HugeiconsIcon icon={Coins01Icon} size={16} strokeWidth={2} />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
              {totalPointsInCirculation.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Aggregate member active balance
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Lifetime Earned</span>
              <HugeiconsIcon icon={Coins01Icon} size={16} strokeWidth={2} className="text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              +{totalEarnedAll.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Cumulative point issuance
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Lifetime Redeemed</span>
              <HugeiconsIcon icon={Exchange01Icon} size={16} strokeWidth={2} className="text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400">
              -{totalRedeemedAll.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Redemption counter outflow
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <HugeiconsIcon
              icon={Search01Icon}
              size={15}
              strokeWidth={2}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search member name, external ref (e.g. CUS-100293), or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="h-9 w-40 text-xs">
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">
                  All Branches
                </SelectItem>
                {institutionBranches.map((b) => (
                  <SelectItem key={b.id} value={b.id} className="text-xs">
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 w-32 text-xs">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">
                  All Status
                </SelectItem>
                <SelectItem value="ACTIVE" className="text-xs">
                  Active
                </SelectItem>
                <SelectItem value="SUSPENDED" className="text-xs">
                  Suspended
                </SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || selectedBranch !== "ALL" || selectedStatus !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedBranch("ALL")
                  setSelectedStatus("ALL")
                }}
                className="h-9 px-2 text-xs text-muted-foreground"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} className="mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Member Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">External Reference</th>
                  <th className="py-3 px-3">Member Name</th>
                  <th className="py-3 px-3">Primary Branch</th>
                  <th className="py-3 px-3 text-right">Points Balance</th>
                  <th className="py-3 px-3">Other Holdings</th>
                  <th className="py-3 px-3 text-right">Earned / Redeemed</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground text-xs">
                      No member ledger accounts match the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => {
                    const branchName = branchMap.get(member.primaryBranchId) || member.primaryBranchId
                    const points = member.balances["POINT"] || 0

                    // Other non-point holdings
                    const otherHoldings = Object.entries(member.balances).filter(
                      ([key]) => key !== "POINT"
                    )

                    return (
                      <tr
                        key={member.id}
                        className="group transition-colors hover:bg-muted/40 cursor-pointer"
                      >
                        <td className="py-3 px-4 font-mono font-semibold text-foreground">
                          <Link
                            href={`/members/${member.id}`}
                            className="hover:underline hover:text-primary"
                          >
                            {member.externalReference}
                          </Link>
                        </td>
                        <td className="py-3 px-3 font-medium text-foreground">
                          <div className="flex flex-col">
                            <span>{member.name}</span>
                            <span className="text-[11px] text-muted-foreground">{member.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground truncate max-w-36">
                          <div className="flex items-center gap-1">
                            <HugeiconsIcon icon={Store01Icon} size={12} className="text-muted-foreground/70" />
                            <span>{branchName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-foreground">
                          {points.toLocaleString()} <span className="text-[11px] font-normal text-muted-foreground">PTS</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {otherHoldings.length === 0 ? (
                              <span className="text-muted-foreground text-[11px]">—</span>
                            ) : (
                              otherHoldings.map(([code, qty]) => (
                                <Badge key={code} variant="secondary" className="text-[10px] py-0 px-1 font-mono">
                                  {code}: {qty}
                                </Badge>
                              ))
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[11px]">
                          <span className="text-emerald-600 dark:text-emerald-400">+{member.totalPointsEarned.toLocaleString()}</span>
                          <span className="text-muted-foreground mx-1">/</span>
                          <span className="text-rose-600 dark:text-rose-400">-{member.totalPointsRedeemed.toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded border ${
                              member.status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Link
                            href={`/members/${member.id}`}
                            className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <HugeiconsIcon icon={ArrowRight02Icon} size={14} strokeWidth={2} />
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/60 bg-muted/15 text-[11px] text-muted-foreground">
            <span>
              Showing <strong className="font-semibold text-foreground">{filteredMembers.length}</strong> of{" "}
              {institutionMembers.length} members
            </span>
            <span>External customer identity system integration verified</span>
          </div>
        </div>
      </div>
    </>
  )
}
