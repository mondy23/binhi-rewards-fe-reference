"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { useInstitution } from "@/lib/context/institution-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft02Icon,
  UserGroupIcon,
  Coins01Icon,
  Ticket02Icon,
  Store01Icon,
  Invoice01Icon,
  Mail01Icon,
  CallIcon,
  ArrowRight02Icon,
  GiftIcon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  const { institutionMembers, institutionTransactions, institutionBranches } = useInstitution()

  const member = institutionMembers.find((m) => m.id === id || m.externalReference === id)

  if (!member) {
    return (
      <>
        <AppHeader
          breadcrumbs={[
            { label: "Ledger", href: "/transactions" },
            { label: "Members", href: "/members" },
            { label: "Not Found" },
          ]}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <HugeiconsIcon icon={UserGroupIcon} size={24} />
          </div>
          <h2 className="text-lg font-bold">Member Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Member with identifier &apos;{id}&apos; was not found in the currently selected institution.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4 text-xs">
            <Link href="/members">
              <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="mr-1.5" />
              Back to Members
            </Link>
          </Button>
        </div>
      </>
    )
  }

  const primaryBranch = institutionBranches.find((b) => b.id === member.primaryBranchId)

  // Find all transactions impacting this member
  const memberTransactions = institutionTransactions.filter((txn) =>
    txn.memberImpacts?.some((impact) => impact.memberId === member.id || impact.memberReference === member.externalReference)
  )

  const pointsBalance = member.balances["POINT"] || 0

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ledger", href: "/transactions" },
          { label: "Members", href: "/members" },
          { label: member.externalReference },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 max-w-6xl w-full mx-auto">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
              <Link href="/members">
                <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="mr-1" />
                Members
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">{member.name}</h1>
              <Badge variant="outline" className="font-mono text-xs">
                {member.externalReference}
              </Badge>
              <Badge
                className={
                  member.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-muted text-muted-foreground border-border"
                }
              >
                {member.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="text-xs gap-1.5">
              <Link href={`/redemptions?memberId=${member.id}`}>
                <HugeiconsIcon icon={GiftIcon} size={14} strokeWidth={2} />
                Fulfill Redemption
              </Link>
            </Button>
          </div>
        </div>

        {/* Member Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Contact & Identity */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/50">
              <span>External Identity</span>
              <span className="font-mono text-[10px] text-primary">CUS REF</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px]">Primary Branch / Store:</span>
                <p className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                  <HugeiconsIcon icon={Store01Icon} size={14} className="text-muted-foreground" />
                  {primaryBranch?.name || "Global / Unassigned"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px]">Email Address:</span>
                <p className="font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                  <HugeiconsIcon icon={Mail01Icon} size={14} className="text-muted-foreground" />
                  {member.email}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px]">Contact Phone:</span>
                <p className="font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                  <HugeiconsIcon icon={CallIcon} size={14} className="text-muted-foreground" />
                  {member.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Active Primary Balance */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/50">
              <span>Active Balance</span>
              <HugeiconsIcon icon={Coins01Icon} size={15} className="text-primary" />
            </div>
            <div className="pt-2">
              <div className="text-3xl font-extrabold font-mono text-foreground">
                {pointsBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Authoritative Points in Circulation</p>
            </div>
            <div className="pt-3 border-t border-border/50 flex justify-between text-[11px]">
              <span className="text-muted-foreground">Lifetime Earned:</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                +{member.totalPointsEarned.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">Lifetime Redeemed:</span>
              <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                -{member.totalPointsRedeemed.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Other Reward Holdings */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/50">
              <span>Other Reward Holdings</span>
              <HugeiconsIcon icon={Ticket02Icon} size={15} />
            </div>
            <div className="space-y-2 pt-1">
              {Object.entries(member.balances)
                .filter(([code]) => code !== "POINT")
                .map(([code, qty]) => (
                  <div
                    key={code}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50 text-xs"
                  >
                    <span className="font-mono font-semibold text-foreground">{code}</span>
                    <Badge variant="secondary" className="font-mono font-bold">
                      {qty} held
                    </Badge>
                  </div>
                ))}

              {Object.keys(member.balances).length <= 1 && (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No additional vouchers or coupons held.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Member Ledger Activity */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                <HugeiconsIcon icon={Invoice01Icon} size={16} strokeWidth={2} className="text-primary" />
                Ledger Movement History
              </h3>
              <p className="text-xs text-muted-foreground">
                Every immutable transaction that mutated this member account&apos;s ledger balance
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {memberTransactions.length} events
            </Badge>
          </div>

          {memberTransactions.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No transaction history recorded yet for this member.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-right">Before</th>
                    <th className="py-2.5 px-3 text-right">Mutation</th>
                    <th className="py-2.5 px-3 text-right">After</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {memberTransactions.map((txn) => {
                    const impact = txn.memberImpacts.find(
                      (i) => i.memberId === member.id || i.memberReference === member.externalReference
                    )
                    const isPositive = (impact?.change || 0) > 0

                    return (
                      <tr key={txn.id} className="hover:bg-muted/30">
                        <td className="py-2.5 px-3 font-semibold text-foreground">
                          <Link href={`/transactions/${txn.id}`} className="hover:underline">
                            {txn.reference}
                          </Link>
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <Badge variant="outline" className="text-[10px]">
                            {txn.type}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right text-muted-foreground">
                          {impact ? `${impact.beforeBalance.toLocaleString()} ${impact.rewardCode}` : "—"}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold">
                          {impact ? (
                            <span
                              className={
                                isPositive
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }
                            >
                              {isPositive ? "+" : ""}
                              {impact.change.toLocaleString()} {impact.rewardCode}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-foreground">
                          {impact ? `${impact.afterBalance.toLocaleString()} ${impact.rewardCode}` : "—"}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap font-sans text-[11px]">
                          {new Date(txn.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <Link
                            href={`/transactions/${txn.id}`}
                            className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <HugeiconsIcon icon={ArrowRight02Icon} size={14} strokeWidth={2} />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
