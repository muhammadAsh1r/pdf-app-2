import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FileConverter } from "@/components/tools/file-converter"

export default function ExcelToPdfPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <FileConverter
            title="Excel to PDF Converter"
            description="Convert Excel spreadsheets (XLSX) to PDF format"
            acceptedFormats={["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]}
            apiEndpoint="/api/excel-to-pdf/"
            outputFormat="pdf"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
