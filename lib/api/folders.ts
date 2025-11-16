import { supabase } from '@/lib/supabase'
import type { Folder } from '@/types'

export async function getFolders() {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .order('name')

  if (error) throw error
  return data as Folder[]
}

export async function createFolder(folder: Omit<Folder, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('folders')
    .insert(folder as any)
    .select()
    .single()

  if (error) throw error
  return data as Folder
}

export async function updateFolder(
  id: string,
  folder: Partial<Omit<Folder, 'id' | 'created_at'>>
) {
  const { data, error } = await supabase
    .from('folders')
    .update(folder as any)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Folder
}

export async function deleteFolder(id: string) {
  const { error } = await supabase.from('folders').delete().eq('id', id)

  if (error) throw error
}

export function buildFolderTree(folders: Folder[]): Folder[] {
  const folderMap = new Map<string, Folder>()
  const rootFolders: Folder[] = []

  // Create folder map
  folders.forEach((folder) => {
    folderMap.set(folder.id, { ...folder, children: [] })
  })

  // Build tree
  folders.forEach((folder) => {
    const currentFolder = folderMap.get(folder.id)!

    if (folder.parent_id) {
      const parent = folderMap.get(folder.parent_id)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(currentFolder)
      }
    } else {
      rootFolders.push(currentFolder)
    }
  })

  return rootFolders
}
