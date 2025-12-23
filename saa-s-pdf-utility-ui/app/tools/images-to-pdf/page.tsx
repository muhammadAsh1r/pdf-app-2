import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FileConverter } from "@/components/tools/file-converter"

export default function ImagesToPdfPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <FileConverter
            title="Images to PDF Converter"
            description="Convert JPG, PNG images to PDF format"
            acceptedFormats={["image/jpeg", "image/png"]}
            apiEndpoint="/api/images-to-pdf/"
            outputFormat="pdf"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
