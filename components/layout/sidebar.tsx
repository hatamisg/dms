"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  FileText,
  FolderOpen,
  Tags,
  LayoutGrid,
  Upload,
  Share2,
} from "lucide-react"

const sidebarItems = [
  {
    title: "All Documents",
    href: "/app/documents",
    icon: FileText,
  },
  {
    title: "Upload",
    href: "/app/upload",
    icon: Upload,
  },
  {
    title: "Folders",
    href: "/app/folders",
    icon: FolderOpen,
  },
  {
    title: "Tags",
    href: "/app/tags",
    icon: Tags,
  },
  {
    title: "Document Types",
    href: "/app/types",
    icon: LayoutGrid,
  },
  {
    title: "Shared Links",
    href: "/app/shared",
    icon: Share2,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background">
      <div className="flex-1 overflow-auto py-6 px-4">
        <nav className="flex flex-col space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="rounded-lg bg-muted p-4">
          <h4 className="text-sm font-semibold mb-2">Storage Used</h4>
          <div className="text-2xl font-bold">0 MB</div>
          <p className="text-xs text-muted-foreground mt-1">No limit</p>
        </div>
      </div>
    </aside>
  )
}
