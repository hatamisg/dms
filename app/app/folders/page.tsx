"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react"
import { Plus, Folder, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getFolders, createFolder, deleteFolder, buildFolderTree } from "@/lib/api/folders"
import { useToast } from "@/hooks/use-toast"
import type { Folder as FolderType } from "@/types"

export default function FoldersPage() {
  const [folders, setFolders] = useState<FolderType[]>([])
  const [folderTree, setFolderTree] = useState<FolderType[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newFolder, setNewFolder] = useState({
    name: "",
    parent_id: null as string | null,
  })
  const { toast } = useToast()

  useEffect(() => {
    loadFolders()
  }, [])

  async function loadFolders() {
    try {
      setLoading(true)
      const data = await getFolders()
      setFolders(data)
      setFolderTree(buildFolderTree(data))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load folders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateFolder() {
    if (!newFolder.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a folder name",
        variant: "destructive",
      })
      return
    }

    try {
      await createFolder(newFolder)
      toast({
        title: "Success",
        description: "Folder created successfully!",
      })
      setDialogOpen(false)
      setNewFolder({ name: "", parent_id: null })
      loadFolders()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create folder",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteFolder(id: string) {
    if (!confirm("Are you sure? This will also delete all subfolders.")) return

    try {
      await deleteFolder(id)
      toast({
        title: "Success",
        description: "Folder deleted successfully!",
      })
      loadFolders()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete folder",
        variant: "destructive",
      })
    }
  }

  function renderFolder(folder: FolderType, level: number = 0) {
    return (
      <div key={folder.id}>
        <Card className="mb-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ marginLeft: `${level * 24}px` }}>
                  <Folder className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">{folder.name}</h3>
                  {folder.children && folder.children.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {folder.children.length} subfolder(s)
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteFolder(folder.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        {folder.children?.map((child) => renderFolder(child, level + 1))}
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Folders</h1>
          <p className="text-muted-foreground mt-2">
            Organize your documents with folders
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Folder
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-6 bg-muted rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : folderTree.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Folder className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No folders yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first folder to organize documents
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Folder
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div>{folderTree.map((folder) => renderFolder(folder))}</div>
      )}

      {/* Create Folder Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Add a new folder to organize your documents
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Folder Name *</Label>
              <Input
                id="name"
                value={newFolder.name}
                onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                placeholder="e.g., Invoices 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent">Parent Folder (optional)</Label>
              <Select
                value={newFolder.parent_id || "none"}
                onValueChange={(value) =>
                  setNewFolder({
                    ...newFolder,
                    parent_id: value === "none" ? null : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (root folder)</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newFolder.name.trim()}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
