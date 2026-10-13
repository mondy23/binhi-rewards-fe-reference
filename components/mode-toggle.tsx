"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import { Sun01Icon, Moon02Icon, ComputerIcon } from "@hugeicons/core-free-icons"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <HugeiconsIcon
            icon={Sun01Icon}
            className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            strokeWidth={2}
          />
          <HugeiconsIcon
            icon={Moon02Icon}
            className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            strokeWidth={2}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 text-xs">
          <HugeiconsIcon icon={Sun01Icon} size={14} strokeWidth={2} />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 text-xs">
          <HugeiconsIcon icon={Moon02Icon} size={14} strokeWidth={2} />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 text-xs">
          <HugeiconsIcon icon={ComputerIcon} size={14} strokeWidth={2} />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
