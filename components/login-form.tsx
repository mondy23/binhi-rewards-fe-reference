
"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const institutions = [
  {
    value: "institution-a",
    label: "Institution A",
  },
  {
    value: "institution-b",
    label: "Institution B",
  },
  {
    value: "institution-c",
    label: "Institution C",
  },
  {
    value: "institution-d",
    label: "Institution D",
  },
  {
    value: "institution-e",
    label: "Institution E",
  },
  {
    value: "institution-f",
    label: "Institution F",
  },
  // Add the rest of your 32 institutions here
]

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [open, setOpen] = useState(false)
  const [institution, setInstitution] = useState("")

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card className="overflow-hidden border shadow-sm p-0">
        <CardContent className="grid p-0 md:grid-cols-2">

          {/* Login Form */}
          <form className="p-6 md:p-8">
            <FieldGroup>

              {/* Header */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h1>

                <p className="text-sm text-muted-foreground">
                  Sign in to your account to continue
                </p>
              </div>

              {/* Institution */}
              <Field>
                <FieldLabel htmlFor="institution">
                  Institution
                </FieldLabel>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="institution"
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="h-10 w-full justify-between font-normal"
                    >
                      {institution
                        ? institutions.find(
                          (item) => item.value === institution
                        )?.label
                        : "Select your institution"}

                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Search institution..." />

                      <CommandList>
                        <CommandEmpty>
                          No institution found.
                        </CommandEmpty>

                        <CommandGroup>
                          {institutions.map((item) => (
                            <CommandItem
                              key={item.value}
                              value={item.label}
                              onSelect={() => {
                                setInstitution(item.value)
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 size-4",
                                  institution === item.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />

                              {item.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Hidden value for form submission */}
                <input
                  type="hidden"
                  name="institutionId"
                  value={institution}
                />
              </Field>

              {/* Username */}
              <Field>
                <FieldLabel htmlFor="username">
                  Username
                </FieldLabel>

                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />
              </Field>

              {/* Password */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">
                    Password
                  </FieldLabel>

                  <button
                    type="button"
                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Forgot password?
                  </button>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </Field>

              {/* Login */}
              <Field>
                <Button
                  type="submit"
                  className="h-10 w-full"
                  disabled={!institution}
                >
                  Login
                </Button>
              </Field>

              {/* Footer */}
              <p className="text-center text-xs text-muted-foreground">
                By continuing, you agree to the organization&apos;s
                access policies.
              </p>

            </FieldGroup>
          </form>

          {/* Image */}
          <div className="relative hidden min-h-[520px] bg-muted md:block">
            <div className="relative hidden min-h-[520px] overflow-hidden bg-[#050807] md:block">
              {/* Ambient glow */}
              <div className="absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-600/25 blur-[100px]" />

              <div className="absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-emerald-500/25 blur-[100px]" />

              {/* Logo */}
              <img
                src="/logo.png"
                alt="Binhi"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />

              {/* Subtle dark overlay */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Bottom content */}
              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="max-w-sm">
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    Binhi Rewards
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    A smarter way to manage your institution,
                    rewards, and transactions in one place.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
