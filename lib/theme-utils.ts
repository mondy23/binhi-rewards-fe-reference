import { InstitutionBranding } from "@/lib/types"

/**
 * Dynamically applies tenant branding CSS variables to the document root element.
 * Tailwind CSS v4 binds --color-primary to var(--primary), etc.
 */
export function applyInstitutionTheme(branding: InstitutionBranding) {
  if (typeof document === "undefined") return

  const root = document.documentElement

  if (branding.primaryColor) {
    root.style.setProperty("--primary", branding.primaryColor)
    root.style.setProperty("--sidebar-primary", branding.primaryColor)
    root.style.setProperty("--ring", branding.primaryColor)
  }

  if (branding.primaryForeground) {
    root.style.setProperty("--primary-foreground", branding.primaryForeground)
    root.style.setProperty("--sidebar-primary-foreground", branding.primaryForeground)
  }

  if (branding.accentColor) {
    root.style.setProperty("--accent", branding.accentColor)
  }

  if (branding.borderRadius) {
    root.style.setProperty("--radius", branding.borderRadius)
  }
}
