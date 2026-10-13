"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { useInstitution } from "@/lib/context/institution-context"
import { LedgerMovement } from "@/components/transactions/ledger-movement"
import { BeforeAfterCard } from "@/components/transactions/before-after-card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft02Icon,
  Invoice01Icon,
  CheckmarkCircle02Icon,
  Building03Icon,
  FingerPrintIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  const { institutionTransactions, institutions, institutionBranches } = useInstitution()

  const transaction = institutionTransactions.find((t) => t.id === id || t.reference === id)

  if (!transaction) {
    return (
      <>
        <AppHeader
          breadcrumbs={[
            { label: "Ledger", href: "/transactions" },
            { label: "Transactions", href: "/transactions" },
            { label: "Not Found" },
          ]}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <HugeiconsIcon icon={Invoice01Icon} size={24} />
          </div>
          <h2 className="text-lg font-bold">Transaction Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            The transaction reference &apos;{id}&apos; was not found within the active institution scope or does not exist.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4 text-xs">
            <Link href="/transactions">
              <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="mr-1.5" />
              Return to Transactions
            </Link>
          </Button>
        </div>
      </>
    )
  }

  const institution = institutions.find((i) => i.id === transaction.institutionId)
  const branch = institutionBranches.find((b) => b.id === transaction.branchId)

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "ISSUE":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "TRANSFER":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "ADJUSTMENT":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "REVERSAL":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
      default:
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
    }
  }

  const dateFormatted = new Date(transaction.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ledger", href: "/transactions" },
          { label: "Transactions", href: "/transactions" },
          { label: transaction.reference },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 max-w-6xl w-full mx-auto">
        {/* Back navigation & action banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
              <Link href="/transactions">
                <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="mr-1" />
                Transactions
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
                {transaction.reference}
              </h1>
              <span
                className={`text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded border ${getTypeBadge(
                  transaction.type
                )}`}
              >
                {transaction.type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} strokeWidth={2.5} />
              Immutable Ledger Record
            </div>
          </div>
        </div>

        {/* Narrative Section: What Happened? */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <HugeiconsIcon icon={InformationCircleIcon} size={14} />
            Business Event Summary
          </div>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {transaction.description || `Transaction recorded for ${transaction.type} of ${transaction.rewardCode}`}
          </p>
          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-4 pt-1">
            <span>
              Recorded at: <strong className="text-foreground font-mono">{dateFormatted}</strong>
            </span>
            <span>•</span>
            <span>
              Tenant: <strong className="text-foreground">{institution?.name}</strong>
            </span>
            <span>•</span>
            <span>
              Origin: <strong className="text-foreground">{branch?.name || "Global"}</strong>
            </span>
          </div>
        </div>

        {/* Section: Who / What was affected? Before -> Change -> After */}
        <BeforeAfterCard impacts={transaction.memberImpacts} />

        {/* Section: Ledger Movement Double-Entry */}
        <LedgerMovement entries={transaction.entries} rewardCode={transaction.rewardCode} />

        {/* Grid: Source & Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Information */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
            <div className="pb-2 border-b border-border/60">
              <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                <HugeiconsIcon icon={Building03Icon} size={16} strokeWidth={2} className="text-primary" />
                Originating Source
              </h3>
              <p className="text-xs text-muted-foreground">
                External business system that authorized this event
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                <dt className="text-muted-foreground text-[11px]">Institution</dt>
                <dd className="font-semibold text-foreground mt-0.5">{institution?.name || "—"}</dd>
              </div>

              <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                <dt className="text-muted-foreground text-[11px]">Branch / Store</dt>
                <dd className="font-semibold text-foreground mt-0.5">{branch?.name || "Global / Online"}</dd>
              </div>

              <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                <dt className="text-muted-foreground text-[11px]">Source System</dt>
                <dd className="font-semibold text-foreground mt-0.5">{transaction.sourceSystem}</dd>
              </div>

              <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                <dt className="text-muted-foreground text-[11px]">Source Reference</dt>
                <dd className="font-mono font-semibold text-foreground mt-0.5">{transaction.sourceReference}</dd>
              </div>
            </dl>
          </div>

          {/* Audit Metadata */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
            <div className="pb-2 border-b border-border/60">
              <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
                <HugeiconsIcon icon={FingerPrintIcon} size={16} strokeWidth={2} className="text-primary" />
                Transaction Metadata
              </h3>
              <p className="text-xs text-muted-foreground">
                Ledger idempotency and cryptographic tracking headers
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                <dt className="text-muted-foreground text-[11px]">Transaction Reference</dt>
                <dd className="font-mono font-semibold text-foreground mt-0.5">{transaction.reference}</dd>
              </div>

              <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                <dt className="text-muted-foreground text-[11px]">Reward Code</dt>
                <dd className="font-mono font-semibold text-foreground mt-0.5">{transaction.rewardCode}</dd>
              </div>

              <div className="p-3 rounded-lg bg-muted/20 border border-border/50 col-span-2">
                <dt className="text-muted-foreground text-[11px]">Idempotency Key</dt>
                <dd className="font-mono text-xs font-semibold text-foreground mt-0.5 truncate">
                  {transaction.idempotencyKey}
                </dd>
              </div>

              <div className="p-3 rounded-lg bg-muted/20 border border-border/50 col-span-2">
                <dt className="text-muted-foreground text-[11px]">Created Timestamp</dt>
                <dd className="font-mono text-xs text-muted-foreground mt-0.5">
                  {dateFormatted} ({transaction.createdAt})
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  )
}
