"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { useInstitution } from "@/lib/context/institution-context"
import { mockAuditLogs } from "@/lib/mock/audit"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Settings05Icon,
  PaintBoardIcon,
  SecurityCheckIcon,
  CheckmarkCircle02Icon,
  LockKeyIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons"

export default function SettingsPage() {
  const { activeInstitution, updateInstitutionBranding } = useInstitution()

  // Appearance state
  const [primaryColor, setPrimaryColor] = React.useState(
    activeInstitution.branding.primaryColor || "#029456"
  )
  const [slogan, setSlogan] = React.useState(activeInstitution.branding.slogan || "")
  const [currencyName, setCurrencyName] = React.useState(
    activeInstitution.branding.currencyName || "Points"
  )
  const [borderRadius, setBorderRadius] = React.useState(
    activeInstitution.branding.borderRadius || "0.45rem"
  )
  const [savedSuccess, setSavedSuccess] = React.useState(false)

  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault()
    updateInstitutionBranding(activeInstitution.id, {
      primaryColor,
      slogan,
      currencyName,
      borderRadius,
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Settings" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <HugeiconsIcon icon={Settings05Icon} size={22} className="text-primary" strokeWidth={2} />
              Platform & Tenant Settings
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configuration, brand styling, row-level security parameters, and immutable audit logs
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono py-1">
              Scope: {activeInstitution.name}
            </Badge>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="appearance" className="space-y-4">
          <TabsList className="bg-muted/50 p-1 flex-wrap">
            <TabsTrigger value="general" className="text-xs">
              General
            </TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs">
              Appearance & Branding
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs">
              Security & RLS Isolation
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-xs">
              Audit Logs ({mockAuditLogs.length})
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: GENERAL */}
          <TabsContent value="general" className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
              <h3 className="font-bold text-sm text-foreground">Tenant General Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <Label className="text-xs">Institution Legal Name</Label>
                  <Input value={activeInstitution.name} readOnly className="bg-muted/30 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tenant Code</Label>
                  <Input value={activeInstitution.code} readOnly className="font-mono bg-muted/30 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Ledger Currency Unit</Label>
                  <Input value={activeInstitution.branding.currencyName} readOnly className="bg-muted/30 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Accounting Timezone</Label>
                  <Input value="Asia/Manila (UTC+08:00)" readOnly className="bg-muted/30 text-xs" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: APPEARANCE & BRANDING */}
          <TabsContent value="appearance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <HugeiconsIcon icon={PaintBoardIcon} size={16} className="text-primary" />
                    Dynamic Tenant Branding
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Customize colors, slogans, and corner styling for {activeInstitution.name}
                  </p>
                </div>

                <form onSubmit={handleSaveAppearance} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Primary Brand Color</Label>
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
                        <button
                          type="button"
                          onClick={() => setPrimaryColor("#029456")}
                          className="size-5 rounded-full bg-[#029456] border"
                          title="Binhi Default"
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

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Brand Slogan</Label>
                      <Input
                        value={slogan}
                        onChange={(e) => setSlogan(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Currency Unit</Label>
                      <Input
                        value={currencyName}
                        onChange={(e) => setCurrencyName(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Corner Border Radius</Label>
                    <div className="flex gap-2">
                      {["0.25rem", "0.45rem", "0.6rem", "0.85rem"].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setBorderRadius(r)}
                          className={`px-3 py-1 rounded border text-xs font-mono ${
                            borderRadius === r
                              ? "border-primary bg-primary/10 text-primary font-bold"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    {savedSuccess ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                        Theme applied live!
                      </span>
                    ) : (
                      <span />
                    )}

                    <Button type="submit" size="sm" className="text-xs">
                      Save & Apply Branding
                    </Button>
                  </div>
                </form>
              </div>

              {/* Theme Preview */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
                <h3 className="font-bold text-sm text-foreground">Live Theme Token Preview</h3>
                <div className="p-4 rounded-xl border bg-muted/20 space-y-3" style={{ borderRadius }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="size-10 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-xs"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {activeInstitution.branding.logoText || "TEN"}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{activeInstitution.name}</div>
                      <div className="text-[11px] text-muted-foreground italic">&quot;{slogan}&quot;</div>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-semibold text-white shadow-xs rounded"
                      style={{ backgroundColor: primaryColor, borderRadius }}
                    >
                      Active Button
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-semibold border rounded"
                      style={{ borderColor: primaryColor, color: primaryColor, borderRadius }}
                    >
                      Outlined Badge
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: SECURITY & RLS */}
          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <HugeiconsIcon icon={SecurityCheckIcon} size={16} className="text-primary" />
                  Row-Level Security (RLS) Protocol
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Binhi guarantees multi-tenant isolation by enforcing PostgreSQL Row-Level Security at connection dispatch. Client-supplied tenant parameters are never trusted without cryptographic session validation.
                </p>

                <div className="space-y-2 font-mono text-[11px] pt-1">
                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 text-foreground">
                    <span className="text-muted-foreground block text-[10px] font-sans">Active Session Key:</span>
                    SET LOCAL app.current_institution_id = &apos;{activeInstitution.id}&apos;;
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 text-foreground">
                    <span className="text-muted-foreground block text-[10px] font-sans">Audit Request Key:</span>
                    SET LOCAL app.request_id = &apos;req-audit-live&apos;;
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-2xs">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <HugeiconsIcon icon={LockKeyIcon} size={16} className="text-primary" />
                  Immutable Ledger Boundaries
                </h3>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>
                      <strong className="text-foreground">Append-Only Invariant:</strong> Table <code className="font-mono text-foreground">ledger.entries</code> lacks UPDATE and DELETE grants. All corrections require an explicit REVERSAL transaction.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>
                      <strong className="text-foreground">SECURITY DEFINER Functions:</strong> External integrations interact only through signed API stored procedures with least privilege boundaries.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>
                      <strong className="text-foreground">Balanced Ledger Constraint:</strong> Invariant check enforces <code className="font-mono text-foreground">SUM(debits) = SUM(credits)</code> across all recorded transaction batches.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: AUDIT LOGS */}
          <TabsContent value="audit" className="space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-3">Actor</th>
                      <th className="py-3 px-3">Action</th>
                      <th className="py-3 px-3">Resource</th>
                      <th className="py-3 px-3">IP Address</th>
                      <th className="py-3 px-4 text-center">Diff / Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                    {mockAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/30">
                        <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <span className="font-semibold text-foreground">{log.actorName}</span>
                          <span className="block font-mono text-[10px] text-muted-foreground">
                            {log.actorRole}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="text-[10px] py-0 font-semibold">
                            {log.action}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">
                          {log.resource}: <span className="font-semibold text-foreground">{log.resourceId}</span>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">{log.ipAddress}</td>
                        <td className="py-3 px-4 text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs gap-1"
                              >
                                <HugeiconsIcon icon={ViewIcon} size={13} />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-base font-bold">
                                  Audit Record: {log.action}
                                </DialogTitle>
                                <DialogDescription className="text-xs font-mono">
                                  Request ID: {log.requestId} • {new Date(log.timestamp).toISOString()}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-3 py-2 text-xs">
                                <div>
                                  <span className="text-muted-foreground block text-[11px]">Actor:</span>
                                  <span className="font-semibold text-foreground">
                                    {log.actorName} ({log.actorRole})
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground block text-[11px]">User Agent:</span>
                                  <span className="font-mono text-[11px] text-muted-foreground break-all">
                                    {log.userAgent}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-muted-foreground block text-[11px]">Before Data:</span>
                                  <pre className="p-2.5 rounded bg-muted/40 font-mono text-[10px] overflow-x-auto text-muted-foreground">
                                    {log.beforeData || "None"}
                                  </pre>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-muted-foreground block text-[11px]">After Data:</span>
                                  <pre className="p-2.5 rounded bg-muted/40 font-mono text-[10px] overflow-x-auto text-foreground">
                                    {log.afterData || "None"}
                                  </pre>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
