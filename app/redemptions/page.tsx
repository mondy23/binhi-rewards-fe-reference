"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { useInstitution } from "@/lib/context/institution-context"
import { Redemption } from "@/lib/types"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Exchange01Icon,
  Search01Icon,
  GiftIcon,
  CheckmarkCircle02Icon,
  Store01Icon,
  Invoice01Icon,
  AlertCircleIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

export default function RedemptionsPage() {
  const {
    institutionRedemptions,
    institutionMembers,
    institutionRewards,
    institutionBranches,
    activeInstitution,
    userPermissions,
    createRedemption,
    currentUser,
  } = useInstitution()

  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedBranch, setSelectedBranch] = React.useState<string>("ALL")

  // Redemption dialog workflow state
  const [isRedeemOpen, setIsRedeemOpen] = React.useState(false)
  const [selectedMemberId, setSelectedMemberId] = React.useState("")
  const [selectedRewardId, setSelectedRewardId] = React.useState("")
  const [redemptionBranchId, setRedemptionBranchId] = React.useState(
    currentUser.branchId || institutionBranches[0]?.id || ""
  )
  const [redemptionResult, setRedemptionResult] = React.useState<{
    success: boolean
    error?: string
    redemption?: Redemption
    transactionRef?: string
    transactionId?: string
  } | null>(null)

  const branchMap = React.useMemo(() => {
    return new Map(institutionBranches.map((b) => [b.id, b.name]))
  }, [institutionBranches])

  const filteredRedemptions = React.useMemo(() => {
    return institutionRedemptions.filter((r) => {
      const matchesSearch =
        searchTerm === "" ||
        r.redemptionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.memberReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.rewardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.rewardCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.transactionReference.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesBranch = selectedBranch === "ALL" || r.branchId === selectedBranch

      return matchesSearch && matchesBranch
    })
  }, [institutionRedemptions, searchTerm, selectedBranch])

  const selectedMember = institutionMembers.find((m) => m.id === selectedMemberId)
  const selectedReward = institutionRewards.find((r) => r.id === selectedRewardId)

  // Redeemable rewards (those that cost points)
  const redeemableRewards = institutionRewards.filter(
    (r) => r.costInPoints && r.costInPoints > 0 && r.status === "ACTIVE"
  )

  const memberPoints = selectedMember?.balances["POINT"] || 0
  const pointsRequired = selectedReward?.costInPoints || 0
  const hasSufficientPoints = selectedMember ? memberPoints >= pointsRequired : false

  const handleExecuteRedemption = () => {
    if (!selectedMemberId || !selectedRewardId) return

    const result = createRedemption({
      memberId: selectedMemberId,
      rewardId: selectedRewardId,
      branchId: redemptionBranchId || institutionBranches[0]?.id,
    })

    if (result.success && result.redemption && result.transaction) {
      setRedemptionResult({
        success: true,
        redemption: result.redemption,
        transactionRef: result.transaction.reference,
        transactionId: result.transaction.id,
      })
    } else {
      setRedemptionResult({
        success: false,
        error: result.error || "Failed to process redemption",
      })
    }
  }

  const handleResetDialog = () => {
    setSelectedMemberId("")
    setSelectedRewardId("")
    setRedemptionResult(null)
    setIsRedeemOpen(false)
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Rewards", href: "/rewards" },
          { label: "Redemptions" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <HugeiconsIcon icon={Exchange01Icon} size={22} className="text-primary" strokeWidth={2} />
              Store Redemptions
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Point-of-service counter redemption events & balanced ledger fulfillments for{" "}
              <span className="font-medium text-foreground">{activeInstitution.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {userPermissions.redemptionsPerform && (
              <Dialog open={isRedeemOpen} onOpenChange={setIsRedeemOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs gap-1.5 shadow-2xs">
                    <HugeiconsIcon icon={GiftIcon} size={14} strokeWidth={2} />
                    Fulfill Counter Redemption
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-base font-bold flex items-center gap-2">
                      <HugeiconsIcon icon={Exchange01Icon} size={18} className="text-primary" />
                      Member Counter Redemption Workflow
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      Verify member balance, choose reward catalog item, and commit balanced double-entry transaction.
                    </DialogDescription>
                  </DialogHeader>

                  {!redemptionResult ? (
                    <div className="space-y-4 py-3 text-xs">
                      {/* Step 1: Member Selection */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span>1. Select Member (Customer Account)</span>
                          {selectedMember && (
                            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                              Current Balance: {memberPoints.toLocaleString()} PTS
                            </span>
                          )}
                        </label>
                        <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Choose or search member..." />
                          </SelectTrigger>
                          <SelectContent className="max-h-56">
                            {institutionMembers.map((m) => (
                              <SelectItem key={m.id} value={m.id} className="text-xs">
                                {m.name} ({m.externalReference}) — {m.balances["POINT"] || 0} PTS
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Step 2: Reward Selection */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          2. Select Reward to Redeem
                        </label>
                        <Select value={selectedRewardId} onValueChange={setSelectedRewardId}>
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Choose reward item..." />
                          </SelectTrigger>
                          <SelectContent>
                            {redeemableRewards.map((r) => (
                              <SelectItem key={r.id} value={r.id} className="text-xs">
                                {r.name} ({r.code}) — {r.costInPoints?.toLocaleString()} PTS
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Step 3: Branch Selection */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          3. Fulfillment Branch / Store Counter
                        </label>
                        <Select
                          value={redemptionBranchId}
                          onValueChange={setRedemptionBranchId}
                          disabled={Boolean(currentUser.branchId)}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {institutionBranches.map((b) => (
                              <SelectItem key={b.id} value={b.id} className="text-xs">
                                {b.name} ({b.branchCode})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Validation & Balance Check Card */}
                      {selectedMember && selectedReward && (
                        <div
                          className={`rounded-lg p-3 border text-xs space-y-2 ${
                            hasSufficientPoints
                              ? "bg-emerald-500/10 border-emerald-500/20"
                              : "bg-rose-500/10 border-rose-500/20"
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span>Double-Entry Validation Check:</span>
                            {hasSufficientPoints ? (
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                                Qualified
                              </span>
                            ) : (
                              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-bold">
                                <HugeiconsIcon icon={AlertCircleIcon} size={14} />
                                Insufficient Balance
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                            <div>
                              <span className="text-muted-foreground block font-sans text-[10px]">Current:</span>
                              <span className="font-semibold">{memberPoints.toLocaleString()} PTS</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block font-sans text-[10px]">Cost:</span>
                              <span className="font-semibold text-rose-500">-{pointsRequired.toLocaleString()} PTS</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block font-sans text-[10px]">Remaining:</span>
                              <span className="font-semibold text-foreground">
                                {(memberPoints - pointsRequired).toLocaleString()} PTS
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Success / Result View */
                    <div className="py-4 space-y-4 text-xs">
                      {redemptionResult.success ? (
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center space-y-3">
                          <div className="size-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} strokeWidth={2.5} />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-foreground">
                              Redemption Successfully Committed!
                            </h4>
                            <p className="text-muted-foreground text-xs mt-0.5">
                              Double-entry ledger transaction posted immutably.
                            </p>
                          </div>

                          <div className="rounded-lg bg-card border border-border p-3 text-left space-y-1.5 font-mono text-[11px]">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground font-sans">Redemption Code:</span>
                              <span className="font-bold text-foreground">
                                {redemptionResult.redemption?.redemptionCode}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground font-sans">Transaction Reference:</span>
                              <span className="font-bold text-primary">
                                {redemptionResult.transactionRef}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground font-sans">Points Deducted:</span>
                              <span className="font-bold text-rose-500">
                                -{redemptionResult.redemption?.pointsSpent.toLocaleString()} PTS
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground font-sans">Reward Issued:</span>
                              <span className="font-medium text-foreground">
                                {redemptionResult.redemption?.rewardName}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                          {redemptionResult.error}
                        </div>
                      )}
                    </div>
                  )}

                  <DialogFooter>
                    {!redemptionResult ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsRedeemOpen(false)}
                          className="text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          disabled={!selectedMember || !selectedReward || !hasSufficientPoints}
                          onClick={handleExecuteRedemption}
                          className="text-xs"
                        >
                          Confirm & Record Transaction
                        </Button>
                      </>
                    ) : (
                      <>
                        {redemptionResult.transactionId && (
                          <Button asChild variant="outline" size="sm" className="text-xs">
                            <Link href={`/transactions/${redemptionResult.transactionId}`}>
                              <HugeiconsIcon icon={Invoice01Icon} size={14} className="mr-1" />
                              View Ledger Transaction
                            </Link>
                          </Button>
                        )}
                        <Button type="button" size="sm" onClick={handleResetDialog} className="text-xs">
                          Done
                        </Button>
                      </>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <HugeiconsIcon
              icon={Search01Icon}
              size={15}
              strokeWidth={2}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search redemption code, member, or reward..."
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
                <SelectItem value="ALL" className="text-xs">All Branches</SelectItem>
                {institutionBranches.map((b) => (
                  <SelectItem key={b.id} value={b.id} className="text-xs">
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchTerm || selectedBranch !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedBranch("ALL")
                }}
                className="h-9 px-2 text-xs text-muted-foreground"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} className="mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Redemptions Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Redemption Code</th>
                  <th className="py-3 px-3">Member</th>
                  <th className="py-3 px-3">Reward Fulfillled</th>
                  <th className="py-3 px-3 text-right">Points Spent</th>
                  <th className="py-3 px-3">Branch Store</th>
                  <th className="py-3 px-3">Ledger Transaction</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {filteredRedemptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground text-xs font-sans">
                      No redemptions recorded for the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRedemptions.map((red) => {
                    const branchName = branchMap.get(red.branchId) || red.branchId

                    return (
                      <tr key={red.id} className="group hover:bg-muted/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-foreground">
                          {red.redemptionCode}
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <Link
                            href={`/members/${red.memberId}`}
                            className="font-medium text-foreground hover:underline"
                          >
                            {red.memberName}
                          </Link>
                          <span className="block font-mono text-[11px] text-muted-foreground">
                            {red.memberReference}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <span className="font-medium text-foreground">{red.rewardName}</span>
                          <span className="block font-mono text-[11px] text-muted-foreground">
                            {red.rewardCode}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-rose-600 dark:text-rose-400">
                          -{red.pointsSpent.toLocaleString()} PTS
                        </td>
                        <td className="py-3 px-3 font-sans text-muted-foreground truncate max-w-36">
                          <div className="flex items-center gap-1">
                            <HugeiconsIcon icon={Store01Icon} size={12} className="text-muted-foreground/70" />
                            <span>{branchName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <Link
                            href={`/transactions/${red.transactionId}`}
                            className="font-semibold text-primary hover:underline flex items-center gap-1"
                          >
                            <HugeiconsIcon icon={Invoice01Icon} size={13} strokeWidth={2} />
                            {red.transactionReference}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-right font-sans text-muted-foreground text-[11px] whitespace-nowrap">
                          {new Date(red.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
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
              Showing <strong className="font-semibold text-foreground">{filteredRedemptions.length}</strong> counter redemptions
            </span>
            <span>All redemptions balanced against ledger settlement accounts</span>
          </div>
        </div>
      </div>
    </>
  )
}
