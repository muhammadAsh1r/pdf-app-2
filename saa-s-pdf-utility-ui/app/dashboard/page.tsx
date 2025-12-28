"use client";

import { useEffect, useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  FileText,
  ImageIcon,
  FileSpreadsheet,
  Presentation,
  Clock,
  TrendingUp,
  Zap,
  Crown,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

interface RecentFile {
  name: string;
  type: string;
  time: string;
}

interface DashboardData {
  conversions_used: number;
  conversions_limit: number;
  plan: string;
  files_processed: number;
  recent_files: RecentFile[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/dashboard/`, {
          credentials: "include", // 🔐 send auth cookies
          cache: "no-store",
        });

        if (res.status === 401) {
          // Not authenticated → back to login
          window.location.href = "/login";
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load dashboard");
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="text-center text-destructive">
          Failed to load dashboard.
        </div>
      </DashboardLayout>
    );
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
  ];

  const used = data.conversions_used;
  const limit = data.conversions_limit;
  const percent = limit ? (used / limit) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here’s what’s happening with your account today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Conversions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Conversions Used
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {used} / {limit}
              </div>
              <Progress value={percent} className="mt-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {Math.max(limit - used, 0)} conversions remaining
              </p>
            </CardContent>
          </Card>

          {/* Plan */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Current Plan
              </CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.plan}</div>
              <p className="mt-2 text-xs text-muted-foreground">
                Upgrade for unlimited conversions
              </p>
              <Link href="/pricing">
                <Button size="sm" className="mt-3">
                  Upgrade to Pro
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Files processed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Files Processed
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.files_processed}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Total conversions so far
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>
              Start converting files with your favorite tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickTools.map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card className="transition-all hover:shadow-lg hover:border-primary/50">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className={tool.color}>
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <span className="font-medium text-sm">
                        {tool.title}
                      </span>
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
            <CardDescription>
              Your recently processed files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recent_files.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No conversions yet.
                </p>
              )}

              {data.recent_files.map((file, index) => (
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
                        <span>{file.type.toUpperCase()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(file.time).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade CTA */}
        {data.plan === "Free" && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="flex flex-col items-center justify-between gap-4 p-6 md:flex-row">
              <div>
                <h3 className="text-lg font-semibold">
                  Unlock unlimited conversions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Pro and remove all limits
                </p>
              </div>
              <Link href="/pricing">
                <Button>View Plans</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
