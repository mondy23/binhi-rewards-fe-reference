"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { useInstitution } from "@/lib/context/institution-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PaintBoardIcon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

export default function InstitutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  const {
    institutions,
    activeInstitution,
    setActiveInstitutionId,
    institutionBranches,
    institutionRewards,
    institutionTransactions,
    allUsers,
    updateInstitutionBranding,
  } = useInstitution()

  const targetInstitution = institutions.find((i) => i.id === id)

  // Local branding edit state
  const [primaryColor, setPrimaryColor] = React.useState(
    targetInstitution?.branding.primaryColor || "#029456"
  )
  const [slogan, setSlogan] = React.useState(targetInstitution?.branding.slogan || "")
  const [currencyName, setCurrencyName] = React.useState(
    targetInstitution?.branding.currencyName || "Points"
  )
  const [logoText, setLogoText] = React.useState(
    targetInstitution?.branding.logoText || targetInstitution?.code || "BNH"
  )
  const [saveSuccess, setSaveSuccess] = React.useState(false)

  if (!targetInstitution) {
    return (
      <>
        <AppHeader
          breadcrumbs={[
            { label: "Administration", href: "/access-control" },
            { label: "Institutions", href: "/institutions" },
            { label: "Not Found" },
          ]}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <h2 className="text-lg font-bold">Institution Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Institution &apos;{id}&apos; was not found in the platform registry.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4 text-xs">
            <Link href="/institutions">
              <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="mr-1.5" />
              Return to Institutions
            </Link>
          </Button>
        </div>
      </>
    )
  }

  const isCurrentActive = targetInstitution.id === activeInstitution.id

  // Filter scoped data for this specific target institution
  const tenantUsers = allUsers.filter((u) => u.institutionId === targetInstitution.id)

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault()
    updateInstitutionBranding(targetInstitution.id, {
      primaryColor,
      slogan,
      currencyName,
      logoText,
    })
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Administration", href: "/access-control" },
          { label: "Institutions", href: "/institutions" },
          { label: targetInstitution.name },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
              <Link href="/institutions">
                <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="mr-1" />
                Institutions
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-xs shrink-0"
                style={{ backgroundColor: targetInstitution.branding.primaryColor }}
              >
                {targetInstitution.branding.logoText || targetInstitution.code.slice(0, 3)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-foreground">
                    {targetInstitution.name}
                  </h1>
                  <Badge variant="outline" className="font-mono text-xs">
                    {targetInstitution.code}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {targetInstitution.plan}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground italic mt-0.5">
                  &quot;{targetInstitution.branding.slogan}&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCurrentActive ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => setActiveInstitutionId(targetInstitution.id)}
                className="text-xs"
              >
                Switch To This Tenant
              </Button>
            ) : (
              <Badge className="bg-primary text-primary-foreground text-xs py-1 px-2.5">
                <HugeiconsIcon icon={Tick02Icon} size={13} className="mr-1" strokeWidth={3} />
                Currently Active Tenant Scope
              </Badge>
            )}
          </div>
        </div>

        {/* Suggested Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-muted/50 p-1 flex-wrap">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="branches" className="text-xs">
              Branches ({institutionBranches.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs">
              Administrators & Staff ({tenantUsers.length})
            </TabsTrigger>
            <TabsTrigger value="rewards" className="text-xs">
              Rewards ({institutionRewards.length})
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs">
              Ledger Transactions ({institutionTransactions.length})
            </TabsTrigger>
            <TabsTrigger value="branding" className="text-xs">
              Branding & Theme
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              Tenant Settings
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
                <span className="text-xs text-muted-foreground">Store Locations</span>
                <div className="text-2xl font-bold font-mono mt-1 text-foreground">
                  {targetInstitution.branchCount}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Physical branches</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
                <span className="text-xs text-muted-foreground">Tracked Members</span>
                <div className="text-2xl font-bold font-mono mt-1 text-foreground">
                  {targetInstitution.memberCount.toLocaleString()}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Ledger accounts</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
                <span className="text-xs text-muted-foreground">Brand Primary Color</span>
                <div className="text-xl font-bold font-mono mt-1 flex items-center gap-2 text-foreground">
                  <span
                    className="size-4 rounded-full border"
                    style={{ backgroundColor: targetInstitution.branding.primaryColor }}
                  />
                  {targetInstitution.branding.primaryColor}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Dynamic CSS token</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
                <span className="text-xs text-muted-foreground">Tenant Currency</span>
                <div className="text-xl font-bold mt-1 text-foreground">
                  {targetInstitution.branding.currencyName}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Fungible asset unit</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-2xs">
              <h3 className="font-bold text-sm text-foreground">Tenant Profile</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {targetInstitution.description}
              </p>
              <div className="pt-2 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
                <div>
                  <span className="block text-[10px] uppercase font-semibold">Tenant ID</span>
                  <span className="font-mono text-foreground">{targetInstitution.id}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-semibold">Created Date</span>
                  <span className="text-foreground">
                    {new Date(targetInstitution.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-semibold">Status</span>
                  <Badge variant="outline" className="text-[10px] py-0 text-emerald-600">
                    {targetInstitution.status}
                  </Badge>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-semibold">Subscription</span>
                  <span className="text-foreground">{targetInstitution.plan} Tier</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: BRANCHES */}
          <TabsContent value="branches" className="space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                      <th className="py-3 px-4">Branch Code</th>
                      <th className="py-3 px-3">Branch Name</th>
                      <th className="py-3 px-3">City / Address</th>
                      <th className="py-3 px-3 text-right">Members</th>
                      <th className="py-3 px-3 text-right">Transactions</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {institutionBranches.map((branch) => (
                      <tr key={branch.id} className="hover:bg-muted/30">
                        <td className="py-3 px-4 font-mono font-semibold text-foreground">
                          {branch.branchCode}
                        </td>
                        <td className="py-3 px-3 font-medium text-foreground">
                          <Link href={`/branches/${branch.id}`} className="hover:underline">
                            {branch.name}
                          </Link>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground truncate max-w-48">
                          {branch.city} • {branch.address}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-foreground">
                          {branch.memberCount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-muted-foreground">
                          {branch.transactionCount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="text-[10px] py-0 text-emerald-600">
                            {branch.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button asChild variant="ghost" size="sm" className="size-7 p-0">
                            <Link href={`/branches/${branch.id}`}>
                              <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: USERS */}
          <TabsContent value="users" className="space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Operator Name</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Assigned Branch</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {tenantUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                        No operators specifically assigned to this tenant.
                      </td>
                    </tr>
                  ) : (
                    tenantUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/30">
                        <td className="py-3 px-4 font-semibold text-foreground">{u.name}</td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="text-[10px]">
                            {u.role.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">{u.email}</td>
                        <td className="py-3 px-3 text-muted-foreground">
                          {u.branchId || "All Branches"}
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="text-[10px] py-0 text-emerald-600">
                            {u.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB 4: REWARDS */}
          <TabsContent value="rewards" className="space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3 text-right">Cost (PTS)</th>
                    <th className="py-3 px-3 text-right">In Circulation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {institutionRewards.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/30">
                      <td className="py-3 px-4 font-bold text-foreground">{r.code}</td>
                      <td className="py-3 px-3 font-sans text-foreground">{r.name}</td>
                      <td className="py-3 px-3 font-sans">
                        <Badge variant="outline" className="text-[10px]">
                          {r.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right text-foreground">
                        {r.costInPoints ? r.costInPoints.toLocaleString() : "—"}
                      </td>
                      <td className="py-3 px-3 text-right text-muted-foreground">
                        {r.totalInCirculation.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB 5: TRANSACTIONS */}
          <TabsContent value="transactions" className="space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Reward</th>
                    <th className="py-3 px-3 text-right">Change</th>
                    <th className="py-3 px-3">Source</th>
                    <th className="py-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {institutionTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/30">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        <Link href={`/transactions/${t.id}`} className="hover:underline">
                          {t.reference}
                        </Link>
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <Badge variant="outline" className="text-[10px]">
                          {t.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-foreground">{t.rewardCode}</td>
                      <td className="py-3 px-3 text-right font-bold text-foreground">
                        {t.changeAmount > 0 ? `+${t.changeAmount}` : t.changeAmount}
                      </td>
                      <td className="py-3 px-3 font-sans text-muted-foreground text-[11px]">
                        {t.sourceSystem}
                      </td>
                      <td className="py-3 px-4 text-right font-sans text-muted-foreground text-[11px]">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB 6: BRANDING */}
          <TabsContent value="branding" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <HugeiconsIcon icon={PaintBoardIcon} size={16} className="text-primary" />
                    Configure Tenant Visual Identity
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Changes apply immediately to this tenant&apos;s UI theme tokens
                  </p>
                </div>

                <form onSubmit={handleSaveBranding} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Primary Brand Color (Hex)</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="size-8 rounded border border-border cursor-pointer p-0.5"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="font-mono text-xs max-w-36 uppercase"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-muted-foreground">Presets:</span>
                        <button
                          type="button"
                          onClick={() => setPrimaryColor("#029456")}
                          className="size-5 rounded-full bg-[#029456] border"
                          title="Binhi Green"
                        />
                        <button
                          type="button"
                          onClick={() => setPrimaryColor("#165DFC")}
                          className="size-5 rounded-full bg-[#165DFC] border"
                          title="Acme Blue"
                        />
                        <button
                          type="button"
                          onClick={() => setPrimaryColor("#7C3AED")}
                          className="size-5 rounded-full bg-[#7C3AED] border"
                          title="Stellar Purple"
                        />
                        <button
                          type="button"
                          onClick={() => setPrimaryColor("#D97706")}
                          className="size-5 rounded-full bg-[#D97706] border"
                          title="Apex Amber"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Tenant Brand Slogan</Label>
                    <Input
                      value={slogan}
                      onChange={(e) => setSlogan(e.target.value)}
                      placeholder="e.g. Rewarding Every Milestone"
                      className="text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Ledger Currency Name</Label>
                      <Input
                        value={currencyName}
                        onChange={(e) => setCurrencyName(e.target.value)}
                        placeholder="e.g. Acme Points"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Logo Initials / Badge Text</Label>
                      <Input
                        value={logoText}
                        onChange={(e) => setLogoText(e.target.value)}
                        placeholder="e.g. ACME"
                        className="font-mono text-xs uppercase"
                        maxLength={5}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    {saveSuccess ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                        Branding Saved & Applied!
                      </span>
                    ) : <span />}

                    <Button type="submit" size="sm" className="text-xs">
                      Update Branding
                    </Button>
                  </div>
                </form>
              </div>

              {/* Live Preview Card */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
                <div>
                  <h3 className="font-bold text-sm text-foreground">Live Branding Preview</h3>
                  <p className="text-xs text-muted-foreground">
                    Simulated tenant switcher badge and accent elements
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-card border shadow-xs">
                    <div
                      className="size-9 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {logoText}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{targetInstitution.name}</div>
                      <div className="text-[11px] text-muted-foreground italic">
                        &quot;{slogan || "Brand Slogan"}&quot;
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-foreground">Action Buttons:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-md text-xs font-semibold text-white shadow-xs"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Primary Action
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-md text-xs font-semibold border"
                        style={{ borderColor: primaryColor, color: primaryColor }}
                      >
                        Secondary Outline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 7: SETTINGS */}
          <TabsContent value="settings" className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
              <h3 className="font-bold text-sm text-foreground">Multi-Tenant Isolation Settings</h3>
              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                  <span className="font-semibold text-foreground block">Row-Level Security Key</span>
                  <code className="font-mono text-primary text-[11px] block mt-0.5">
                    SET LOCAL app.current_institution_id = &apos;{targetInstitution.id}&apos;;
                  </code>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                  <span className="font-semibold text-foreground block">Ledger Immutability Mode</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                    STRICT_APPEND_ONLY — Direct UPDATE / DELETE statements prohibited
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
