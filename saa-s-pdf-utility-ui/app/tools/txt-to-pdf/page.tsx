import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FileConverter } from "@/components/tools/file-converter"

export default function TxtToPdfPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <FileConverter
            title="Text to PDF Converter"
            description="Convert plain text files to PDF format"
            acceptedFormats={["text/plain"]}
            apiEndpoint="/api/txt-to-pdf/"
            outputFormat="pdf"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
