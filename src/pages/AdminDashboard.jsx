import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, FileText, Clock, Activity, BarChart3 } from 'lucide-react';
import api from '@/lib/api'; // your axios instance
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

export default function AdminDashboard() {
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalModules, setTotalModules]       = useState(0);
  const [completedAssessments, setCompleted]  = useState(0);
  const [avgRate, setAvgRate]                 = useState({ completed: 0, inProgress: 0, completionRate: 0 });
  const [modules, setModules]                 = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          candRes,
          modCountRes,
          compCountRes,
          avgRateRes,
          modulesRes
        ] = await Promise.all([
          api.get('/api/auth/usersAll'),
          api.get('/api/modules/total-modules'),
          api.get('/api/moduleResult/dashboard/completed'),
          api.get('/api/moduleResult/dashboard/completion-rate'),
          api.get('/api/modules')
        ]);

        setTotalCandidates(candRes.data.totalUsers);
        setTotalModules(modCountRes.data.totalModules);
        setCompleted(compCountRes.data.completedCount);
        setAvgRate({
          completed: avgRateRes.data.completed,
          inProgress: avgRateRes.data.inProgress,
          completionRate: parseFloat(avgRateRes.data.completionRate)
        });
        setModules(modulesRes.data.modules);
      } catch (err) {
        console.error('Error loading admin dashboard data', err);
      }
    }
    fetchData();
  }, []);

  return (
    <PageLayout>
      <div className="container py-10 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{totalCandidates}</p>
              <Users className="h-6 w-6 text-gray-500" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Total Modules</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{totalModules}</p>
              <FileText className="h-6 w-6 text-gray-500" />
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader><CardTitle>Assessments Completed</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{completedAssessments}</p>
              <Clock className="h-6 w-6 text-gray-500" />
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader><CardTitle>Avg. Completion Rate</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{avgRate.completionRate}%</p>
              <Activity className="h-6 w-6 text-gray-500" />
            </CardContent>
          </Card>
        </div>

        {/* Modules Table */}
        <Card>
          <CardHeader><CardTitle>Assessment Modules</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Max Score</TableHead>
                  {/* <TableHead>Created At</TableHead> */}
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map(mod => (
                  <TableRow key={mod._id}>
                    <TableCell>{mod.name}</TableCell>
                    <TableCell>{mod.max_score || '—'}</TableCell>
                    {/* <TableCell>{new Date(mod.createdAt).toLocaleDateString()}</TableCell> */}
                    <TableCell>
                      {mod.webgl_url
                        ? <span className="text-green-600">Active</span>
                        : <span className="text-red-600">Missing WebGL</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}




// import React, { useState } from 'react';
// import PageLayout from '@/components/layout/PageLayout';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import {
//   Users,
//   UserPlus,
//   FileText,
//   Settings,
//   Plus,
//   Trash2,
//   Edit,
//   EyeOff,
//   User,
//   Clock,
//   UserCheck,
//   ShieldCheck,
//   Mail,
//   Lock,
//   Save,
// } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from '@/components/ui/tabs';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useAuth } from '@/contexts/AuthContext';
// import { toast } from '@/hooks/use-toast';
// import { Link } from 'react-router-dom';

// // Mock data for users
// const initialUsers = [
//   {
//     id: 1,
//     name: 'Alex Johnson',
//     email: 'alex@example.com',
//     role: 'candidate',
//     status: 'active',
//     joined: '2025-03-15',
//   },
//   {
//     id: 2,
//     name: 'Sam Wilson',
//     email: 'sam@example.com',
//     role: 'candidate',
//     status: 'active',
//     joined: '2025-03-18',
//   },
//   {
//     id: 3,
//     name: 'Jamie Smith',
//     email: 'jamie@example.com',
//     role: 'candidate',
//     status: 'inactive',
//     joined: '2025-03-10',
//   },
//   {
//     id: 4,
//     name: 'Jordan Lee',
//     email: 'jordan@example.com',
//     role: 'recruiter',
//     status: 'active',
//     joined: '2025-02-28',
//   },
//   {
//     id: 5,
//     name: 'Taylor Brown',
//     email: 'taylor@example.com',
//     role: 'admin',
//     status: 'active',
//     joined: '2025-01-15',
//   },
// ];

// // Mock data for modules
// const modules = [
//   {
//     id: 1,
//     name: 'MBTI Assessment',
//     type: 'personality',
//     questions: 20,
//     status: 'active',
//     updated: '2025-03-22',
//   },
//   {
//     id: 2,
//     name: 'Big Five Traits',
//     type: 'personality',
//     questions: 25,
//     status: 'active',
//     updated: '2025-03-25',
//   },
//   {
//     id: 3,
//     name: 'Leadership Style',
//     type: 'aptitude',
//     questions: 15,
//     status: 'active',
//     updated: '2025-03-10',
//   },
//   {
//     id: 4,
//     name: 'Team Collaboration',
//     type: 'behavioral',
//     questions: 18,
//     status: 'draft',
//     updated: '2025-04-01',
//   },
// ];

// // Mock data for summary stats
// const summaryStats = [
//   {
//     title: 'Total Users',
//     value: 48,
//     icon: Users,
//     color: 'bg-admin-accent text-admin-primary',
//   },
//   {
//     title: 'Active Modules',
//     value: 2,
//     icon: FileText,
//     color: 'bg-emerald-100 text-emerald-600',
//   },
//   {
//     title: 'Assessments Completed',
//     value: 4,
//     icon: Clock,
//     color: 'bg-amber-100 text-amber-600',
//   },
//   {
//     title: 'System Health',
//     value: '98%',
//     icon: ShieldCheck,
//     color: 'bg-violet-100 text-violet-600',
//   },
// ];

// const AdminDashboard = () => {
//   const [users, setUsers] = useState(initialUsers);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [deleteItemId, setDeleteItemId] = useState(null);
//   const [deleteItemType, setDeleteItemType] = useState('user');
//   const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
//   const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [newUser, setNewUser] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'candidate',
//   });

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const openDeleteDialog = (id, type) => {
//     setDeleteItemId(id);
//     setDeleteItemType(type);
//     setDeleteDialogOpen(true);
//   };

//   const handleDelete = () => {
//     if (deleteItemType === 'user') {
//       setUsers(users.filter(user => user.id !== deleteItemId));
//       toast({
//         title: 'User Deleted',
//         description: 'The user has been deleted successfully.',
//       });
//     }

//     setDeleteDialogOpen(false);
//   };

//   const openEditUserDialog = (user) => {
//     setCurrentUser(user);
//     setEditUserDialogOpen(true);
//   };

//   const handleEditUser = () => {
//     if (currentUser) {
//       const updatedUsers = users.map(user =>
//         user.id === currentUser.id ? currentUser : user
//       );
//       setUsers(updatedUsers);
//       setEditUserDialogOpen(false);

//       toast({
//         title: 'User Updated',
//         description: `${currentUser.name}'s details have been updated.`,
//       });
//     }
//   };

//   const handleAddUser = () => {
//     const id = Math.max(...users.map(user => user.id)) + 1;
//     const now = new Date();
//     const formattedDate = now.toISOString().split('T')[0];

//     const user = {
//       id,
//       name: newUser.name,
//       email: newUser.email,
//       role: newUser.role,
//       status: 'active',
//       joined: formattedDate,
//     };

//     setUsers([...users, user]);
//     setAddUserDialogOpen(false);
//     setNewUser({
//       name: '',
//       email: '',
//       password: '',
//       role: 'candidate',
//     });

//     toast({
//       title: 'User Added',
//       description: `${user.name} has been added successfully.`,
//     });
//   };

//   const toggleUserStatus = (userId) => {
//     const updatedUsers = users.map(user => {
//       if (user.id === userId) {
//         const newStatus = user.status === 'active' ? 'inactive' : 'active';
//         return { ...user, status: newStatus };
//       }
//       return user;
//     });

//     setUsers(updatedUsers);

//     const user = users.find(u => u.id === userId);
//     const newStatus = user?.status === 'active' ? 'deactivated' : 'activated';

//     toast({
//       title: `User ${newStatus}`,
//       description: `${user?.name} has been ${newStatus}.`,
//     });
//   };

//   const getRoleBadge = (role) => {
//     switch (role) {
//       case 'admin':
//         return <Badge className="bg-admin-accent text-admin-primary">Admin</Badge>;
//       case 'recruiter':
//         return <Badge className="bg-recruiter-accent text-recruiter-primary">Recruiter</Badge>;
//       case 'candidate':
//         return <Badge className="bg-candidate-accent text-candidate-primary">Candidate</Badge>;
//       default:
//         return <Badge className="bg-gray-100 text-gray-600">Unknown</Badge>;
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'active':
//         return <Badge className="bg-emerald-100 text-emerald-600">Active</Badge>;
//       case 'inactive':
//         return <Badge className="bg-gray-100 text-gray-600">Inactive</Badge>;
//       case 'draft':
//         return <Badge className="bg-amber-100 text-amber-600">Draft</Badge>;
//       default:
//         return <Badge className="bg-gray-100 text-gray-600">Unknown</Badge>;
//     }
//   };

//   const filteredUsers = users.filter(
//     (user) =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.role.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <PageLayout>
//       <div className="container py-10">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
//           <p className="text-gray-500">
//             Manage users, assessment modules, and system settings
//           </p>
//         </div>

//         {/* Summary Statistics */}
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
//           {summaryStats.map((stat, index) => (
//             <Card key={index}>
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">{stat.title}</p>
//                     <div className="flex items-baseline mt-1">
//                       <p className="text-2xl font-bold">{stat.value}</p>
//                       {stat.change && (
//                         <p className="ml-2 text-xs font-medium text-emerald-500">{stat.change}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div className={`rounded-lg p-2 ${stat.color}`}>
//                     <stat.icon className="h-5 w-5" />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
        
//         {/* Tabs for Users and Modules */}
//         <Tabs defaultValue="users" className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <TabsList>
//               <TabsTrigger value="users">Users</TabsTrigger>
//               <TabsTrigger value="modules">Assessment Modules</TabsTrigger>
//             </TabsList>
//             <div className="flex items-center gap-2">
//               <Input
//                 type="text"
//                 placeholder="Search..."
//                 className="w-[200px]"
//                 value={searchTerm}
//                 onChange={handleSearch}
//               />
//               {/* Show the correct add button based on active tab */}
//               <TabsContent value="users" className="mt-0 inline-block">
//                 <Button onClick={() => setAddUserDialogOpen(true)}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   <span>Add User</span>
//                 </Button>
//               </TabsContent>
//               <TabsContent value="modules" className="mt-0 inline-block">
//                 <Button asChild>
//                   <Link to="/module-editor">
//                     <Plus className="h-4 w-4 mr-2" />
//                     <span>Manage Modules</span>
//                   </Link>
//                 </Button>
//               </TabsContent>
//             </div>
//           </div>
          
//           {/* Users Table */}
//           <TabsContent value="users">
//             <Card>
//               <CardContent className="p-6">
//                 <div className="overflow-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>User</TableHead>
//                         <TableHead>Role</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Joined Date</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filteredUsers.length === 0 ? (
//                         <TableRow>
//                           <TableCell colSpan={5} className="text-center py-6 text-gray-500">
//                             No users found. Try a different search or add a new user.
//                           </TableCell>
//                         </TableRow>
//                       ) : (
//                         filteredUsers.map((user) => (
//                           <TableRow key={user.id}>
//                             <TableCell>
//                               <div className="flex items-center gap-3">
//                                 <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
//                                   <User className="h-4 w-4 text-gray-600" />
//                                 </div>
//                                 <div>
//                                   <p className="font-medium">{user.name}</p>
//                                   <p className="text-xs text-gray-500">{user.email}</p>
//                                 </div>
//                               </div>
//                             </TableCell>
//                             <TableCell>{getRoleBadge(user.role)}</TableCell>
//                             <TableCell>{getStatusBadge(user.status)}</TableCell>
//                             <TableCell>{user.joined}</TableCell>
//                             <TableCell className="text-right">
//                               <div className="flex justify-end gap-2">
//                                 <Button 
//                                   variant="ghost" 
//                                   size="icon" 
//                                   onClick={() => openEditUserDialog(user)}
//                                 >
//                                   <Edit className="h-4 w-4" />
//                                   <span className="sr-only">Edit</span>
//                                 </Button>
//                                 {user.status === 'active' ? (
//                                   <Button 
//                                     variant="ghost" 
//                                     size="icon" 
//                                     onClick={() => toggleUserStatus(user.id)}
//                                   >
//                                     <EyeOff className="h-4 w-4" />
//                                     <span className="sr-only">Deactivate</span>
//                                   </Button>
//                                 ) : (
//                                   <Button 
//                                     variant="ghost" 
//                                     size="icon" 
//                                     onClick={() => toggleUserStatus(user.id)}
//                                   >
//                                     <UserCheck className="h-4 w-4" />
//                                     <span className="sr-only">Activate</span>
//                                   </Button>
//                                 )}
//                                 <Button 
//                                   variant="ghost" 
//                                   size="icon"
//                                   onClick={() => openDeleteDialog(user.id, 'user')}
//                                 >
//                                   <Trash2 className="h-4 w-4 text-red-500" />
//                                   <span className="sr-only">Delete</span>
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
          
//           {/* Modules Table */}
//           <TabsContent value="modules">
//             <Card>
//               <CardContent className="p-6">
//                 <div className="overflow-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Module Name</TableHead>
//                         <TableHead>Type</TableHead>
//                         <TableHead>Questions</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Last Updated</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {modules
//                         .filter((module) =>
//                           module.name.toLowerCase().includes(searchTerm.toLowerCase())
//                         )
//                         .map((module) => (
//                           <TableRow key={module.id}>
//                             <TableCell>
//                               <div className="font-medium">{module.name}</div>
//                             </TableCell>
//                             <TableCell>
//                               <div className="capitalize">{module.type}</div>
//                             </TableCell>
//                             <TableCell>{module.questions}</TableCell>
//                             <TableCell>{getStatusBadge(module.status)}</TableCell>
//                             <TableCell>{module.updated}</TableCell>
//                             <TableCell className="text-right">
//                               <div className="flex justify-end gap-2">
//                                 <Button variant="ghost" size="icon" asChild>
//                                   <Link to="/module-editor">
//                                     <Edit className="h-4 w-4" />
//                                     <span className="sr-only">Edit</span>
//                                   </Link>
//                                 </Button>
//                                 <Button 
//                                   variant="ghost" 
//                                   size="icon"
//                                   onClick={() => openDeleteDialog(module.id, 'module')}
//                                 >
//                                   <Trash2 className="h-4 w-4 text-red-500" />
//                                   <span className="sr-only">Delete</span>
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
        
//         {/* Quick Actions */}
//         <div className="grid gap-6 md:grid-cols-3">
//           <Card className="game-card admin-card">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold">User Management</h3>
//                 <div className="h-10 w-10 rounded-lg bg-admin-accent flex items-center justify-center">
//                   <UserPlus className="h-5 w-5 text-admin-primary" />
//                 </div>
//               </div>
//               <p className="text-gray-600 mb-6 text-sm">
//                 Add, edit, or remove users from the platform. Manage permissions and roles.
//               </p>
//               <Button className="w-full" onClick={() => setAddUserDialogOpen(true)}>
//                 Manage Users
//               </Button>
//             </CardContent>
//           </Card>
          
//           <Card className="game-card admin-card">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold">Module Editor</h3>
//                 <div className="h-10 w-10 rounded-lg bg-admin-accent flex items-center justify-center">
//                   <FileText className="h-5 w-5 text-admin-primary" />
//                 </div>
//               </div>
//               <p className="text-gray-600 mb-6 text-sm">
//                 Create and customize assessment modules. Edit questions, scoring, and parameters.
//               </p>
//               <Button className="w-full" asChild>
//                 <Link to="/module-editor">Edit Modules</Link>
//               </Button>
//             </CardContent>
//           </Card>
          
//           <Card className="game-card admin-card">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold">System Settings</h3>
//                 <div className="h-10 w-10 rounded-lg bg-admin-accent flex items-center justify-center">
//                   <Settings className="h-5 w-5 text-admin-primary" />
//                 </div>
//               </div>
//               <p className="text-gray-600 mb-6 text-sm">
//                 Configure system settings, API integrations, and global preferences.
//               </p>
//               <Button className="w-full" asChild>
//                 <Link to="/system-settings">Settings</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
        
//         {/* Add User Dialog */}
//         <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
//           <DialogContent className="max-w-md">
//             <DialogHeader>
//               <DialogTitle>Add New User</DialogTitle>
//               <DialogDescription>
//                 Create a new user account. Fill in the user details below.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input 
//                   id="name" 
//                   value={newUser.name}
//                   onChange={(e) => setNewUser({...newUser, name: e.target.value})}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input 
//                   id="email" 
//                   type="email"
//                   value={newUser.email}
//                   onChange={(e) => setNewUser({...newUser, email: e.target.value})}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input 
//                   id="password" 
//                   type="password"
//                   value={newUser.password}
//                   onChange={(e) => setNewUser({...newUser, password: e.target.value})}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="role">Role</Label>
//                 <Select 
//                   value={newUser.role} 
//                   onValueChange={(value) => setNewUser({...newUser, role: value})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="candidate">Candidate</SelectItem>
//                     <SelectItem value="recruiter">Recruiter</SelectItem>
//                     <SelectItem value="admin">Admin</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddUser}>
//                 <UserPlus className="h-4 w-4 mr-2" />
//                 Add User
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
        
//         {/* Edit User Dialog */}
//         <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
//           <DialogContent className="max-w-md">
//             <DialogHeader>
//               <DialogTitle>Edit User</DialogTitle>
//               <DialogDescription>
//                 Update user information and role.
//               </DialogDescription>
//             </DialogHeader>
//             {currentUser && (
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="edit-name">Full Name</Label>
//                   <Input 
//                     id="edit-name" 
//                     value={currentUser.name}
//                     onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="edit-email">Email</Label>
//                   <Input 
//                     id="edit-email" 
//                     type="email"
//                     value={currentUser.email}
//                     onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="edit-role">Role</Label>
//                   <Select 
//                     value={currentUser.role} 
//                     onValueChange={(value) => setCurrentUser({...currentUser, role: value})}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select role" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="candidate">Candidate</SelectItem>
//                       <SelectItem value="recruiter">Recruiter</SelectItem>
//                       <SelectItem value="admin">Admin</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="edit-status">Status</Label>
//                   <Select 
//                     value={currentUser.status} 
//                     onValueChange={(value) => setCurrentUser({...currentUser, status: value})}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="active">Active</SelectItem>
//                       <SelectItem value="inactive">Inactive</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             )}
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleEditUser}>
//                 <Save className="h-4 w-4 mr-2" />
//                 Save Changes
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
        
//         {/* Delete Confirmation Dialog */}
//         <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Confirm Deletion</DialogTitle>
//               <DialogDescription>
//                 Are you sure you want to delete this {deleteItemType}? This action cannot be undone.
//               </DialogDescription>
//             </DialogHeader>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button variant="destructive" onClick={handleDelete}>
//                 Delete
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </PageLayout>
//   );
// };

// export default AdminDashboard;