"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { useInstitution } from "@/lib/context/institution-context"
import { Game } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  PlayIcon,
  PauseIcon,
  PlusSignIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"

export default function GamesPage() {
  const {
    institutionGames,
    activeInstitution,
    userPermissions,
    toggleGameStatus,
    createGame,
  } = useInstitution()

  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [newCode, setNewCode] = React.useState("")
  const [newName, setNewName] = React.useState("")
  const [newDesc, setNewDesc] = React.useState("")
  const [newType, setNewType] = React.useState<Game["type"]>("SPIN_WHEEL")
  const [newRewardCode, setNewRewardCode] = React.useState("POINT")
  const [newPool, setNewPool] = React.useState("100000")

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCode || !newName) return

    createGame({
      code: newCode.toUpperCase(),
      name: newName,
      description: newDesc,
      type: newType,
      rewardCode: newRewardCode,
      rewardPool: parseInt(newPool) || 10000,
      status: "ACTIVE",
      institutionId: activeInstitution.id,
      allowedBranches: [],
    })

    setNewCode("")
    setNewName("")
    setNewDesc("")
    setNewPool("100000")
    setIsCreateOpen(false)
  }

  const getTypeBadge = (type: Game["type"]) => {
    switch (type) {
      case "SPIN_WHEEL":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "MYSTERY_BOX":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "LOTTERY":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
      case "MILESTONE":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
    }
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Rewards", href: "/rewards" },
          { label: "Games" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <HugeiconsIcon icon={SparklesIcon} size={22} className="text-primary" strokeWidth={2} />
              Reward-Based Games
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Engagement mini-games and reward prize pools for{" "}
              <span className="font-medium text-foreground">{activeInstitution.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {userPermissions.gamesManage && (
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs gap-1.5 shadow-2xs">
                    <HugeiconsIcon icon={PlusSignIcon} size={14} strokeWidth={2.5} />
                    Create New Game
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <form onSubmit={handleCreateGame}>
                    <DialogHeader>
                      <DialogTitle className="text-base font-bold">Configure Reward Game</DialogTitle>
                      <DialogDescription className="text-xs">
                        Set up an external engagement mechanic and allocate a reward pool from treasury.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Game Code</Label>
                          <Input
                            placeholder="e.g. GAME-SCRATCH-01"
                            value={newCode}
                            onChange={(e) => setNewCode(e.target.value)}
                            required
                            className="font-mono text-xs uppercase"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Game Type</Label>
                          <Select
                            value={newType}
                            onValueChange={(v) => setNewType(v as Game["type"])}
                          >
                            <SelectTrigger className="text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SPIN_WHEEL">Spin the Wheel</SelectItem>
                              <SelectItem value="MYSTERY_BOX">Mystery Box</SelectItem>
                              <SelectItem value="LOTTERY">Lottery / Raffle</SelectItem>
                              <SelectItem value="MILESTONE">Milestone Quest</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Game Title</Label>
                        <Input
                          placeholder="e.g. Weekend Mega Spin"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          required
                          className="text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Reward Code</Label>
                          <Input
                            placeholder="e.g. POINT"
                            value={newRewardCode}
                            onChange={(e) => setNewRewardCode(e.target.value)}
                            className="text-xs font-mono uppercase"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Reward Pool Allocation</Label>
                          <Input
                            type="number"
                            value={newPool}
                            onChange={(e) => setNewPool(e.target.value)}
                            className="text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          placeholder="How members play or qualify..."
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          rows={3}
                          className="text-xs resize-none"
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
                        Publish Game
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {institutionGames.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-muted-foreground rounded-xl border border-dashed border-border bg-card">
              No active games configured for this institution.
            </div>
          ) : (
            institutionGames.map((game) => {
              const progressPercent = Math.min(
                100,
                Math.round((game.rewardDistributed / (game.rewardPool || 1)) * 100)
              )

              return (
                <div
                  key={game.id}
                  className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded border ${getTypeBadge(
                              game.type
                            )}`}
                          >
                            {game.type.replace("_", " ")}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {game.code}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-foreground mt-1.5">{game.name}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            game.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]"
                              : "bg-muted text-muted-foreground border-border text-[10px]"
                          }
                        >
                          {game.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  {/* Pool Progress & Stats */}
                  <div className="pt-3 border-t border-border/50 space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between items-center text-[11px] mb-1">
                        <span className="text-muted-foreground">Reward Pool Utilization:</span>
                        <span className="font-mono font-semibold text-foreground">
                          {game.rewardDistributed.toLocaleString()} / {game.rewardPool.toLocaleString()}{" "}
                          {game.rewardCode} ({progressPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
                        <span className="text-muted-foreground block text-[10px]">Plays Completed:</span>
                        <span className="font-mono font-bold text-foreground">
                          {game.playsCount.toLocaleString()} plays
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
                        <span className="text-muted-foreground block text-[10px]">Branch Access:</span>
                        <span className="font-medium text-foreground truncate block">
                          {game.allowedBranches.length === 0
                            ? "All Stores"
                            : `${game.allowedBranches.length} Stores`}
                        </span>
                      </div>
                    </div>

                    {userPermissions.gamesManage && (
                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/40">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleGameStatus(game.id)}
                          className="text-xs h-8 gap-1.5"
                        >
                          {game.status === "ACTIVE" ? (
                            <>
                              <HugeiconsIcon icon={PauseIcon} size={14} />
                              Pause Game
                            </>
                          ) : (
                            <>
                              <HugeiconsIcon icon={PlayIcon} size={14} />
                              Resume Game
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
