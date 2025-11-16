# Document Management System (DMS) MVP

A modern Document Management System built with Next.js 14 and Supabase, featuring dynamic schema support, OCR capabilities, and full-text search.

## Features

- **Dynamic Document Schema**: Create custom document types with flexible field definitions
- **OCR Processing**: Automatic text extraction from images and PDFs using Tesseract.js
- **Smart Search**: Full-text search across metadata and document content
- **File Management**: Upload, store, and version control for documents
- **Bulk Operations**: Manage multiple documents at once
- **Export**: Export document lists to CSV/Excel
- **Tags & Categories**: Organize documents with tags and folders
- **Public Sharing**: Share documents via public links
- **Audit Log**: Track all document actions

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database & Storage**: Supabase
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI)
- **Forms**: React Hook Form
- **Tables**: Tanstack Table
- **OCR**: Tesseract.js
- **State Management**: Zustand

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials in `.env.local`

3. Set up the database schema:
   - Run the SQL migrations in `supabase/migrations/`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
dms/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   └── ...             # Feature components
├── lib/                # Utility functions and configurations
│   ├── supabase.ts     # Supabase client
│   └── utils.ts        # Helper functions
├── supabase/           # Database schema and migrations
└── types/              # TypeScript type definitions
```

## Database Schema

The system uses an Entity-Attribute-Value (EAV) pattern for flexible document schemas:

- `document_types`: Custom document templates
- `document_fields`: Field definitions for each type
- `documents`: Main document records
- `document_values`: Custom field values
- `document_files`: File storage references and versions

## License

MIT
