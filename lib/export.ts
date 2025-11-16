import * as XLSX from 'xlsx'
import type { Document } from '@/types'

export function exportToCSV(documents: Document[], fileName: string = 'documents.csv') {
  if (documents.length === 0) return

  // Get all unique field names
  const fieldNames = new Set<string>()
  documents.forEach((doc) => {
    doc.values?.forEach((val) => {
      if (val.field?.name) {
        fieldNames.add(val.field.name)
      }
    })
  })

  // Create headers
  const headers = [
    'Title',
    'Description',
    'Document Type',
    'Folder',
    'Tags',
    'Created At',
    ...Array.from(fieldNames),
  ]

  // Create rows
  const rows = documents.map((doc) => {
    const row: any = {
      Title: doc.title,
      Description: doc.description || '',
      'Document Type': doc.document_type?.name || '',
      Folder: doc.folder?.name || '',
      Tags: doc.tags.join(', '),
      'Created At': new Date(doc.created_at).toLocaleDateString(),
    }

    // Add custom field values
    doc.values?.forEach((val) => {
      if (val.field?.name) {
        row[val.field.name] = val.value || ''
      }
    })

    return row
  })

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers })
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Documents')

  // Download
  XLSX.writeFile(workbook, fileName)
}

export function exportToExcel(documents: Document[], fileName: string = 'documents.xlsx') {
  exportToCSV(documents, fileName)
}
