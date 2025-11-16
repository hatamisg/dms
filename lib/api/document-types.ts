import { supabase } from '@/lib/supabase'
import type { DocumentType, DocumentField } from '@/types'

export async function getDocumentTypes() {
  const { data, error } = await supabase
    .from('document_types')
    .select(`
      *,
      fields:document_fields(*)
    `)
    .order('name')

  if (error) throw error
  return data as (DocumentType & { fields: DocumentField[] })[]
}

export async function getDocumentType(id: string) {
  const { data, error } = await supabase
    .from('document_types')
    .select(`
      *,
      fields:document_fields(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as DocumentType & { fields: DocumentField[] }
}

export async function createDocumentType(
  documentType: Omit<DocumentType, 'id' | 'created_at' | 'updated_at'>,
  fields: Omit<DocumentField, 'id' | 'document_type_id' | 'created_at'>[]
) {
  // Create document type
  const { data: typeData, error: typeError } = await supabase
    .from('document_types')
    .insert(documentType as any)
    .select()
    .single()

  if (typeError) throw typeError

  const createdType = typeData as any

  // Create fields
  if (fields.length > 0) {
    const fieldsWithTypeId = fields.map((field) => ({
      ...field,
      document_type_id: createdType.id,
    }))

    const { error: fieldsError } = await supabase
      .from('document_fields')
      .insert(fieldsWithTypeId as any)

    if (fieldsError) throw fieldsError
  }

  return createdType as DocumentType
}

export async function updateDocumentType(
  id: string,
  documentType: Partial<Omit<DocumentType, 'id' | 'created_at' | 'updated_at'>>
) {
  const { data, error } = await supabase
    .from('document_types')
    .update(documentType as any)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as DocumentType
}

export async function deleteDocumentType(id: string) {
  const { error } = await supabase.from('document_types').delete().eq('id', id)

  if (error) throw error
}
