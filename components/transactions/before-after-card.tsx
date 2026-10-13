import * as React from "react"
import { MemberImpact } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight02Icon, UserAccountIcon } from "@hugeicons/core-free-icons"
import Link from "next/link"

interface BeforeAfterCardProps {
  impacts: MemberImpact[]
}

export function BeforeAfterCard({ impacts }: BeforeAfterCardProps) {
  if (!impacts || impacts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
        No external member accounts were directly impacted (System treasury internal movement).
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
      <div>
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          Account Balance Impacts (Before → Change → After)
        </h3>
        <p className="text-xs text-muted-foreground">
          Authoritative balance mutations derived from this immutable transaction
        </p>
      </div>

      <div className="space-y-3">
        {impacts.map((impact) => {
          const isPositive = impact.change > 0
          const changeFormatted = `${isPositive ? "+" : ""}${impact.change.toLocaleString()} ${impact.rewardCode}`

          return (
            <div
              key={impact.memberId}
              className="rounded-lg border border-border/80 bg-muted/20 p-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                    <HugeiconsIcon icon={UserAccountIcon} size={15} strokeWidth={2} />
                  </div>
                  <div>
                    <Link
                      href={`/members/${impact.memberId}`}
                      className="text-xs font-semibold hover:underline text-foreground"
                    >
                      {impact.memberName}
                    </Link>
                    <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                      {impact.memberReference}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-muted-foreground">
                  Reward: <span className="font-semibold text-foreground">{impact.rewardCode}</span>
                </span>
              </div>

              {/* BEFORE -> CHANGE -> AFTER layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 items-center">
                {/* Before */}
                <div className="flex flex-col p-2.5 rounded-md bg-background border border-border/60">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Before Balance
                  </span>
                  <span className="font-mono text-sm font-semibold text-foreground mt-0.5">
                    {impact.beforeBalance.toLocaleString()} {impact.rewardCode}
                  </span>
                </div>

                {/* Change */}
                <div className="flex items-center justify-center gap-2 p-2.5 rounded-md border border-border/60 bg-background">
                  <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="text-muted-foreground" strokeWidth={2} />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                      Ledger Mutation
                    </span>
                    <span
                      className={`font-mono text-sm font-bold mt-0.5 ${
                        isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {changeFormatted}
                    </span>
                  </div>
                  <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="text-muted-foreground" strokeWidth={2} />
                </div>

                {/* After */}
                <div className="flex flex-col p-2.5 rounded-md bg-background border border-border/60">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    After Balance
                  </span>
                  <span className="font-mono text-sm font-semibold text-foreground mt-0.5">
                    {impact.afterBalance.toLocaleString()} {impact.rewardCode}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
