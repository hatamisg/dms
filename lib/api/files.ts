import { supabase } from '@/lib/supabase'
import type { DocumentFile } from '@/types'

export async function uploadFile(
  file: File,
  documentId: string,
  version: number = 1
) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${documentId}/${version}-${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('documents')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  // Create file record
  const { data: fileRecord, error: fileError } = await supabase
    .from('document_files')
    .insert({
      document_id: documentId,
      file_name: file.name,
      file_path: data.path,
      file_size: file.size,
      mime_type: file.type,
      version,
      is_current: true,
    } as any)
    .select()
    .single()

  if (fileError) throw fileError

  // Mark other versions as not current
  await supabase
    .from('document_files')
    .update({ is_current: false } as any)
    .eq('document_id', documentId)
    .neq('id', fileRecord.id)

  return fileRecord as DocumentFile
}

export async function getFileUrl(path: string) {
  const { data } = supabase.storage.from('documents').getPublicUrl(path)

  return data.publicUrl
}

export async function downloadFile(path: string, fileName: string) {
  const { data, error } = await supabase.storage.from('documents').download(path)

  if (error) throw error

  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function deleteFile(path: string, fileId: string) {
  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([path])

  if (storageError) throw storageError

  // Delete file record
  const { error: dbError } = await supabase
    .from('document_files')
    .delete()
    .eq('id', fileId)

  if (dbError) throw dbError
}

export async function getDocumentFiles(documentId: string) {
  const { data, error } = await supabase
    .from('document_files')
    .select('*')
    .eq('document_id', documentId)
    .order('version', { ascending: false })

  if (error) throw error
  return data as DocumentFile[]
}
