// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api"; // axios instance with baseURL configured

import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Server,
  Building,
  Users,
  CheckCircle,
  Clock as ClockIcon,
  BarChart,
  ShieldCheck,
  Key,
  GraduationCap,
} from "lucide-react";

import { format } from "date-fns";

const Profile = () => {
  const { user } = useAuth(); // user.id, user.name, user.email, user.role, user.token
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Local state for editing fields
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");

  // Fetch user profile on mount
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user?.id) {
        toast({
          title: "Not logged in",
          description: "Please log in to view your profile.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      try {
        const response = await api.get(
          `/api/auth/getuserprofile/${user.id}`
        );

        // Backend returns { user: { ... } }
        const fetchedUser = response.data.user;
        if (!fetchedUser) {
          toast({
            title: "Error",
            description: "User not found.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        setProfile(fetchedUser);

        // Initialize editing fields
        setFullName(fetchedUser.full_name || "");
        setEmail(fetchedUser.email || "");
        setPhone(fetchedUser.phone || "");
        setDob(
          fetchedUser.date_of_birth
            ? format(new Date(fetchedUser.date_of_birth), "yyyy-MM-dd")
            : ""
        );
        setLocation(fetchedUser.location || "");
        setEducation(fetchedUser.education || "");
      } catch (err) {
        console.error("Error fetching user profile:", err);
        toast({
          title: "Error",
          description: "Could not load profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }, [user, navigate]);

  if (loading) {
    return (
      <PageLayout>
        <div className="text-white text-center py-20">Loading profile…</div>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout>
        <div className="text-red-500 text-center py-20">
          Unable to load profile.
        </div>
      </PageLayout>
    );
  }

  // Helper to get user initials
  const getInitials = () => {
    if (!profile.full_name) return "U";
    return profile.full_name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  // Compute age from DOB (if present)
  const getAge = () => {
    if (!profile.date_of_birth) return "";
    const birth = new Date(profile.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Save profile changes by calling PUT /api/auth/updateprofile/:id
  const handleSaveProfile = async () => {
    try {
      const payload = {
        full_name: fullName,
        phone: phone,
        date_of_birth: dob,
        location: location,
        education: education,
      };

      const response = await api.put(
        `/api/auth/updateprofile/${user.id}`,
        payload
      );

      if (response.status === 200) {
        const updatedUser = response.data.user;
        setProfile(updatedUser);
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your changes have been saved.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Server error.",
        variant: "destructive",
      });
    }
  };

  // Render sections based on role
  const renderCandidateProfile = () => (
    <>
      {/* Education Section */}
      {/* <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="mr-2 h-5 w-5" />
            Education
          </CardTitle>
          <CardDescription>List your academic qualifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.education ? (
            <div>
              <p className="font-medium">{profile.education}</p>
            </div>
          ) : (
            <p className="text-gray-500">No education info added.</p>
          )}
        </CardContent>
        {isEditing && (
          <CardFooter>
            <Button variant="outline" size="sm">
              Add / Update Education
            </Button>
          </CardFooter>
        )}
      </Card> */}
      {/* (Optional) Assessment Summary */}
    </>
  );

  const renderRecruiterProfile = () => {
    // Example data – you can fetch real metrics later
    const recruiterDepartments = [
      { id: 1, name: "Engineering", openPositions: 3, activeCandidates: 12 },
      { id: 2, name: "Product Design", openPositions: 2, activeCandidates: 8 },
    ];

    return (
      <>
        {/* Department Information */}
        {/* <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Department Information
            </CardTitle>
            <CardDescription>
              Overview of your managed departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recruiterDepartments.map((dept) => (
                <div
                  key={dept.id}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="font-medium">{dept.name} Department</div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-gray-500">Open Positions</div>
                      <div className="text-xl font-semibold">
                        {dept.openPositions}
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-gray-500">
                        Active Candidates
                      </div>
                      <div className="text-xl font-semibold">
                        {dept.activeCandidates}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/candidates")}
            >
              View All Candidates
            </Button>
          </CardFooter>
        </Card> */}

        {/* Activity Summary */}
        {/*<Card className="mb-6">
           <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              Recruitment Activity
            </CardTitle>
            <CardDescription>Recent metrics & updates</CardDescription>
          </CardHeader>*/}
          {/* <CardContent> 
            <div className="space-y-4">
               <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-gray-500">Assessments Sent</div>
                  <div className="text-xl font-semibold">28</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-gray-500">Completion Rate</div>
                  <div className="text-xl font-semibold">72%</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-gray-500">Avg. Score</div>
                  <div className="text-xl font-semibold">84%</div>
                </div>
              </div> */}

              {/* <div className="mt-4">
                <h4 className="font-medium mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="text-sm rounded-lg bg-gray-50 p-3">
                    <div className="flex justify-between">
                      <span>Sent assessment to Alex Johnson</span>
                      <span className="text-gray-500">2 days ago</span>
                    </div>
                  </div>
                  <div className="text-sm rounded-lg bg-gray-50 p-3">
                    <div className="flex justify-between">
                      <span>Reviewed results for Taylor Brown</span>
                      <span className="text-gray-500">5 days ago</span>
                    </div>
                  </div>
                </div>
              </div> 
            </div>
          </CardContent>*/}
          {/* <CardFooter>
            {/* <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/analytics")}
            >
              View Analytics
            </Button> 
          </CardFooter> 
        </Card>*/}
      </>
    );
  };

  const renderAdminProfile = () => {
    // Example static stats; replace with real data as needed
    const adminSystemStats = [
      { id: 1, name: "System Uptime", value: "99.98%", trend: "stable" },
      { id: 2, name: "Last Security Audit", value: "2025-03-15", trend: "completed" },
      { id: 3, name: "Database Size", value: "2.8 GB", trend: "growing" },
    ];

    return (
      <>
        {/* System Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>Overview of server & DB health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminSystemStats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="font-medium">{stat.name}</div>
                  <div className="flex items-center">
                    <span className="mr-2">{stat.value}</span>
                    <Badge
                      className={`${
                        stat.trend === "stable"
                          ? "bg-emerald-100 text-emerald-600"
                          : ""
                      } ${
                        stat.trend === "growing"
                          ? "bg-amber-100 text-amber-600"
                          : ""
                      } ${
                        stat.trend === "completed"
                          ? "bg-blue-100 text-blue-600"
                          : ""
                      }`}
                    >
                      {stat.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Activity */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClockIcon className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Administrative events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm rounded-lg bg-gray-50 p-3">
                <div className="flex justify-between">
                  <span>Added new assessment module</span>
                  <span className="text-gray-500">Yesterday</span>
                </div>
              </div>
              <div className="text-sm rounded-lg bg-gray-50 p-3">
                <div className="flex justify-between">
                  <span>Updated user permissions for recruiter role</span>
                  <span className="text-gray-500">3 days ago</span>
                </div>
              </div>
              {/* <div className="text-sm rounded-lg bg-gray-50 p-3">
                <div className="flex justify-between">
                  <span>System backup completed</span>
                  <span className="text-gray-500">1 week ago</span>
                </div>
              </div> */}
            </div>
          </CardContent>
          <CardFooter>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button variant="outline" onClick={() => navigate("/module-editor")}>
                Module Editor
              </Button>
              <Button variant="outline" onClick={() => navigate("/system-settings")}>
                System Settings
              </Button>
            </div>
          </CardFooter>
        </Card>
      </>
    );
  };

  // Personal Info Card (shared by all roles)
  const renderPersonalInfo = () => (
    <Card className="md:col-span-2 mb-6">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Manage your personal details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <>
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                rows={2}
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              />
            </div> 
          </>
        ) : (
          <>
            {/* Full Name */}
            <div className="flex items-center border-b pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <UserIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-lg font-semibold">{profile.full_name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center border-b pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Mail className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold">{profile.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center border-b pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Phone className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-lg font-semibold">
                  {profile.phone || "N/A"}
                </p>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex items-center border-b pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Date of Birth
                </p>
                <p className="text-lg font-semibold">
                  {profile.date_of_birth
                    ? format(new Date(profile.date_of_birth), "MMM d, yyyy")
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center border-b pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <MapPin className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-lg font-semibold">
                  {profile.location || "N/A"}
                </p>
              </div>
            </div>

            {/* Education */}
            <div className="flex items-start pt-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Education</p>
                <p className="text-lg font-semibold">
                  {profile.education || "N/A"}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {isEditing ? (
          <div className="flex space-x-2">
            <Button onClick={handleSaveProfile}>Save Changes</Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                // reset to original
                setFullName(profile.full_name || "");
                setEmail(profile.email || "");
                setPhone(profile.phone || "");
                setDob(
                  profile.date_of_birth
                    ? format(new Date(profile.date_of_birth), "yyyy-MM-dd")
                    : ""
                );
                setLocation(profile.location || "");
                setEducation(profile.education || "");
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">My Profile</h1>
          <p className="text-white">View and manage your information</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Personal Info always spans 2 columns on md+ */}
          <div className="md:col-span-2">{renderPersonalInfo()}</div>

          {/* Sidebar with avatar and join-date summary */}
          <Card className="hidden md:block">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profile.avatarUrl || "/placeholder.svg"}
                    alt={profile.full_name}
                  />
                  <AvatarFallback className="text-3xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{profile.full_name}</CardTitle>
              <CardDescription className="capitalize">
                {profile.role}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.role === "candidate" && (
                  <>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">
                        Age: {getAge() && ` ${getAge()} years old`}
                      </span>
                    </div>
                  </>
                )}

                {profile.role === "recruiter" && (
                  <>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">7 Candidates Managed</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">3 Hires Completed</span>
                    </div>
                  </>
                )}

                {profile.role === "admin" && (
                  <>
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">System Administrator</span>
                    </div>
                    <div className="flex items-center">
                      <Key className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">Full Access</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Role-specific section spans full width on md+ */}
          <div className="md:col-span-3">
            {profile.role === "candidate"
              ? renderCandidateProfile()
              : profile.role === "recruiter"
              ? renderRecruiterProfile()
              : renderAdminProfile()}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;