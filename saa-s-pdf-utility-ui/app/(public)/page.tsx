import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  FileText,
  ImageIcon,
  FileSpreadsheet,
  Presentation,
  Upload,
  Download,
  Shield,
  Zap,
  Lock,
  Trash2,
  Check,
} from "lucide-react"

export default function HomePage() {
  const tools = [
    {
      title: "PDF to Word",
      description: "Convert PDF to editable DOCX",
      icon: FileText,
      href: "/tools/pdf-to-docx",
    },
    {
      title: "PDF to JPG",
      description: "Extract images from PDF",
      icon: ImageIcon,
      href: "/tools/pdf-to-jpg",
    },
    {
      title: "PDF to Excel",
      description: "Convert PDF to spreadsheet",
      icon: FileSpreadsheet,
      href: "/tools/pdf-to-excel",
    },
    {
      title: "PDF to PowerPoint",
      description: "Convert PDF to PPTX",
      icon: Presentation,
      href: "/tools/pdf-to-pptx",
    },
    {
      title: "Word to PDF",
      description: "Convert DOCX to PDF",
      icon: FileText,
      href: "/tools/docx-to-pdf",
    },
    {
      title: "JPG to PDF",
      description: "Convert images to PDF",
      icon: ImageIcon,
      href: "/tools/images-to-pdf",
    },
    {
      title: "Excel to PDF",
      description: "Convert spreadsheet to PDF",
      icon: FileSpreadsheet,
      href: "/tools/excel-to-pdf",
    },
    {
      title: "PowerPoint to PDF",
      description: "Convert PPTX to PDF",
      icon: Presentation,
      href: "/tools/pptx-to-pdf",
    },
  ]

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Convert files in seconds with our optimized processing engine",
    },
    {
      icon: Shield,
      title: "100% Secure",
      description: "All files are encrypted and automatically deleted after processing",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your files are never stored or shared with third parties",
    },
    {
      icon: Trash2,
      title: "Auto-Delete",
      description: "Files are permanently deleted from our servers after 1 hour",
    },
  ]

  const steps = [
    {
      icon: Upload,
      title: "Upload",
      description: "Select or drag and drop your file",
    },
    {
      icon: Zap,
      title: "Convert",
      description: "We process your file instantly",
    },
    {
      icon: Download,
      title: "Download",
      description: "Get your converted file immediately",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center md:py-32">
          <Badge className="mb-4" variant="secondary">
            Trusted by over 1M users worldwide
          </Badge>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl">
            Fast & Secure PDF Tools
            <br />
            <span className="text-primary">in One Place</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground text-pretty md:text-xl">
            Convert, merge, and edit PDFs online. No installation required. 100% free with premium features available.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free
              </Button>
            </Link>
            <Link href="/tools">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Browse Tools
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mx-auto mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" />
              <span>No watermarks</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" />
              <span>No file size limit</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" />
              <span>Secure processing</span>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">All PDF Tools</h2>
              <p className="text-lg text-muted-foreground">Choose from our collection of powerful PDF utilities</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                    <CardHeader>
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
              <p className="text-lg text-muted-foreground">Convert your files in three simple steps</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={index} className="relative text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>

                  {index < steps.length - 1 && (
                    <div className="absolute left-full top-8 hidden w-full -translate-x-1/2 md:block">
                      <div className="h-0.5 w-full bg-border"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose PDFKit?</h2>
              <p className="text-lg text-muted-foreground">Fast, secure, and reliable PDF processing</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-12 text-center">
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Get Started?</h2>
                <p className="mb-8 text-lg text-muted-foreground">Join thousands of users converting PDFs every day</p>
                <Link href="/register">
                  <Button size="lg">Create Free Account</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
