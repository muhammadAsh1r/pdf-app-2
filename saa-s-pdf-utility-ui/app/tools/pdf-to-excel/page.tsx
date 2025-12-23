import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FileConverter } from "@/components/tools/file-converter"

export default function PdfToExcelPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <FileConverter
            title="PDF to Excel Converter"
            description="Convert PDF tables to Excel spreadsheets (XLSX)"
            acceptedFormats={["application/pdf"]}
            apiEndpoint="/api/pdf-to-excel/"
            outputFormat="xlsx"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
