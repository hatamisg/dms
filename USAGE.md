# DMS Usage Guide

## Getting Started

### 1. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Overview

### 📄 Documents Management

**Location:** `/app/documents`

- View all your uploaded documents in a grid layout
- Filter documents by type and search by title
- Each document card shows:
  - Document title and type
  - Tags
  - Creation date
  - Quick actions (download, delete)

**Features:**
- Real-time search across document titles
- Filter by document type
- Responsive grid layout
- Loading states with skeleton screens

### ⬆️ Upload Documents

**Location:** `/app/upload`

**Process:**
1. Drag and drop files or click to browse
2. Select document type from dropdown
3. Fill in basic information:
   - Title (required)
   - Description (optional)
   - Tags (comma-separated)
4. Fill in custom fields based on selected document type
5. Optionally run OCR to extract text from images/PDFs
6. Click "Upload Document"

**Supported File Types:**
- PDF documents
- Images (PNG, JPG, JPEG, GIF)
- Word documents (DOC, DOCX)

**OCR Features:**
- Extract text from scanned documents
- Auto-populate custom fields from extracted text
- Edit extracted text before saving
- Works with images and PDFs

### 📋 Document Types

**Location:** `/app/types`

Document types define templates for different kinds of documents with custom fields.

**Pre-loaded Types:**
- 📄 Invoice (fields: invoice_number, invoice_date, amount, vendor)
- 📋 Contract (fields: contract_id, parties, start_date, end_date)
- 🧾 Receipt
- 📊 Report
- 📁 General

**Create New Type:**
1. Click "Create Type"
2. Enter name, icon (emoji), and description
3. Add custom fields:
   - Field name (internal identifier)
   - Label (display name)
   - Field type (text, number, date, textarea, select, boolean)
   - Mark as required if needed
4. Click "Create Type"

**Field Types:**
- **Text:** Single-line text input
- **Number:** Numeric input
- **Date:** Date picker
- **Textarea:** Multi-line text input
- **Select:** Dropdown with predefined options
- **Boolean:** Checkbox

### 📁 Folders

**Location:** `/app/folders`

Organize documents using a hierarchical folder structure.

**Features:**
- Create root folders or subfolders
- Hierarchical tree view
- Delete folders (cascades to subfolders)
- Assign documents to folders during upload

### 🏷️ Tags

Tags provide flexible categorization across document types.

**Usage:**
- Add tags during document upload (comma-separated)
- Example: "invoice, 2024, urgent, client-abc"
- Filter documents by tags on the documents page

## Database Structure

### Entity-Attribute-Value (EAV) Pattern

The system uses an EAV pattern for maximum flexibility:

```
document_types
  ├── document_fields (defines custom fields)
  └── documents
        ├── document_values (stores field values)
        ├── document_files (file storage references)
        └── audit_logs (tracks changes)
```

This allows you to:
- Create unlimited document types
- Define any number of custom fields
- Change field definitions without schema migrations
- Store heterogeneous data efficiently

## OCR Workflow

1. **Upload a document** with text content (scanned invoice, receipt, etc.)
2. **Click "Extract Text (OCR)"** button
3. **Wait for processing** (progress shown in toast)
4. **Review extracted text** in the preview box
5. **Check auto-populated fields** (if document type is selected)
6. **Edit as needed** - OCR isn't perfect, manual corrections may be needed
7. **Submit** the document

**Best Practices:**
- Use high-quality scans for better OCR accuracy
- Select document type before running OCR for auto-population
- Always review extracted data before submitting
- OCR works best with printed text (not handwriting)

## API Reference

All API functions are in `/lib/api/`:

### Documents
```typescript
import { getDocuments, createDocument, updateDocument, deleteDocument } from '@/lib/api/documents'

// Get all documents
const docs = await getDocuments({
  documentTypeId: 'type-id', // optional
  folderId: 'folder-id', // optional
  tags: ['tag1', 'tag2'], // optional
  limit: 20, // optional
  offset: 0 // optional
})

// Create document
const doc = await createDocument(
  {
    title: "My Document",
    description: "Description",
    document_type_id: "type-id",
    tags: ["tag1", "tag2"],
    ocr_text: "extracted text",
    folder_id: null,
    public_link_token: null
  },
  [
    { field_id: "field-1", value: "value1" },
    { field_id: "field-2", value: "value2" }
  ]
)

// Search documents
const results = await searchDocuments("search query")
```

### Document Types
```typescript
import { getDocumentTypes, createDocumentType } from '@/lib/api/document-types'

const types = await getDocumentTypes()

await createDocumentType(
  { name: "Custom Type", description: "...", icon: "📄" },
  [
    {
      name: "field_name",
      label: "Field Label",
      field_type: "text",
      is_required: true,
      order: 0
    }
  ]
)
```

### Files
```typescript
import { uploadFile, getFileUrl, downloadFile } from '@/lib/api/files'

// Upload file
const fileRecord = await uploadFile(file, documentId, version)

// Get public URL
const url = await getFileUrl(filePath)

// Download file
await downloadFile(filePath, fileName)
```

## State Management

The app uses Zustand for global state:

```typescript
import { useDMSStore } from '@/lib/store'

function MyComponent() {
  const { documents, setDocuments, documentTypes } = useDMSStore()

  // Use state...
}
```

**Available State:**
- `documents` - all documents
- `documentTypes` - all document types
- `folders` - all folders
- `selectedDocument` - currently selected document
- `searchQuery` - current search query
- `selectedFolderId` - active folder filter
- `selectedDocumentTypeId` - active type filter
- `selectedTags` - active tag filters

## Keyboard Shortcuts

(Coming soon - planned feature)

## Export Features

(Coming soon - planned feature)

Export document lists to CSV/Excel with all metadata and custom fields.

## Troubleshooting

### OCR Not Working
- Ensure the image is clear and high-resolution
- Check browser console for errors
- Tesseract.js loads language data on first use (may take time)

### Files Not Uploading
- Check Supabase Storage bucket exists (named "documents")
- Verify bucket permissions allow uploads
- Check file size limits (default 10MB)
- Ensure environment variables are set correctly

### Documents Not Loading
- Verify Supabase connection in browser console
- Check that SQL migration was run successfully
- Ensure environment variables are correct
- Clear browser cache and reload

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check that TypeScript configuration is correct
- Verify all environment variables are set

## Next Steps

1. **Create your first document type** for your specific use case
2. **Set up folders** to match your organization structure
3. **Upload documents** and test OCR functionality
4. **Customize** the UI to match your branding (update colors in `tailwind.config.ts`)
5. **Add authentication** (future enhancement) for multi-user support

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tesseract.js Documentation](https://tesseract.projectnaptha.com/)
- [Shadcn/ui Components](https://ui.shadcn.com/)

## Support

For issues or questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub
- Consult Supabase logs for backend errors
