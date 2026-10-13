"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { useInstitution } from "@/lib/context/institution-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Building03Icon,
  Store01Icon,
  UserGroupIcon,
  ArrowRight02Icon,
  Tick02Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

export default function InstitutionsPage() {
  const {
    institutions,
    authorizedInstitutions,
    activeInstitution,
    setActiveInstitutionId,
  } = useInstitution()

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Administration", href: "/access-control" },
          { label: "Institutions" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <HugeiconsIcon icon={Building03Icon} size={22} className="text-primary" strokeWidth={2} />
              Institution Tenants
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Multi-tenant customer organizations, brand identities, and enterprise configurations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono py-1">
              {authorizedInstitutions.length} Authorized Tenants
            </Badge>
          </div>
        </div>

        {/* Global Multi-Tenant Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Active Tenants</span>
              <HugeiconsIcon icon={Building03Icon} size={16} strokeWidth={2} />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
              {institutions.length}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Isolated tenant boundaries
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Configured Branches</span>
              <HugeiconsIcon icon={Store01Icon} size={16} strokeWidth={2} />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
              {institutions.reduce((s, i) => s + i.branchCount, 0)}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Store redemption locations
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Platform Members</span>
              <HugeiconsIcon icon={UserGroupIcon} size={16} strokeWidth={2} />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
              {institutions.reduce((s, i) => s + i.memberCount, 0).toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Ledger accounts tracked
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Tenant Isolation</span>
              <HugeiconsIcon icon={SparklesIcon} size={16} strokeWidth={2} className="text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              RLS Strict
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Row-Level Security enforced
            </div>
          </div>
        </div>

        {/* Institutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {authorizedInstitutions.map((inst) => {
            const isActive = inst.id === activeInstitution.id

            return (
              <div
                key={inst.id}
                className={`rounded-xl border bg-card p-5 space-y-4 shadow-2xs transition-all flex flex-col justify-between ${
                  isActive ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-border/80"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-11 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-xs shrink-0"
                        style={{ backgroundColor: inst.branding.primaryColor }}
                      >
                        {inst.branding.logoText || inst.code.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-foreground">{inst.name}</h3>
                          <Badge variant="outline" className="font-mono text-[10px] py-0">
                            {inst.code}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground italic mt-0.5">
                          &quot;{inst.branding.slogan}&quot;
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge variant="secondary" className="text-[10px]">
                        {inst.plan}
                      </Badge>
                      {isActive && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-primary">
                          <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={3} />
                          Active Scope
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {inst.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/50 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">Stores / Branches:</span>
                      <span className="font-mono font-bold text-foreground">{inst.branchCount}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">Members:</span>
                      <span className="font-mono font-bold text-foreground">
                        {inst.memberCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">Ledger Currency:</span>
                      <span className="font-semibold text-foreground truncate block">
                        {inst.branding.currencyName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span
                        className="size-3 rounded-full border"
                        style={{ backgroundColor: inst.branding.primaryColor }}
                      />
                      <span className="font-mono text-[11px]">{inst.branding.primaryColor}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveInstitutionId(inst.id)}
                          className="text-xs h-8"
                        >
                          Switch To Tenant
                        </Button>
                      )}
                      <Button asChild size="sm" className="text-xs h-8 gap-1">
                        <Link href={`/institutions/${inst.id}`}>
                          <span>Manage Tenant</span>
                          <HugeiconsIcon icon={ArrowRight02Icon} size={13} strokeWidth={2} />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
