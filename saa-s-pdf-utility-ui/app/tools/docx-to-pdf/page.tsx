import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FileConverter } from "@/components/tools/file-converter"

export default function DocxToPdfPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <FileConverter
            title="Word to PDF Converter"
            description="Convert Word documents (DOCX) to PDF format"
            acceptedFormats={["application/vnd.openxmlformats-officedocument.wordprocessingml.document"]}
            apiEndpoint="/api/docx-to-pdf/"
            outputFormat="pdf"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
