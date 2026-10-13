"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { useInstitution } from "@/lib/context/institution-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Invoice01Icon,
  Coins01Icon,
  Exchange01Icon,
  UserGroupIcon,
  GiftIcon,
  Store01Icon,
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

export default function Dashboard() {
  const {
    activeInstitution,
    institutionTransactions,
    institutionMembers,
    institutionRewards,
    institutionBranches,
  } = useInstitution()

  // Compute key statistics
  const totalPointsIssued = React.useMemo(() => {
    return institutionTransactions
      .filter((t) => t.type === "ISSUE")
      .reduce((sum, t) => sum + (t.changeAmount > 0 ? t.changeAmount : 0), 0)
  }, [institutionTransactions])

  const totalPointsRedeemed = React.useMemo(() => {
    return institutionTransactions
      .filter((t) => t.type === "OTHER" && t.changeAmount < 0)
      .reduce((sum, t) => sum + Math.abs(t.changeAmount), 0)
  }, [institutionTransactions])

  const recentTransactions = React.useMemo(() => {
    return institutionTransactions.slice(0, 5)
  }, [institutionTransactions])

  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Dashboard" }]} />

      <div className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Tenant Hero Banner */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className="size-12 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-xs shrink-0"
              style={{ backgroundColor: activeInstitution.branding.primaryColor }}
            >
              {activeInstitution.branding.logoText || activeInstitution.code.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {activeInstitution.name}
                </h1>
                <Badge variant="secondary" className="text-xs">
                  {activeInstitution.plan}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeInstitution.branding.slogan} • Ledger Currency:{" "}
                <strong className="text-foreground">{activeInstitution.branding.currencyName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} strokeWidth={2.5} />
              Double-Entry Ledger Verified
            </div>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Total Points Issued</span>
              <HugeiconsIcon icon={Coins01Icon} size={16} strokeWidth={2} className="text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              +{totalPointsIssued.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
              <span>Debit: Treasury</span>
              <span>•</span>
              <span>Credit: Members</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Total Points Redeemed</span>
              <HugeiconsIcon icon={Exchange01Icon} size={16} strokeWidth={2} className="text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400">
              -{totalPointsRedeemed.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
              <span>Debit: Members</span>
              <span>•</span>
              <span>Credit: Settlement</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Active Members</span>
              <HugeiconsIcon icon={UserGroupIcon} size={16} strokeWidth={2} />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
              {institutionMembers.length.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Accounts in good standing
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Reward Catalog</span>
              <HugeiconsIcon icon={GiftIcon} size={16} strokeWidth={2} />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
              {institutionRewards.length}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Active rewards & vouchers
            </div>
          </div>
        </div>

        {/* 2-Column Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3 width): Recent Transactions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <HugeiconsIcon icon={Invoice01Icon} size={16} className="text-primary" />
                    Recent Ledger Activity
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Latest balanced immutable transactions recorded for this institution
                  </p>
                </div>

                <Button asChild variant="outline" size="sm" className="text-xs h-8">
                  <Link href="/transactions">
                    View Full Ledger
                    <HugeiconsIcon icon={ArrowRight02Icon} size={13} className="ml-1" />
                  </Link>
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold font-sans">
                      <th className="py-2.5 px-3">Reference</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3 text-right">Mutation</th>
                      <th className="py-2.5 px-3">Source System</th>
                      <th className="py-2.5 px-3 text-right font-sans">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {recentTransactions.map((txn) => {
                      const isPositive = txn.changeAmount > 0
                      const isNegative = txn.changeAmount < 0

                      return (
                        <tr key={txn.id} className="hover:bg-muted/30">
                          <td className="py-2.5 px-3 font-semibold text-foreground">
                            <Link href={`/transactions/${txn.id}`} className="hover:underline hover:text-primary">
                              {txn.reference}
                            </Link>
                          </td>
                          <td className="py-2.5 px-3 font-sans">
                            <Badge variant="outline" className="text-[10px] py-0">
                              {txn.type}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold">
                            <span
                              className={
                                isPositive
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : isNegative
                                  ? "text-rose-600 dark:text-rose-400"
                                  : "text-foreground"
                              }
                            >
                              {isPositive ? `+${txn.changeAmount}` : txn.changeAmount} {txn.rewardCode}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-sans text-muted-foreground text-[11px] truncate max-w-40">
                            {txn.sourceSystem}
                          </td>
                          <td className="py-2.5 px-3 text-right font-sans text-muted-foreground text-[11px] whitespace-nowrap">
                            {new Date(txn.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/redemptions"
                className="group rounded-xl border border-border bg-card p-4 shadow-2xs hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <HugeiconsIcon icon={Exchange01Icon} size={16} />
                  </div>
                  <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                    Store Redemption
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Fulfill counter reward voucher
                  </p>
                </div>
                <div className="pt-3 text-[11px] font-semibold text-primary flex items-center gap-1">
                  Launch Counter <HugeiconsIcon icon={ArrowRight02Icon} size={12} />
                </div>
              </Link>

              <Link
                href="/rewards"
                className="group rounded-xl border border-border bg-card p-4 shadow-2xs hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="size-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                    <HugeiconsIcon icon={GiftIcon} size={16} />
                  </div>
                  <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                    Reward Catalog
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Configure points, vouchers & tickets
                  </p>
                </div>
                <div className="pt-3 text-[11px] font-semibold text-primary flex items-center gap-1">
                  Manage Catalog <HugeiconsIcon icon={ArrowRight02Icon} size={12} />
                </div>
              </Link>

              <Link
                href="/members"
                className="group rounded-xl border border-border bg-card p-4 shadow-2xs hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                    <HugeiconsIcon icon={UserGroupIcon} size={16} />
                  </div>
                  <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                    Member Accounts
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Inspect customer ledger balances
                  </p>
                </div>
                <div className="pt-3 text-[11px] font-semibold text-primary flex items-center gap-1">
                  View Balances <HugeiconsIcon icon={ArrowRight02Icon} size={12} />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column (1/3 width): Branches / Stores List */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <HugeiconsIcon icon={Store01Icon} size={16} className="text-primary" />
                    Store Branches
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Physical stores under {activeInstitution.name}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {institutionBranches.length}
                </Badge>
              </div>

              <div className="space-y-3">
                {institutionBranches.map((branch) => (
                  <Link
                    key={branch.id}
                    href={`/branches/${branch.id}`}
                    className="block p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-foreground">{branch.name}</span>
                      <Badge variant="outline" className="font-mono text-[10px] py-0">
                        {branch.branchCode}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2">
                      <span>{branch.memberCount.toLocaleString()} members</span>
                      <span>{branch.transactionCount.toLocaleString()} txns</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Platform Security Badge */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-2xs space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <HugeiconsIcon icon={SparklesIcon} size={15} className="text-emerald-500" />
                Ledger Guarantees
              </div>
              <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                <li>• Append-only immutable record store</li>
                <li>• Zero-drift double-entry verification</li>
                <li>• PostgreSQL Row-Level Security tenant boundary</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
