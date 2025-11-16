# Supabase Setup

This directory contains the database schema and migrations for the DMS system.

## Setup Instructions

1. **Create a Supabase Project**:
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Configure Environment Variables**:
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

3. **Run Database Migration**:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `migrations/001_initial_schema.sql`
   - Run the SQL script

4. **Set up Storage Bucket**:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket named `documents`
   - Set the bucket to **public** (or configure appropriate policies)
   - This bucket will store all uploaded document files

## Database Schema

The system uses an Entity-Attribute-Value (EAV) pattern for flexible document schemas:

### Core Tables

- **document_types**: Defines custom document templates (e.g., Invoice, Contract)
- **document_fields**: Defines custom fields for each document type
- **documents**: Main document records with metadata
- **document_values**: Stores custom field values (EAV pattern)
- **document_files**: File storage references and version history
- **folders**: Hierarchical folder structure
- **audit_logs**: Tracks all document actions

### Sample Data

The migration includes sample document types:
- Invoice (with fields: invoice_number, invoice_date, amount, vendor)
- Contract (with fields: contract_id, parties, start_date, end_date)
- Receipt
- Report
- General

## Storage Bucket Setup

Create a bucket named `documents` with the following policy (for MVP without auth):

```sql
-- Allow public access for MVP (no authentication)
CREATE POLICY "Public Access"
ON storage.objects FOR ALL
USING (bucket_id = 'documents');
```

For production, you should implement proper RLS policies based on your authentication setup.

## Full-Text Search

The schema includes:
- Full-text search index on documents (title, description, OCR text)
- `search_documents(search_query TEXT)` function for searching
- Optimized GIN indexes for performance

## Usage

### Example: Search Documents

```sql
SELECT * FROM search_documents('invoice 2024');
```

### Example: Get Document with All Fields

```sql
SELECT
  d.*,
  dt.name as document_type_name,
  json_agg(
    json_build_object(
      'field_name', df.name,
      'field_label', df.label,
      'value', dv.value
    )
  ) as field_values
FROM documents d
JOIN document_types dt ON d.document_type_id = dt.id
LEFT JOIN document_values dv ON d.id = dv.document_id
LEFT JOIN document_fields df ON dv.field_id = df.id
WHERE d.id = 'your-document-id'
GROUP BY d.id, dt.name;
```
