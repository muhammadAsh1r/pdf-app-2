import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FileConverter } from "@/components/tools/file-converter"

export default function PdfToJpgPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <FileConverter
            title="PDF to JPG Converter"
            description="Extract images from your PDF files as JPG"
            acceptedFormats={["application/pdf"]}
            apiEndpoint="/api/pdf-to-jpg/"
            outputFormat="jpg"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
