"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { Loader2, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDropzone } from "@/components/upload/file-dropzone"
import { getDocumentTypes } from "@/lib/api/document-types"
import { createDocument } from "@/lib/api/documents"
import { uploadFile } from "@/lib/api/files"
import { extractTextFromImage, extractFieldsFromText } from "@/lib/ocr"
import { useToast } from "@/hooks/use-toast"
import type { DocumentType } from "@/types"

interface FormData {
  title: string
  description: string
  document_type_id: string
  tags: string
  [key: string]: any
}

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [ocrProcessing, setOcrProcessing] = useState(false)
  const [ocrText, setOcrText] = useState("")

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    loadDocumentTypes()
  }, [])

  const selectedTypeId = watch("document_type_id")

  useEffect(() => {
    if (selectedTypeId) {
      const type = documentTypes.find((t) => t.id === selectedTypeId)
      setSelectedType(type || null)
    }
  }, [selectedTypeId, documentTypes])

  async function loadDocumentTypes() {
    try {
      const types = await getDocumentTypes()
      setDocumentTypes(types)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load document types",
        variant: "destructive",
      })
    }
  }

  async function performOCR() {
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a file first",
        variant: "destructive",
      })
      return
    }

    try {
      setOcrProcessing(true)
      const file = files[0]

      toast({
        title: "Processing OCR",
        description: "Extracting text from the document...",
      })

      const text = await extractTextFromImage(file)
      setOcrText(text)

      // Auto-populate fields if a type is selected
      if (selectedType && selectedType.fields) {
        const extractedFields = extractFieldsFromText(text, selectedType.fields)

        Object.entries(extractedFields).forEach(([fieldName, value]) => {
          setValue(`field_${fieldName}`, value)
        })

        toast({
          title: "OCR Complete",
          description: "Text extracted and fields populated!",
        })
      } else {
        toast({
          title: "OCR Complete",
          description: "Text extracted successfully!",
        })
      }
    } catch (error: any) {
      toast({
        title: "OCR Failed",
        description: error.message || "Failed to extract text",
        variant: "destructive",
      })
    } finally {
      setOcrProcessing(false)
    }
  }

  async function onSubmit(data: FormData) {
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select at least one file",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)

      // Prepare field values
      const values: { field_id: string; value: string }[] = []
      if (selectedType?.fields) {
        selectedType.fields.forEach((field) => {
          const value = data[`field_${field.name}`]
          if (value) {
            values.push({
              field_id: field.id,
              value: String(value),
            })
          }
        })
      }

      // Create document
      const document = await createDocument(
        {
          title: data.title,
          description: data.description || null,
          document_type_id: data.document_type_id,
          tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
          ocr_text: ocrText || null,
          folder_id: null,
          public_link_token: null,
        },
        values
      )

      // Upload files
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i], document.id, i + 1)
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully!",
      })

      router.push("/app/documents")
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
        <p className="text-muted-foreground mt-2">
          Add a new document to your collection
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Select Files</CardTitle>
            <CardDescription>
              Upload PDF, images, or Word documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileDropzone onFilesSelected={setFiles} maxFiles={5} />

            {files.length > 0 && (
              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={performOCR}
                  disabled={ocrProcessing}
                >
                  {ocrProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing OCR...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Extract Text (OCR)
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Information */}
        <Card>
          <CardHeader>
            <CardTitle>Document Information</CardTitle>
            <CardDescription>
              Provide details about the document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter document title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="document_type_id">Document Type *</Label>
              <Controller
                name="document_type_id"
                control={control}
                rules={{ required: "Document type is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.icon} {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.document_type_id && (
                <p className="text-sm text-destructive">
                  {errors.document_type_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter document description (optional)"
                rows={3}
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas"
                {...register("tags")}
              />
              <p className="text-xs text-muted-foreground">
                Example: invoice, 2024, urgent
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Fields */}
        {selectedType && selectedType.fields && selectedType.fields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Custom Fields</CardTitle>
              <CardDescription>
                Fill in the fields specific to this document type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedType.fields
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={`field_${field.name}`}>
                      {field.label} {field.is_required && "*"}
                    </Label>

                    {field.field_type === "textarea" ? (
                      <Textarea
                        id={`field_${field.name}`}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        {...register(`field_${field.name}`, {
                          required: field.is_required
                            ? `${field.label} is required`
                            : false,
                        })}
                      />
                    ) : field.field_type === "select" ? (
                      <Controller
                        name={`field_${field.name}`}
                        control={control}
                        rules={{
                          required: field.is_required
                            ? `${field.label} is required`
                            : false,
                        }}
                        render={({ field: controllerField }) => (
                          <Select
                            onValueChange={controllerField.onChange}
                            value={controllerField.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options &&
                                Array.isArray(field.options) &&
                                field.options.map((option: string) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    ) : (
                      <Input
                        id={`field_${field.name}`}
                        type={
                          field.field_type === "number"
                            ? "number"
                            : field.field_type === "date"
                            ? "date"
                            : "text"
                        }
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        {...register(`field_${field.name}`, {
                          required: field.is_required
                            ? `${field.label} is required`
                            : false,
                        })}
                      />
                    )}

                    {errors[`field_${field.name}`] && (
                      <p className="text-sm text-destructive">
                        {errors[`field_${field.name}`]?.message as string}
                      </p>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* OCR Text Preview */}
        {ocrText && (
          <Card>
            <CardHeader>
              <CardTitle>Extracted Text (OCR)</CardTitle>
              <CardDescription>
                Text automatically extracted from the document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={ocrText}
                onChange={(e) => setOcrText(e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={uploading}
            className="flex-1"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Document"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
