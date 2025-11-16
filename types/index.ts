export interface DocumentType {
  id: string
  name: string
  description: string | null
  icon: string | null
  created_at: string
  updated_at: string
  fields?: DocumentField[]
}

export interface DocumentField {
  id: string
  document_type_id: string
  name: string
  label: string
  field_type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'textarea'
  is_required: boolean
  options: any | null
  order: number
  created_at: string
}

export interface Document {
  id: string
  document_type_id: string
  title: string
  description: string | null
  folder_id: string | null
  tags: string[]
  ocr_text: string | null
  public_link_token: string | null
  created_at: string
  updated_at: string
  document_type?: DocumentType
  values?: DocumentValue[]
  files?: DocumentFile[]
  folder?: Folder
}

export interface DocumentValue {
  id: string
  document_id: string
  field_id: string
  value: string | null
  created_at: string
  field?: DocumentField
}

export interface DocumentFile {
  id: string
  document_id: string
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  version: number
  is_current: boolean
  created_at: string
}

export interface Folder {
  id: string
  name: string
  parent_id: string | null
  created_at: string
  children?: Folder[]
}

export interface AuditLog {
  id: string
  document_id: string
  action: string
  changes: any | null
  created_at: string
}
