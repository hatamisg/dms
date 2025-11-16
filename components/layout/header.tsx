"use client"

import Link from "next/link"
import { FileText, Folder, Settings, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-8">
          <Link href="/app" className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span className="font-bold text-xl">DMS</span>
          </Link>

          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/app/documents"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Documents
            </Link>
            <Link
              href="/app/types"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Document Types
            </Link>
            <Link
              href="/app/folders"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Folders
            </Link>
          </nav>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-8 w-full"
            />
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
