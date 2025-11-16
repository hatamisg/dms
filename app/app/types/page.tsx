"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getDocumentTypes, createDocumentType, deleteDocumentType } from "@/lib/api/document-types"
import { useToast } from "@/hooks/use-toast"
import type { DocumentType, DocumentField } from "@/types"

export default function DocumentTypesPage() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newType, setNewType] = useState({
    name: "",
    description: "",
    icon: "📄",
  })
  const [fields, setFields] = useState<Partial<DocumentField>[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadDocumentTypes()
  }, [])

  async function loadDocumentTypes() {
    try {
      setLoading(true)
      const types = await getDocumentTypes()
      setDocumentTypes(types)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load document types",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateType() {
    try {
      await createDocumentType(newType, fields as any)
      toast({
        title: "Success",
        description: "Document type created successfully!",
      })
      setDialogOpen(false)
      setNewType({ name: "", description: "", icon: "📄" })
      setFields([])
      loadDocumentTypes()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create document type",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteType(id: string) {
    if (!confirm("Are you sure you want to delete this document type?")) return

    try {
      await deleteDocumentType(id)
      toast({
        title: "Success",
        description: "Document type deleted successfully!",
      })
      loadDocumentTypes()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete document type",
        variant: "destructive",
      })
    }
  }

  function addField() {
    setFields([
      ...fields,
      {
        name: "",
        label: "",
        field_type: "text",
        is_required: false,
        order: fields.length,
      },
    ])
  }

  function removeField(index: number) {
    setFields(fields.filter((_, i) => i !== index))
  }

  function updateField(index: number, updates: Partial<DocumentField>) {
    setFields(fields.map((field, i) => (i === index ? { ...field, ...updates } : field)))
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Types</h1>
          <p className="text-muted-foreground mt-2">
            Manage custom document types and their fields
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Type
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documentTypes.map((type) => (
            <Card key={type.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {type.description || "No description"}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteType(type.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fields:</span>
                    <Badge variant="secondary">
                      {type.fields?.length || 0} fields
                    </Badge>
                  </div>
                  {type.fields && type.fields.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {type.fields.slice(0, 3).map((field) => (
                        <Badge key={field.id} variant="outline" className="text-xs">
                          {field.label}
                        </Badge>
                      ))}
                      {type.fields.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{type.fields.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Type Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Document Type</DialogTitle>
            <DialogDescription>
              Define a new document type with custom fields
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newType.name}
                onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                placeholder="e.g., Invoice, Contract, Receipt"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={newType.icon}
                onChange={(e) => setNewType({ ...newType, icon: e.target.value })}
                placeholder="Enter an emoji"
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newType.description}
                onChange={(e) =>
                  setNewType({ ...newType, description: e.target.value })
                }
                placeholder="Describe this document type"
                rows={2}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Custom Fields</h3>
                <Button type="button" variant="outline" size="sm" onClick={addField}>
                  <Plus className="mr-2 h-3 w-3" />
                  Add Field
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Field Name *</Label>
                          <Input
                            value={field.name}
                            onChange={(e) =>
                              updateField(index, { name: e.target.value })
                            }
                            placeholder="e.g., invoice_number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Label *</Label>
                          <Input
                            value={field.label}
                            onChange={(e) =>
                              updateField(index, { label: e.target.value })
                            }
                            placeholder="e.g., Invoice Number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Field Type</Label>
                          <Select
                            value={field.field_type}
                            onValueChange={(value: any) =>
                              updateField(index, { field_type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="select">Select</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 flex items-end">
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.is_required}
                                onChange={(e) =>
                                  updateField(index, {
                                    is_required: e.target.checked,
                                  })
                                }
                                className="h-4 w-4"
                              />
                              <span className="text-sm">Required</span>
                            </label>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeField(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateType}
              disabled={!newType.name || fields.some((f) => !f.name || !f.label)}
            >
              Create Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
