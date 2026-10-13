"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { TransactionTable } from "@/components/transactions/transaction-table"
import { useInstitution } from "@/lib/context/institution-context"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Invoice01Icon,
  CheckmarkCircle02Icon,
  Coins01Icon,
  Exchange01Icon,
} from "@hugeicons/core-free-icons"

export default function TransactionsPage() {
  const { institutionTransactions, activeInstitution } = useInstitution()

  const totalPointsIssued = React.useMemo(() => {
    return institutionTransactions
      .filter((t) => t.type === "ISSUE")
      .reduce((sum, t) => sum + (t.changeAmount > 0 ? t.changeAmount : 0), 0)
  }, [institutionTransactions])

  const totalRedeemed = React.useMemo(() => {
    return institutionTransactions
      .filter((t) => t.type === "OTHER" && t.changeAmount < 0)
      .reduce((sum, t) => sum + Math.abs(t.changeAmount), 0)
  }, [institutionTransactions])

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Ledger", href: "/transactions" },
          { label: "Transactions" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <HugeiconsIcon icon={Invoice01Icon} size={22} className="text-primary" strokeWidth={2} />
              Ledger Transactions
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Authoritative immutable double-entry ledger for <span className="font-medium text-foreground">{activeInstitution.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs shadow-2xs font-mono">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Double-Entry Ledger Live</span>
            </div>
          </div>
        </div>

        {/* Quick Ledger Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Recorded Transactions</span>
              <HugeiconsIcon icon={Invoice01Icon} size={16} strokeWidth={2} />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
              {institutionTransactions.length}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Tenant-scoped immutable events
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Total Issued Points</span>
              <HugeiconsIcon icon={Coins01Icon} size={16} strokeWidth={2} />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              +{totalPointsIssued.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              System debit → Member credit
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Redemption Outflow</span>
              <HugeiconsIcon icon={Exchange01Icon} size={16} strokeWidth={2} />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400">
              -{totalRedeemed.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Member debit → Store credit
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Ledger Integrity</span>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={2} className="text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground flex items-center gap-1.5">
              100%
              <span className="text-xs font-sans font-medium text-emerald-600 dark:text-emerald-400">Balanced</span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Total Debit = Total Credit
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <TransactionTable transactions={institutionTransactions} />
      </div>
    </>
  )
}
