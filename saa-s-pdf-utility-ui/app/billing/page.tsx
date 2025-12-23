import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { CreditCard, Calendar, TrendingUp } from "lucide-react"

export default function BillingPage() {
  // Mock data - will be replaced with real API calls
  const subscription = {
    plan: "Pro",
    status: "Active",
    amount: 12,
    interval: "month",
    nextBillingDate: "2024-02-15",
    paymentMethod: {
      type: "Visa",
      last4: "4242",
      expiryMonth: "12",
      expiryYear: "2025",
    },
  }

  const invoices = [
    { id: "INV-001", date: "2024-01-15", amount: 12, status: "Paid" },
    { id: "INV-002", date: "2023-12-15", amount: 12, status: "Paid" },
    { id: "INV-003", date: "2023-11-15", amount: 12, status: "Paid" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and payment methods</p>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </div>
              <Badge>{subscription.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{subscription.plan}</p>
                <p className="text-sm text-muted-foreground">
                  ${subscription.amount}/{subscription.interval}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/pricing">
                  <Button variant="outline">Change Plan</Button>
                </Link>
                <Button variant="destructive">Cancel Subscription</Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Next billing date:</span>
              <span className="font-medium">{subscription.nextBillingDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Manage your payment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">
                    {subscription.paymentMethod.type} ending in {subscription.paymentMethod.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {subscription.paymentMethod.expiryMonth}/{subscription.paymentMethod.expiryYear}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
            <Button variant="ghost" className="w-full">
              Add New Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>Your conversion usage statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Conversions</span>
                </div>
                <p className="mt-2 text-2xl font-bold">247</p>
                <p className="text-xs text-muted-foreground">Unlimited available</p>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Files Processed</div>
                <p className="mt-2 text-2xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">+23% from last month</p>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Storage Used</div>
                <p className="mt-2 text-2xl font-bold">2.4 GB</p>
                <p className="text-xs text-muted-foreground">of 100 GB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice History */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>Download your past invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{invoice.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{invoice.status}</Badge>
                    <span className="font-medium">${invoice.amount.toFixed(2)}</span>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
