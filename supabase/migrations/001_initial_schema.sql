-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create document_types table
CREATE TABLE document_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_fields table
CREATE TABLE document_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_type_id UUID NOT NULL REFERENCES document_types(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  label VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL CHECK (field_type IN ('text', 'number', 'date', 'boolean', 'select', 'textarea')),
  is_required BOOLEAN DEFAULT false,
  options JSONB,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(document_type_id, name)
);

-- Create folders table
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_type_id UUID NOT NULL REFERENCES document_types(id) ON DELETE RESTRICT,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  ocr_text TEXT,
  public_link_token VARCHAR(100) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_values table (EAV pattern)
CREATE TABLE document_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  field_id UUID NOT NULL REFERENCES document_fields(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(document_id, field_id)
);

-- Create document_files table
CREATE TABLE document_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  file_name VARCHAR(500) NOT NULL,
  file_path VARCHAR(1000) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  version INTEGER DEFAULT 1,
  is_current BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_document_fields_type_id ON document_fields(document_type_id);
CREATE INDEX idx_documents_type_id ON documents(document_type_id);
CREATE INDEX idx_documents_folder_id ON documents(folder_id);
CREATE INDEX idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX idx_documents_public_link ON documents(public_link_token) WHERE public_link_token IS NOT NULL;
CREATE INDEX idx_document_values_doc_id ON document_values(document_id);
CREATE INDEX idx_document_values_field_id ON document_values(field_id);
CREATE INDEX idx_document_files_doc_id ON document_files(document_id);
CREATE INDEX idx_document_files_current ON document_files(document_id, is_current) WHERE is_current = true;
CREATE INDEX idx_audit_logs_doc_id ON audit_logs(document_id);
CREATE INDEX idx_folders_parent_id ON folders(parent_id);

-- Create full-text search index on documents
CREATE INDEX idx_documents_search ON documents USING GIN(to_tsvector('english',
  COALESCE(title, '') || ' ' ||
  COALESCE(description, '') || ' ' ||
  COALESCE(ocr_text, '')
));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_document_types_updated_at
  BEFORE UPDATE ON document_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function for full-text search
CREATE OR REPLACE FUNCTION search_documents(search_query TEXT)
RETURNS TABLE (
  id UUID,
  document_type_id UUID,
  title VARCHAR,
  description TEXT,
  folder_id UUID,
  tags TEXT[],
  ocr_text TEXT,
  public_link_token VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.document_type_id,
    d.title,
    d.description,
    d.folder_id,
    d.tags,
    d.ocr_text,
    d.public_link_token,
    d.created_at,
    d.updated_at,
    ts_rank(
      to_tsvector('english',
        COALESCE(d.title, '') || ' ' ||
        COALESCE(d.description, '') || ' ' ||
        COALESCE(d.ocr_text, '')
      ),
      plainto_tsquery('english', search_query)
    ) as rank
  FROM documents d
  WHERE to_tsvector('english',
    COALESCE(d.title, '') || ' ' ||
    COALESCE(d.description, '') || ' ' ||
    COALESCE(d.ocr_text, '')
  ) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample document types
INSERT INTO document_types (name, description, icon) VALUES
  ('Invoice', 'Business invoices and billing documents', '📄'),
  ('Contract', 'Legal contracts and agreements', '📋'),
  ('Receipt', 'Purchase receipts and proofs of payment', '🧾'),
  ('Report', 'Business reports and analytics', '📊'),
  ('General', 'General purpose documents', '📁');

-- Insert sample fields for Invoice type
INSERT INTO document_fields (document_type_id, name, label, field_type, is_required, "order")
SELECT
  id,
  'invoice_number',
  'Invoice Number',
  'text',
  true,
  1
FROM document_types WHERE name = 'Invoice';

INSERT INTO document_fields (document_type_id, name, label, field_type, is_required, "order")
SELECT
  id,
  'invoice_date',
  'Invoice Date',
  'date',
  true,
  2
FROM document_types WHERE name = 'Invoice';

INSERT INTO document_fields (document_type_id, name, label, field_type, is_required, "order")
SELECT
  id,
  'amount',
  'Total Amount',
  'number',
  true,
  3
FROM document_types WHERE name = 'Invoice';

INSERT INTO document_fields (document_type_id, name, label, field_type, is_required, "order")
SELECT
  id,
  'vendor',
  'Vendor Name',
  'text',
  true,
  4
FROM document_types WHERE name = 'Invoice';

-- Insert sample fields for Contract type
INSERT INTO document_fields (document_type_id, name, label, field_type, is_required, "order")
SELECT
  id,
  'contract_id',
  'Contract ID',
  'text',
  true,
  1
FROM document_types WHERE name = 'Contract';

INSERT INTO document_fields (document_type_id, name, label, field_type, is_required, "order")
SELECT
  id,
  'parties',
  'Parties Involved',
  'textarea',
  true,
  2
FROM document_types WHERE name = 'Contract';

INSERT INTO document_fields (document_type_id, name, label, field_type, is_required, "order")
SELECT
  id,
  'start_date',
  'Start Date',
  'date',
  true,
  3
FROM document_types WHERE name = 'Contract';

INSERT INTO document_fields (document_type_id, name, label, field_type, is_required, "order")
SELECT
  id,
  'end_date',
  'End Date',
  'date',
  false,
  4
FROM document_types WHERE name = 'Contract';

-- Enable Row Level Security (optional, can be configured later)
-- ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE document_fields ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE document_values ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE document_files ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- For MVP without authentication, create permissive policies
-- CREATE POLICY "Allow all operations" ON document_types FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON document_fields FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON documents FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON document_values FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON document_files FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON folders FOR ALL USING (true);
-- CREATE POLICY "Allow all operations" ON audit_logs FOR ALL USING (true);

COMMENT ON TABLE document_types IS 'Stores custom document type templates';
COMMENT ON TABLE document_fields IS 'Defines custom fields for each document type';
COMMENT ON TABLE documents IS 'Main document records with metadata';
COMMENT ON TABLE document_values IS 'Stores custom field values using EAV pattern';
COMMENT ON TABLE document_files IS 'File storage references and version history';
COMMENT ON TABLE folders IS 'Hierarchical folder structure for organization';
COMMENT ON TABLE audit_logs IS 'Tracks all document actions and changes';
