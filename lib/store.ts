import { create } from 'zustand'
import type { Document, DocumentType, Folder } from '@/types'

interface DMSStore {
  documents: Document[]
  documentTypes: DocumentType[]
  folders: Folder[]
  selectedDocument: Document | null
  searchQuery: string
  selectedFolderId: string | null
  selectedDocumentTypeId: string | null
  selectedTags: string[]

  setDocuments: (documents: Document[]) => void
  setDocumentTypes: (types: DocumentType[]) => void
  setFolders: (folders: Folder[]) => void
  setSelectedDocument: (document: Document | null) => void
  setSearchQuery: (query: string) => void
  setSelectedFolderId: (folderId: string | null) => void
  setSelectedDocumentTypeId: (typeId: string | null) => void
  setSelectedTags: (tags: string[]) => void
  addDocument: (document: Document) => void
  updateDocument: (id: string, document: Partial<Document>) => void
  removeDocument: (id: string) => void
}

export const useDMSStore = create<DMSStore>((set) => ({
  documents: [],
  documentTypes: [],
  folders: [],
  selectedDocument: null,
  searchQuery: '',
  selectedFolderId: null,
  selectedDocumentTypeId: null,
  selectedTags: [],

  setDocuments: (documents) => set({ documents }),
  setDocumentTypes: (documentTypes) => set({ documentTypes }),
  setFolders: (folders) => set({ folders }),
  setSelectedDocument: (selectedDocument) => set({ selectedDocument }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedFolderId: (selectedFolderId) => set({ selectedFolderId }),
  setSelectedDocumentTypeId: (selectedDocumentTypeId) =>
    set({ selectedDocumentTypeId }),
  setSelectedTags: (selectedTags) => set({ selectedTags }),

  addDocument: (document) =>
    set((state) => ({ documents: [document, ...state.documents] })),

  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    })),

  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),
}))
