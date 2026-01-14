"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Free",
      description: "Perfect for occasional use",
      price: {
        monthly: 0,
        annual: 0,
      },
      features: [
        "10 conversions per day",
        "Max file size: 10MB",
        "Standard conversion speed",
        "Basic support",
        "Files deleted after 1 hour",
      ],
      cta: "Get Started",
      href: "/register",
      popular: false,
    },
    {
      name: "Pro",
      description: "For power users and professionals",
      price: {
        monthly: 12,
        annual: 120,
      },
      features: [
        "Unlimited conversions",
        "Max file size: 100MB",
        "Priority conversion speed",
        "Priority email support",
        "Batch processing",
        "No ads",
        "Files deleted after 24 hours",
        "API access",
      ],
      cta: "Start Free Trial",
      href: "/register?plan=pro",
      popular: true,
    },
    {
      name: "Business",
      description: "For teams and organizations",
      price: {
        monthly: 49,
        annual: 490,
      },
      features: [
        "Everything in Pro",
        "Unlimited file size",
        "Team management (up to 10 users)",
        "Dedicated support",
        "Custom branding",
        "Advanced API access",
        "SSO integration",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      href: "/contact?plan=business",
      popular: false,
    },
  ]

  const allFeatures = [
    {
      category: "Conversions",
      features: [
        { name: "Daily conversions", free: "10", pro: "Unlimited", business: "Unlimited" },
        { name: "Max file size", free: "10MB", pro: "100MB", business: "Unlimited" },
        { name: "Batch processing", free: false, pro: true, business: true },
        { name: "Priority processing", free: false, pro: true, business: true },
      ],
    },
    {
      category: "Features",
      features: [
        { name: "All conversion tools", free: true, pro: true, business: true },
        { name: "No watermarks", free: true, pro: true, business: true },
        { name: "Custom branding", free: false, pro: false, business: true },
        { name: "API access", free: false, pro: true, business: true },
      ],
    },
    {
      category: "Support",
      features: [
        { name: "Email support", free: "Basic", pro: "Priority", business: "Dedicated" },
        { name: "Response time", free: "48h", pro: "12h", business: "4h" },
        { name: "SLA guarantee", free: false, pro: false, business: true },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-muted/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Simple, transparent pricing</h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Choose the plan that fits your needs. All plans include our core features.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-3 rounded-full bg-muted p-1">
              <Label
                htmlFor="billing-toggle"
                className={`cursor-pointer px-4 py-2 rounded-full transition-colors ${
                  !isAnnual ? "bg-background shadow-sm" : ""
                }`}
              >
                Monthly
              </Label>
              <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
              <Label
                htmlFor="billing-toggle"
                className={`cursor-pointer px-4 py-2 rounded-full transition-colors ${
                  isAnnual ? "bg-background shadow-sm" : ""
                }`}
              >
                Annual
                <Badge className="ml-2" variant="secondary">
                  Save 17%
                </Badge>
              </Label>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ${isAnnual ? Math.floor(plan.price.annual / 12) : plan.price.monthly}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                      {isAnnual && plan.price.annual > 0 && (
                        <p className="mt-1 text-sm text-muted-foreground">Billed ${plan.price.annual} annually</p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link href={plan.href}>
                      <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                        {plan.cta}
                      </Button>
                    </Link>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <Check className="h-5 w-5 shrink-0 text-accent" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Compare all features</h2>
              <p className="text-lg text-muted-foreground">See what's included in each plan</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-4 text-left font-semibold">Feature</th>
                    <th className="px-4 py-4 text-center font-semibold">Free</th>
                    <th className="px-4 py-4 text-center font-semibold">Pro</th>
                    <th className="px-4 py-4 text-center font-semibold">Business</th>
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((category, categoryIndex) => (
                    <>
                      <tr key={`category-${categoryIndex}`} className="bg-muted/50">
                        <td colSpan={4} className="py-3 font-semibold">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={featureIndex} className="border-b border-border">
                          <td className="py-4">{feature.name}</td>
                          <td className="px-4 py-4 text-center">
                            {typeof feature.free === "boolean" ? (
                              feature.free ? (
                                <Check className="mx-auto h-5 w-5 text-accent" />
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )
                            ) : (
                              feature.free
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {typeof feature.pro === "boolean" ? (
                              feature.pro ? (
                                <Check className="mx-auto h-5 w-5 text-accent" />
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )
                            ) : (
                              feature.pro
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {typeof feature.business === "boolean" ? (
                              feature.business ? (
                                <Check className="mx-auto h-5 w-5 text-accent" />
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )
                            ) : (
                              feature.business
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">Frequently asked questions</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I change plans later?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next
                    billing cycle.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We accept all major credit cards (Visa, MasterCard, American Express) and PayPal.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a free trial?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Pro and Business plans come with a 14-day free trial. No credit card required.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How secure is my data?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All files are encrypted during upload and processing. Files are automatically deleted from our
                    servers after the retention period.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
