import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { FileText, ImageIcon, FileSpreadsheet, Presentation, Clock, TrendingUp, Zap, Crown } from "lucide-react"

export default function DashboardPage() {
  // Mock user data - will be replaced with real API calls
  const user = {
    name: "John Doe",
    email: "john@example.com",
    plan: "Free",
  }

  const usage = {
    conversionsUsed: 7,
    conversionsLimit: 10,
    storageUsed: 45,
    storageLimit: 100,
  }

  const quickTools = [
    {
      title: "PDF to Word",
      icon: FileText,
      href: "/tools/pdf-to-docx",
      color: "text-blue-500",
    },
    {
      title: "PDF to JPG",
      icon: ImageIcon,
      href: "/tools/pdf-to-jpg",
      color: "text-green-500",
    },
    {
      title: "PDF to Excel",
      icon: FileSpreadsheet,
      href: "/tools/pdf-to-excel",
      color: "text-emerald-500",
    },
    {
      title: "PDF to PowerPoint",
      icon: Presentation,
      href: "/tools/pdf-to-pptx",
      color: "text-orange-500",
    },
  ]

  const recentFiles = [
    {
      name: "Project-Proposal.pdf",
      type: "PDF to Word",
      date: "2 hours ago",
      status: "Completed",
    },
    {
      name: "Invoice-2024.xlsx",
      type: "Excel to PDF",
      date: "5 hours ago",
      status: "Completed",
    },
    {
      name: "Presentation.pptx",
      type: "PowerPoint to PDF",
      date: "1 day ago",
      status: "Completed",
    },
    {
      name: "Report-Draft.docx",
      type: "Word to PDF",
      date: "2 days ago",
      status: "Completed",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your account today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversions Used</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usage.conversionsUsed} / {usage.conversionsLimit}
              </div>
              <Progress value={(usage.conversionsUsed / usage.conversionsLimit) * 100} className="mt-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {usage.conversionsLimit - usage.conversionsUsed} conversions remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.plan}</div>
              <p className="mt-2 text-xs text-muted-foreground">Upgrade for unlimited conversions</p>
              <Link href="/pricing">
                <Button size="sm" className="mt-3">
                  Upgrade to Pro
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Files Processed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="mt-2 text-xs text-muted-foreground">+12 from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Start converting files with your favorite tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickTools.map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card className="transition-all hover:shadow-lg hover:border-primary/50">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className={`${tool.color}`}>
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <span className="font-medium text-sm">{tool.title}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Files */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversions</CardTitle>
            <CardDescription>Your recently processed files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{file.type}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {file.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">{file.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade CTA */}
        {user.plan === "Free" && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="flex flex-col items-center justify-between gap-4 p-6 md:flex-row">
              <div>
                <h3 className="text-lg font-semibold">Unlock unlimited conversions</h3>
                <p className="text-sm text-muted-foreground">Upgrade to Pro and remove all limits</p>
              </div>
              <Link href="/pricing">
                <Button>View Plans</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
