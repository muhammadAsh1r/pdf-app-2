"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Building } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  popular?: boolean;
};

export default function UpgradePage() {
  // Mock — replace with API later
  const currentPlan = "Free";

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      interval: "month",
      description: "For occasional personal use",
      features: [
        "Limited conversions per month",
        "Basic tools access",
        "Standard processing speed",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 12,
      interval: "month",
      description: "For professionals and power users",
      popular: true,
      features: [
        "Unlimited conversions",
        "All PDF tools",
        "Priority processing",
        "Email support",
      ],
    },
    {
      id: "business",
      name: "Business",
      price: 49,
      interval: "month",
      description: "For teams and organizations",
      features: [
        "Unlimited conversions",
        "Team access",
        "Advanced security",
        "Priority support",
      ],
    },
  ];

  const handleUpgrade = (planId: string) => {
    // Stripe checkout later
    console.log("Upgrade to:", planId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Upgrade Your Plan</h1>
          <p className="text-muted-foreground">
            Choose the plan that best fits your needs.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.name === currentPlan;

            return (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular ? "border-primary" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute right-4 top-4">
                    Most Popular
                  </Badge>
                )}

                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {plan.name === "Free" && <Zap className="h-5 w-5" />}
                    {plan.name === "Pro" && <Crown className="h-5 w-5" />}
                    {plan.name === "Business" && (
                      <Building className="h-5 w-5" />
                    )}
                    {plan.name}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Price */}
                  <div>
                    <span className="text-3xl font-bold">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      /{plan.interval}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Action */}
                  {isCurrent ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      Upgrade
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-sm text-muted-foreground">
          You can cancel or change your plan at any time from the billing page.
        </p>
      </div>
    </DashboardLayout>
  );
}
