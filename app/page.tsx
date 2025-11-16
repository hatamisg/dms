import Link from "next/link"
import { FileText, Wand2, Search, Upload, LayoutGrid, FolderTree } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-16 w-16 text-gray-900" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Document Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A modern DMS with OCR capabilities, dynamic schema support, and powerful organization features
          </p>
          <Link
            href="/app/documents"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Get Started
            <FileText className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <LayoutGrid className="h-10 w-10 text-gray-900 mb-4" />
            <h2 className="text-xl font-semibold mb-3">Dynamic Schema</h2>
            <p className="text-gray-600">
              Create custom document types with flexible field definitions. Define invoices, contracts, or any document type you need.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <Wand2 className="h-10 w-10 text-gray-900 mb-4" />
            <h2 className="text-xl font-semibold mb-3">OCR Processing</h2>
            <p className="text-gray-600">
              Extract text from images and PDFs automatically using Tesseract.js. Auto-populate fields with extracted data.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <Search className="h-10 w-10 text-gray-900 mb-4" />
            <h2 className="text-xl font-semibold mb-3">Smart Search</h2>
            <p className="text-gray-600">
              Full-text search across metadata and document content with powerful filtering and sorting capabilities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <Upload className="h-10 w-10 text-gray-900 mb-4" />
            <h2 className="text-xl font-semibold mb-3">Easy Upload</h2>
            <p className="text-gray-600">
              Drag-and-drop file upload with support for multiple formats including PDF, images, and Word documents.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <FolderTree className="h-10 w-10 text-gray-900 mb-4" />
            <h2 className="text-xl font-semibold mb-3">Organization</h2>
            <p className="text-gray-600">
              Organize documents with folders, tags, and categories. Build hierarchical structures that match your workflow.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <FileText className="h-10 w-10 text-gray-900 mb-4" />
            <h2 className="text-xl font-semibold mb-3">Version Control</h2>
            <p className="text-gray-600">
              Track document revisions with built-in version control. Never lose important changes or historical data.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
