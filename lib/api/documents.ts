import { supabase } from '@/lib/supabase'
import type { Document, DocumentValue } from '@/types'

export async function getDocuments(options?: {
  documentTypeId?: string
  folderId?: string
  tags?: string[]
  limit?: number
  offset?: number
}) {
  let query = supabase
    .from('documents')
    .select(`
      *,
      document_type:document_types(*),
      folder:folders(*),
      values:document_values(*, field:document_fields(*)),
      files:document_files(*)
    `)
    .order('created_at', { ascending: false })

  if (options?.documentTypeId) {
    query = query.eq('document_type_id', options.documentTypeId)
  }

  if (options?.folderId) {
    query = query.eq('folder_id', options.folderId)
  }

  if (options?.tags && options.tags.length > 0) {
    query = query.contains('tags', options.tags)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Document[]
}

export async function getDocument(id: string) {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      document_type:document_types(*),
      folder:folders(*),
      values:document_values(*, field:document_fields(*)),
      files:document_files(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Document
}

export async function searchDocuments(query: string) {
  const { data, error } = await supabase.rpc('search_documents', {
    search_query: query,
  })

  if (error) throw error
  return data as Document[]
}

export async function createDocument(
  document: Omit<Document, 'id' | 'created_at' | 'updated_at'>,
  values: { field_id: string; value: string }[]
) {
  const { data: docData, error: docError } = await supabase
    .from('documents')
    .insert(document as any)
    .select()
    .single()

  if (docError) throw docError

  if (values.length > 0) {
    const valuesWithDocId = values.map((v) => ({
      ...v,
      document_id: docData.id,
    }))

    const { error: valuesError } = await supabase
      .from('document_values')
      .insert(valuesWithDocId as any)

    if (valuesError) throw valuesError
  }

  // Create audit log
  await createAuditLog(docData.id, 'created', { document: docData })

  return docData as Document
}

export async function updateDocument(
  id: string,
  document: Partial<Omit<Document, 'id' | 'created_at' | 'updated_at'>>,
  values?: { field_id: string; value: string }[]
) {
  const { data, error } = await supabase
    .from('documents')
    .update(document as any)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  if (values) {
    // Delete existing values
    await supabase.from('document_values').delete().eq('document_id', id)

    // Insert new values
    if (values.length > 0) {
      const valuesWithDocId = values.map((v) => ({
        ...v,
        document_id: id,
      }))

      const { error: valuesError } = await supabase
        .from('document_values')
        .insert(valuesWithDocId as any)

      if (valuesError) throw valuesError
    }
  }

  // Create audit log
  await createAuditLog(id, 'updated', { document, values })

  return data as Document
}

export async function deleteDocument(id: string) {
  const { error } = await supabase.from('documents').delete().eq('id', id)

  if (error) throw error

  // Audit log will be deleted automatically due to CASCADE
}

export async function generatePublicLink(documentId: string) {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

  const { data, error } = await supabase
    .from('documents')
    .update({ public_link_token: token } as any)
    .eq('id', documentId)
    .select()
    .single()

  if (error) throw error

  return token
}

export async function getDocumentByPublicToken(token: string) {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      document_type:document_types(*),
      values:document_values(*, field:document_fields(*)),
      files:document_files(*)
    `)
    .eq('public_link_token', token)
    .single()

  if (error) throw error
  return data as Document
}

async function createAuditLog(documentId: string, action: string, changes: any) {
  await supabase.from('audit_logs').insert({
    document_id: documentId,
    action,
    changes,
  } as any)
}
