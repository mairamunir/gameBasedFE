import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  UserRound, 
  Mail, 
  Briefcase, 
  Clock, 
  Award, 
  Calendar, 
  GraduationCap, 
  Building, 
  FileText,
  Medal,
  BarChart,
  Brain,
  BookOpen,
  Phone,
  MapPin,
  Users,
  CheckCircle,
  Server,
  ShieldCheck,
  Key
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

// Mock education data for candidate profile
const candidateEducation = [
  {
    id: 1,
    degree: "Bachelor of Science",
    major: "Computer Science",
    institution: "Stanford University",
    year: "2018 - 2022",
  },
  {
    id: 2,
    degree: "Master of Science",
    major: "Artificial Intelligence",
    institution: "MIT",
    year: "2022 - 2024",
  }
];

// Mock assessment results for candidate profile
// const candidateAssessments = [
//   {
//     id: 1,
//     name: "MBTI Assessment",
//     result: "INTJ",
//     completedDate: "2025-03-20",
//     score: 92,
//   },
//   {
//     id: 2,
//     name: "Big Five Traits",
//     result: "High Openness, High Conscientiousness",
//     completedDate: "2025-03-22",
//     score: 88,
//   }
// ];

// Mock recruiter department data
const recruiterDepartments = [
  {
    id: 1,
    name: "Engineering",
    openPositions: 3,
    activeCandidates: 12,
  },
  {
    id: 2,
    name: "Product Design",
    openPositions: 2,
    activeCandidates: 8,
  }
];

// Mock admin system data
const adminSystemStats = [
  {
    id: 1,
    name: "System Uptime",
    value: "99.98%",
    trend: "stable",
  },
  {
    id: 2,
    name: "Last Security Audit",
    value: "2025-03-15",
    trend: "completed",
  },
  {
    id: 3,
    name: "Database Size",
    value: "2.8 GB",
    trend: "growing",
  }
];

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('Passionate professional with expertise in technology and innovation.');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [dob, setDob] = useState('1995-06-15');
  const [location, setLocation] = useState('San Francisco, CA');
  
  // Common profile data
  const profileData = {
    joinDate: 'March 15, 2025',
    assessmentsCompleted: 2,
    assessmentsInProgress: 1,
    totalTime: '45 minutes',
    badges: [
      {
        id: 1,
        name: 'First Assessment',
        description: 'Completed your first assessment',
        unlocked: true,
      },
      {
        id: 2,
        name: 'Quick Thinker',
        description: 'Completed an assessment in record time',
        unlocked: true,
      }
    ]
  };
  
  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });
  };
  
  const getInitials = () => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const getAge = () => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };
  
  // Render different profile based on user role
  const renderRoleSpecificProfile = () => {
    switch (user?.role) {
      case 'candidate':
        return renderCandidateProfile();
      case 'recruiter':
        return renderRecruiterProfile();
      case 'admin':
        return renderAdminProfile();
      default:
        return renderCandidateProfile();
    }
  };
  
  const renderCandidateProfile = () => {
    return (
      <>
        {/* Education Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {candidateEducation.map((edu) => (
                <div key={edu.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="font-medium">{edu.degree} in {edu.major}</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-sm text-gray-500">{edu.institution}</div>
                    <div className="text-sm">{edu.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          {isEditing && (
            <CardFooter>
              <Button variant="outline" size="sm">
                Add Education
              </Button>
            </CardFooter>
          )}
        </Card>
        
        {/* Assessment Results Section */}
        {/* <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {candidateAssessments.map((assessment) => (
                <div key={assessment.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{assessment.name}</div>
                    <Badge className="bg-emerald-100 text-emerald-600">{assessment.score}%</Badge>
                  </div>
                  <div className="mt-1 text-gray-700">{assessment.result}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Completed on {formatDate(assessment.completedDate)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent> */}
          {/* <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <a href="/assessments">View All Assessments</a>
            </Button>
          </CardFooter> 
        </Card>*/}
        
        {/* Badges Section */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Earned Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profileData.badges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center rounded-lg border p-4 text-center">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-candidate-accent text-candidate-primary`}>
                    <Medal className="h-6 w-6" />
                  </div>
                  <h4 className="mt-2 text-sm font-medium">{badge.name}</h4>
                  <p className="mt-1 text-xs text-gray-500">{badge.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </>
    );
  };
  
  const renderRecruiterProfile = () => {
    return (
      <>
        {/* Department Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Department Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recruiterDepartments.map((dept) => (
                <div key={dept.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="font-medium">{dept.name} Department</div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-gray-500">Open Positions</div>
                      <div className="text-xl font-semibold">{dept.openPositions}</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-gray-500">Active Candidates</div>
                      <div className="text-xl font-semibold">{dept.activeCandidates}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <a href="/candidates">View All Candidates</a>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Activity Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              Recruitment Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
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
              </div>
              
              <div className="mt-4">
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
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <a href="/analytics">View Analytics</a>
            </Button>
          </CardFooter>
        </Card>
      </>
    );
  };
  
  const renderAdminProfile = () => {
    return (
      <>
        {/* System Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminSystemStats.map((stat) => (
                <div key={stat.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="font-medium">{stat.name}</div>
                  <div className="flex items-center">
                    <span className="mr-2">{stat.value}</span>
                    <Badge className={`
                      ${stat.trend === 'stable' ? 'bg-emerald-100 text-emerald-600' : ''}
                      ${stat.trend === 'growing' ? 'bg-amber-100 text-amber-600' : ''}
                      ${stat.trend === 'completed' ? 'bg-blue-100 text-blue-600' : ''}
                    `}>
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
              <Clock className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
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
              <div className="text-sm rounded-lg bg-gray-50 p-3">
                <div className="flex justify-between">
                  <span>System backup completed</span>
                  <span className="text-gray-500">1 week ago</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button variant="outline" asChild>
                <a href="/module-editor">Module Editor</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/system-settings">System Settings</a>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </>
    );
  };
  
  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-gray-500">
            View and manage your personal information
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Personal Information Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center border-b pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <UserRound className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-lg font-semibold">{user?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center border-b pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <Mail className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-lg font-semibold">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center border-b pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <Phone className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-lg font-semibold">{phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center border-b pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                      <p className="text-lg font-semibold">{formatDate(dob)} ({getAge()} years)</p>
                    </div>
                  </div>
                  <div className="flex items-center border-b pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <MapPin className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-lg font-semibold">{location}</p>
                    </div>
                  </div>
                  <div className="flex items-start pt-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Bio</p>
                      <p className="text-base">{bio}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {isEditing ? (
                <div className="flex space-x-2">
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </CardFooter>
          </Card>
          
          {/* User Summary Card */}
          <Card className="hidden md:block">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" alt={user?.name} />
                  <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{user?.name}</CardTitle>
              <CardDescription className="capitalize">{user?.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">Member since {profileData.joinDate}</span>
                </div>
                {user?.role === 'candidate' && (
                  <>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{profileData.badges.filter(b => b.unlocked).length} Badges Earned</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">Total Time: {profileData.totalTime}</span>
                    </div>
                  </>
                )}
                {user?.role === 'recruiter' && (
                  <>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">20 Candidates Managed</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">5 Hires Completed</span>
                    </div>
                  </>
                )}
                {user?.role === 'admin' && (
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
          
          {/* Role-specific information */}
          <div className="md:col-span-3">
            {renderRoleSpecificProfile()}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;