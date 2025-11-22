"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  Save
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/profile");
    } else if (status === "authenticated") {
      setName(session?.user?.name || "");
      setEmail(session?.user?.email || "");
      setLoading(false);
    }
  }, [status, session, router]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (response.ok) {
        setSaved(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || !session || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account information and security
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>Changes saved successfully!</span>
        </div>
      )}

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-purple-600" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>
            Update your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={email}
                disabled
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Email cannot be changed
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-purple-600" />
            <span>Change Password</span>
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleChangePassword}
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

