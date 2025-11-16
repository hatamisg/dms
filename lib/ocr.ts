import Tesseract from 'tesseract.js'

export async function extractTextFromImage(file: File): Promise<string> {
  const {
    data: { text },
  } = await Tesseract.recognize(file, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
      }
    },
  })

  return text
}

export async function extractTextFromPDF(file: File): Promise<string> {
  // For PDFs, we'll use Tesseract on each page
  // This is a simplified version - in production, you might want to use pdf.js
  // to render pages to images first
  const {
    data: { text },
  } = await Tesseract.recognize(file, 'eng')

  return text
}

export function extractFieldsFromText(
  text: string,
  fields: { name: string; label: string; field_type: string }[]
): Record<string, string> {
  const extracted: Record<string, string> = {}

  fields.forEach((field) => {
    // Simple pattern matching based on field labels
    const pattern = new RegExp(`${field.label}[:\\s]+([^\\n]+)`, 'i')
    const match = text.match(pattern)

    if (match && match[1]) {
      extracted[field.name] = match[1].trim()
    }
  })

  return extracted
}
