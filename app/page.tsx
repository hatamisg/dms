export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Document Management System
          </h1>
          <p className="text-lg text-gray-600">
            A modern DMS with OCR capabilities and dynamic schema support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Dynamic Schema</h2>
            <p className="text-gray-600">
              Create custom document types with flexible field definitions
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">OCR Processing</h2>
            <p className="text-gray-600">
              Extract text from images and PDFs automatically
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Smart Search</h2>
            <p className="text-gray-600">
              Full-text search across metadata and document content
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
