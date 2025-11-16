# Document Management System (DMS) MVP

## Project Overview
Build a Document Management System (DMS) MVP with Next.js and Supabase. Focus on core functionality without authentication.

## Core Requirements

### 1. Dynamic Document Schema System
- Create a flexible table structure that allows users to define custom fields for different document types
- Implement a metadata system where users can create custom document templates (e.g., invoice template with fields: invoice_number, date, amount, vendor; contract template with fields: contract_id, parties, start_date, end_date)
- Store documents with their custom fields dynamically without hardcoding schema

### 2. Document Management Features
- Upload multiple file formats (PDF, images, Word docs)
- Store files in Supabase Storage
- List view with filtering and sorting by custom fields
- Search functionality across document content and metadata
- Bulk operations (delete, download, update metadata)
- Document preview in browser
- Version control - track document revisions

### 3. OCR Integration
- Integrate Tesseract.js or similar client-side OCR library
- Extract text from uploaded images/PDFs
- Make extracted text searchable
- Auto-populate custom fields based on OCR results (with manual override option)

### 4. Tech Stack
- Next.js 14 with App Router
- Supabase for database and file storage
- Tailwind CSS for styling
- Shadcn/ui components
- React Hook Form for dynamic forms
- Tanstack Table for data tables

### 5. Database Schema
Design flexible schema with tables:
- `document_types` (stores custom templates)
- `document_fields` (defines fields for each type)
- `documents` (main document records)
- `document_values` (stores custom field values using EAV pattern)
- `document_files` (file references and versions)

### 6. UI/UX Requirements
- Clean, minimalist interface
- Drag-and-drop file upload
- Real-time search with debouncing
- Responsive design
- Toast notifications for actions
- Loading states and error handling
- Keyboard shortcuts for common actions

### 7. Additional MVP Features
- Export documents list to CSV/Excel
- Basic folder/category organization
- Tag system for documents
- Quick actions menu (right-click context menu)
- Document sharing via public links (no auth required)
- Basic audit log (track document actions)
- Full-text search using Supabase's text search
- Document templates library

## Implementation Steps
1. Set up Next.js project with Supabase
2. Design and implement database schema
3. Build custom document type builder interface
4. Implement file upload and storage
5. Add OCR functionality
6. Create search and filter system
7. Build document viewer and editor
8. Add export and sharing features
9. Implement audit logging
10. Polish UI/UX and error handling

## Key Features for MVP
- **Custom Fields**: Users can define their own document structure
- **OCR Processing**: Automatic text extraction from images/PDFs
- **Smart Search**: Search across both metadata and document content
- **No Authentication**: Simple, open access for MVP
- **Responsive Design**: Works on desktop and mobile
- **File Versioning**: Track document changes over time

## Database Design Notes
Use Entity-Attribute-Value (EAV) pattern for flexible schema:
- Documents have a type
- Each type defines its fields
- Values are stored separately with reference to document and field
- This allows unlimited custom fields without schema changes

## Performance Considerations
- Implement pagination for document lists
- Use database indexing for search fields
- Lazy load document previews
- Cache OCR results
- Optimize images before storage

## Future Enhancements (Post-MVP)
- User authentication and permissions
- Workflow automation
- Email integration
- API for third-party integrations
- Advanced OCR with AI field detection
- Mobile app
- Collaborative editing
- Advanced analytics dashboard
