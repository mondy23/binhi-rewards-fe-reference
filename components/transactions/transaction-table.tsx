"use client"

import * as React from "react"
import { Transaction, TransactionType } from "@/lib/types"
import { useInstitution } from "@/lib/context/institution-context"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  ArrowRight02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

interface TransactionTableProps {
  transactions: Transaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const { institutions, institutionBranches } = useInstitution()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedType, setSelectedType] = React.useState<string>("ALL")
  const [selectedBranch, setSelectedBranch] = React.useState<string>("ALL")
  const [selectedReward, setSelectedReward] = React.useState<string>("ALL")

  const institutionMap = React.useMemo(() => {
    return new Map(institutions.map((i) => [i.id, i.name]))
  }, [institutions])

  const branchMap = React.useMemo(() => {
    return new Map(institutionBranches.map((b) => [b.id, b.name]))
  }, [institutionBranches])

  const rewardCodes = React.useMemo(() => {
    const set = new Set<string>()
    transactions.forEach((t) => set.add(t.rewardCode))
    return Array.from(set)
  }, [transactions])

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((txn) => {
      // Search
      const matchesSearch =
        searchTerm === "" ||
        txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.sourceSystem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.sourceReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.description.toLowerCase().includes(searchTerm.toLowerCase())

      // Type filter
      const matchesType = selectedType === "ALL" || txn.type === selectedType

      // Branch filter
      const matchesBranch = selectedBranch === "ALL" || txn.branchId === selectedBranch

      // Reward filter
      const matchesReward = selectedReward === "ALL" || txn.rewardCode === selectedReward

      return matchesSearch && matchesType && matchesBranch && matchesReward
    })
  }, [transactions, searchTerm, selectedType, selectedBranch, selectedReward])

  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case "ISSUE":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "TRANSFER":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "ADJUSTMENT":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "REVERSAL":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
      case "OTHER":
      default:
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedType("ALL")
    setSelectedBranch("ALL")
    setSelectedReward("ALL")
  }

  const hasActiveFilters =
    searchTerm !== "" || selectedType !== "ALL" || selectedBranch !== "ALL" || selectedReward !== "ALL"

  return (
    <div className="space-y-4">
      {/* Clean Enterprise Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            size={15}
            strokeWidth={2}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search reference, system, or memo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="h-9 w-32 text-xs">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">
                All Types
              </SelectItem>
              <SelectItem value="ISSUE" className="text-xs">
                ISSUE
              </SelectItem>
              <SelectItem value="TRANSFER" className="text-xs">
                TRANSFER
              </SelectItem>
              <SelectItem value="ADJUSTMENT" className="text-xs">
                ADJUSTMENT
              </SelectItem>
              <SelectItem value="REVERSAL" className="text-xs">
                REVERSAL
              </SelectItem>
              <SelectItem value="OTHER" className="text-xs">
                OTHER
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Branch Filter */}
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="h-9 w-36 text-xs">
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

          {/* Reward Code Filter */}
          <Select value={selectedReward} onValueChange={setSelectedReward}>
            <SelectTrigger className="h-9 w-28 text-xs">
              <SelectValue placeholder="All Rewards" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">
                All Rewards
              </SelectItem>
              {rewardCodes.map((code) => (
                <SelectItem key={code} value={code} className="text-xs font-mono">
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} className="mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-3">Institution</th>
                <th className="py-3 px-3">Branch / Store</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Reward</th>
                <th className="py-3 px-3 text-right">Change</th>
                <th className="py-3 px-3">Source System</th>
                <th className="py-3 px-4 text-right">Date</th>
                <th className="py-3 px-3 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground text-xs">
                    No ledger transactions matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  const instName = institutionMap.get(txn.institutionId) || "Institution"
                  const branchName = branchMap.get(txn.branchId) || txn.branchId
                  const isPositive = txn.changeAmount > 0
                  const isNegative = txn.changeAmount < 0
                  const changeFormatted = `${isPositive ? "+" : ""}${txn.changeAmount.toLocaleString()}`

                  const dateFormatted = new Date(txn.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })

                  return (
                    <tr
                      key={txn.id}
                      className="group transition-colors hover:bg-muted/40 cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-foreground">
                        <Link
                          href={`/transactions/${txn.id}`}
                          className="hover:underline hover:text-primary flex items-center gap-1.5"
                        >
                          {txn.reference}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground font-medium truncate max-w-36">
                        {instName}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground truncate max-w-32">
                        {branchName}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded border ${getTypeBadge(
                            txn.type
                          )}`}
                        >
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-foreground">
                        {txn.rewardCode}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        <span
                          className={
                            isPositive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : isNegative
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-foreground"
                          }
                        >
                          {changeFormatted}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground text-[11px] truncate max-w-40">
                        {txn.sourceSystem}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground whitespace-nowrap">
                        {dateFormatted}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Link
                          href={`/transactions/${txn.id}`}
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
            Showing <strong className="font-semibold text-foreground">{filteredTransactions.length}</strong> immutable transactions
          </span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
            Append-only double-entry verified
          </span>
        </div>
      </div>
    </div>
  )
}
