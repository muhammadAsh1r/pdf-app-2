import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileText, ImageIcon, FileSpreadsheet, Presentation, FileType, ArrowRightLeft } from "lucide-react"

export default function ToolsPage() {
  const toolCategories = [
    {
      title: "Convert from PDF",
      tools: [
        {
          title: "PDF to Word",
          description: "Convert PDF to editable DOCX format",
          icon: FileText,
          href: "/tools/pdf-to-docx",
        },
        {
          title: "PDF to JPG",
          description: "Extract images from PDF files",
          icon: ImageIcon,
          href: "/tools/pdf-to-jpg",
        },
        {
          title: "PDF to Excel",
          description: "Convert PDF tables to spreadsheet",
          icon: FileSpreadsheet,
          href: "/tools/pdf-to-excel",
        },
        {
          title: "PDF to PowerPoint",
          description: "Convert PDF to PPTX presentation",
          icon: Presentation,
          href: "/tools/pdf-to-pptx",
        },
        {
          title: "PDF to Text",
          description: "Extract text from PDF files",
          icon: FileType,
          href: "/tools/pdf-to-txt",
        },
      ],
    },
    {
      title: "Convert to PDF",
      tools: [
        {
          title: "Word to PDF",
          description: "Convert DOCX documents to PDF",
          icon: FileText,
          href: "/tools/docx-to-pdf",
        },
        {
          title: "JPG to PDF",
          description: "Convert images to PDF format",
          icon: ImageIcon,
          href: "/tools/images-to-pdf",
        },
        {
          title: "Excel to PDF",
          description: "Convert spreadsheets to PDF",
          icon: FileSpreadsheet,
          href: "/tools/excel-to-pdf",
        },
        {
          title: "PowerPoint to PDF",
          description: "Convert PPTX presentations to PDF",
          icon: Presentation,
          href: "/tools/pptx-to-pdf",
        },
        {
          title: "Text to PDF",
          description: "Convert text files to PDF",
          icon: FileType,
          href: "/tools/txt-to-pdf",
        },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ArrowRightLeft className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-4 text-4xl font-bold">All PDF Tools</h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Convert, edit, and manage your PDFs with our comprehensive suite of tools
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {toolCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="mb-6 text-2xl font-bold">{category.title}</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {category.tools.map((tool, toolIndex) => (
                      <Link key={toolIndex} href={tool.href}>
                        <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                          <CardHeader>
                            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <tool.icon className="h-6 w-6" />
                            </div>
                            <CardTitle>{tool.title}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
