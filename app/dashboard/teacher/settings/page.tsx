"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Settings,
  Bell,
  Shield,
  Palette,
  Camera,
  Save,
  Loader2,
  Check,
  Moon,
  Sun,
  Laptop,
  GraduationCap,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function TeacherSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  // Profile state
  const [profile, setProfile] = useState({
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@faculty.edu",
    phone: "0987654321", // Updated dummy data to match 10-digit numeric format
    college: "Government College, Rajasthan",
    department: "Computer Science",
    employeeId: "FAC2020045",
    designation: "Assistant Professor",
    qualification: "Ph.D. in Computer Science",
    specialization: "Data Structures & Algorithms",
    bio: "Passionate educator with 10+ years of experience in teaching computer science to undergraduate students.",
  });

  const [phoneValidationError, setPhoneValidationError] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (/[^0-9]/.test(value)) {
      setPhoneValidationError("Only numbers are allowed");
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      e.target.value = numericValue;
      setProfile({ ...profile, phone: numericValue });
      return;
    }
    
    if (value.length > 10) {
      setPhoneValidationError("Maximum length is exactly 10 digits");
      const truncated = value.slice(0, 10);
      e.target.value = truncated;
      setProfile({ ...profile, phone: truncated });
      return;
    }
    
    if (value.length > 0 && value.length < 10) {
      setPhoneValidationError("Must be exactly 10 digits");
    } else {
      setPhoneValidationError("");
    }

    setProfile({ ...profile, phone: value });
  };

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    submissionAlerts: true,
    discussionAlerts: true,
    attendanceReminders: true,
  });

  const handleSave = async (section: string) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and teaching preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="teaching" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Teaching</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal and professional information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-lg">RK</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Personal Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                  />
                  {phoneValidationError && (
                    <p className="text-xs text-destructive mt-1">{phoneValidationError}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={profile.employeeId}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <Separator />

              {/* Professional Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="college">College</Label>
                  <Input
                    id="college"
                    value={profile.college}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Select
                    value={profile.designation}
                    onValueChange={(value) =>
                      setProfile({ ...profile, designation: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                      <SelectItem value="Assistant Professor">
                        Assistant Professor
                      </SelectItem>
                      <SelectItem value="Associate Professor">
                        Associate Professor
                      </SelectItem>
                      <SelectItem value="Professor">Professor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={profile.qualification}
                    onChange={(e) =>
                      setProfile({ ...profile, qualification: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("profile")} disabled={isSaving || (profile.phone.length > 0 && profile.phone.length !== 10)}>
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : savedSection === "profile" ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {savedSection === "profile" ? "Saved!" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teaching Tab */}
        <TabsContent value="teaching" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Preferences</CardTitle>
              <CardDescription>
                Configure your teaching and class management settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={profile.specialization}
                  onChange={(e) =>
                    setProfile({ ...profile, specialization: e.target.value })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Default Settings</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-accept late submissions</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow students to submit after deadline with penalty
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable plagiarism check</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically check submissions for plagiarism
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, emailNotifications: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Submission Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when students submit assignments
                  </p>
                </div>
                <Switch
                  checked={preferences.submissionAlerts}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, submissionAlerts: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Discussion Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new discussion posts
                  </p>
                </div>
                <Switch
                  checked={preferences.discussionAlerts}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, discussionAlerts: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Attendance Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Remind to mark attendance for scheduled classes
                  </p>
                </div>
                <Switch
                  checked={preferences.attendanceReminders}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, attendanceReminders: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Customize how RuralClass looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="flex h-auto flex-col gap-2 p-4"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-6 w-6" />
                  <span>Light</span>
                  {theme === "light" && <Badge className="mt-1">Active</Badge>}
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="flex h-auto flex-col gap-2 p-4"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-6 w-6" />
                  <span>Dark</span>
                  {theme === "dark" && <Badge className="mt-1">Active</Badge>}
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className="flex h-auto flex-col gap-2 p-4"
                  onClick={() => setTheme("system")}
                >
                  <Laptop className="h-6 w-6" />
                  <span>System</span>
                  {theme === "system" && <Badge className="mt-1">Active</Badge>}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data & Privacy
              </CardTitle>
              <CardDescription>
                Manage your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Download My Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export Class Records
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
