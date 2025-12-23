import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FileConverter } from "@/components/tools/file-converter"

export default function PdfToTxtPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <FileConverter
            title="PDF to Text Converter"
            description="Extract text content from your PDF files"
            acceptedFormats={["application/pdf"]}
            apiEndpoint="/api/pdf-to-txt/"
            outputFormat="txt"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
