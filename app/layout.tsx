import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TooltipProvider } from "radix-ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { InstitutionProvider } from "@/lib/context/institution-context"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Binhi — Multi-Tenant Loyalty Ledger Platform",
  description: "Enterprise reward ledger platform for multi-institution customer loyalty, balanced ledger accounting, and store redemption management.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <InstitutionProvider>
            <TooltipProvider>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="bg-background flex flex-col min-h-screen">
                  {children}
                </SidebarInset>
              </SidebarProvider>
            </TooltipProvider>
          </InstitutionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
