"use client";

import type React from "react";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          Loading settings...
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  const fullName =
    `${user.first_name} ${user.last_name}`.trim() || "—";

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage("New passwords do not match");
      setIsUpdating(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/auth/change-password/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            old_password: passwordForm.currentPassword,
            new_password: passwordForm.newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to update password");
      }

      setSuccessMessage("Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={fullName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input value={user.email} disabled />
              <p className="text-xs text-muted-foreground">
                Email address cannot be changed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handlePasswordChange}
              className="space-y-4"
            >
              {successMessage && (
                <Alert className="border-accent bg-accent/5">
                  <AlertDescription>
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                  disabled={isUpdating}
                />
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  minLength={8}
                  disabled={isUpdating}
                />
              </div>

              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  disabled={isUpdating}
                />
              </div>

              <Button type="submit" disabled={isUpdating}>
                {isUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates about your conversions
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-delete Files</p>
                <p className="text-sm text-muted-foreground">
                  Automatically delete files after 1 hour
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
