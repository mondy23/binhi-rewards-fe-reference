"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { useInstitution } from "@/lib/context/institution-context"
import { RewardType } from "@/lib/types"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GiftIcon,
  Search01Icon,
  PlusSignIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

export default function RewardsPage() {
  const { institutionRewards, activeInstitution, userPermissions, createReward } = useInstitution()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedType, setSelectedType] = React.useState<string>("ALL")
  const [selectedMode, setSelectedMode] = React.useState<string>("ALL")
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  // New reward form state
  const [newCode, setNewCode] = React.useState("")
  const [newName, setNewName] = React.useState("")
  const [newDescription, setNewDescription] = React.useState("")
  const [newType, setNewType] = React.useState<RewardType>("POINT")
  const [newMode, setNewMode] = React.useState<"QUANTITY" | "CODE">("CODE")
  const [newCost, setNewCost] = React.useState<string>("100")

  const filteredRewards = React.useMemo(() => {
    return institutionRewards.filter((r) => {
      const matchesSearch =
        searchTerm === "" ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = selectedType === "ALL" || r.type === selectedType
      const matchesMode = selectedMode === "ALL" || r.mode === selectedMode

      return matchesSearch && matchesType && matchesMode
    })
  }, [institutionRewards, searchTerm, selectedType, selectedMode])

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCode || !newName) return

    createReward({
      code: newCode.toUpperCase(),
      name: newName,
      description: newDescription,
      type: newType,
      mode: newMode,
      costInPoints: parseInt(newCost) || 0,
      institutionId: activeInstitution.id,
      status: "ACTIVE",
    })

    setNewCode("")
    setNewName("")
    setNewDescription("")
    setNewCost("100")
    setIsCreateOpen(false)
  }

  const getTypeBadge = (type: RewardType) => {
    switch (type) {
      case "POINT":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "VOUCHER":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "TICKET":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
      case "COUPON":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "ITEM":
        return "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Rewards", href: "/rewards" },
          { label: "Catalog" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <HugeiconsIcon icon={GiftIcon} size={22} className="text-primary" strokeWidth={2} />
              Reward Catalog
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Available loyalty reward entities, vouchers, tickets, and items for{" "}
              <span className="font-medium text-foreground">{activeInstitution.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {userPermissions.rewardsManage && (
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs gap-1.5 shadow-2xs">
                    <HugeiconsIcon icon={PlusSignIcon} size={14} strokeWidth={2.5} />
                    Define New Reward
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <form onSubmit={handleCreateReward}>
                    <DialogHeader>
                      <DialogTitle className="text-base font-bold">Define Reward Entity</DialogTitle>
                      <DialogDescription className="text-xs">
                        Create a new quantity-based or code-based reward recognized by the Binhi ledger.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Reward Code</Label>
                          <Input
                            placeholder="e.g. VCHR-500"
                            value={newCode}
                            onChange={(e) => setNewCode(e.target.value)}
                            required
                            className="font-mono text-xs uppercase"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Type</Label>
                          <Select value={newType} onValueChange={(v) => setNewType(v as RewardType)}>
                            <SelectTrigger className="text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="POINT">POINT</SelectItem>
                              <SelectItem value="VOUCHER">VOUCHER</SelectItem>
                              <SelectItem value="COUPON">COUPON</SelectItem>
                              <SelectItem value="TICKET">TICKET</SelectItem>
                              <SelectItem value="ITEM">ITEM</SelectItem>
                              <SelectItem value="OTHER">OTHER</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Reward Name</Label>
                        <Input
                          placeholder="e.g. PHP 500 Department Store Voucher"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          required
                          className="text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Mode</Label>
                          <Select
                            value={newMode}
                            onValueChange={(v) => setNewMode(v as "QUANTITY" | "CODE")}
                          >
                            <SelectTrigger className="text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CODE">CODE (Identifiable)</SelectItem>
                              <SelectItem value="QUANTITY">QUANTITY (Fungible)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Redemption Cost (Points)</Label>
                          <Input
                            type="number"
                            placeholder="Points required"
                            value={newCost}
                            onChange={(e) => setNewCost(e.target.value)}
                            className="text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          placeholder="Brief terms or catalog description..."
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          className="text-xs resize-none"
                          rows={3}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCreateOpen(false)}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" className="text-xs">
                        Create Reward
                      </Button>
                    </DialogFooter>
                  </form>
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
              placeholder="Search rewards by name, code, or terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-9 w-32 text-xs">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">All Types</SelectItem>
                <SelectItem value="POINT" className="text-xs">POINT</SelectItem>
                <SelectItem value="VOUCHER" className="text-xs">VOUCHER</SelectItem>
                <SelectItem value="COUPON" className="text-xs">COUPON</SelectItem>
                <SelectItem value="TICKET" className="text-xs">TICKET</SelectItem>
                <SelectItem value="ITEM" className="text-xs">ITEM</SelectItem>
                <SelectItem value="OTHER" className="text-xs">OTHER</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedMode} onValueChange={setSelectedMode}>
              <SelectTrigger className="h-9 w-36 text-xs">
                <SelectValue placeholder="All Modes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">All Modes</SelectItem>
                <SelectItem value="QUANTITY" className="text-xs">Quantity (Fungible)</SelectItem>
                <SelectItem value="CODE" className="text-xs">Code (Identifiable)</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || selectedType !== "ALL" || selectedMode !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedType("ALL")
                  setSelectedMode("ALL")
                }}
                className="h-9 px-2 text-xs text-muted-foreground"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} className="mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Reward Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRewards.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-muted-foreground rounded-xl border border-dashed border-border bg-card">
              No rewards found matching the selected filter criteria.
            </div>
          ) : (
            filteredRewards.map((reward) => (
              <div
                key={reward.id}
                className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs hover:border-border/80 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded border ${getTypeBadge(
                            reward.type
                          )}`}
                        >
                          {reward.type}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono py-0">
                          {reward.mode}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-sm text-foreground mt-1.5">{reward.name}</h3>
                      <p className="font-mono text-xs text-primary font-semibold">{reward.code}</p>
                    </div>

                    <Badge
                      className={
                        reward.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]"
                          : "bg-muted text-muted-foreground border-border text-[10px]"
                      }
                    >
                      {reward.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/50 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-[11px]">Redemption Cost:</span>
                    <span className="font-mono font-bold text-foreground">
                      {reward.costInPoints ? `${reward.costInPoints.toLocaleString()} Points` : "Fungible / Free"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-[11px]">Active in Circulation:</span>
                    <span className="font-mono font-medium text-foreground">
                      {reward.totalInCirculation.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1">
                    <span>Scope: {reward.institutionId === "GLOBAL" ? "Global Platform" : "Tenant-Specific"}</span>
                    {reward.expiresInDays && <span>Valid: {reward.expiresInDays} days</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
