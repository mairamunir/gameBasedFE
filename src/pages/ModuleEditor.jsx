// src/pages/ModuleEditor.jsx
import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, EyeClosed} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api"; // Axios instance with baseURL configured (see bottom)

const ModuleEditor = () => {
  // State hooks
  const [modules, setModules] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);

  // Template for new module form
  const [newModule, setNewModule] = useState({
    name: "",
    type: "personality",
    description: "",
    questions: 0,
    timeLimit: 0,
    status: "draft",
    webgl_url: "",
  });

  // 1) Fetch all modules when component mounts (Read) :contentReference[oaicite:3]{index=3}
  useEffect(() => {
    const loadModules = async () => {
      try {
        const response = await api.get("/api/modules");
        // Backend returns { modules: [ ... ] }
        setModules(response.data.modules);
      } catch (error) {
        console.error("Error fetching modules:", error);
        toast({
          title: "Error",
          description: "Could not load modules.",
          variant: "destructive",
        });
      }
    };
    loadModules();
  }, []);

  // 2) Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 3) Filter modules by name, type, description
  const filteredModules = modules.filter((module) =>
    [module.name, module.type, module.description]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // 4) Open dialogs
  const openEditDialog = (module) => {
    setCurrentModule({ ...module });
    setIsEditDialogOpen(true);
  };
  const openDeleteDialog = (module) => {
    setCurrentModule(module);
    setIsDeleteDialogOpen(true);
  };

  // 5) Add new module (Create) :contentReference[oaicite:4]{index=4}
  const handleAddModule = async () => {
    try {
      const payload = {
        name: newModule.name,
        type: newModule.type,
        description: newModule.description,
        questions: newModule.questions,
        timeLimit: newModule.timeLimit,
        status: newModule.status,
        webgl_url: newModule.webgl_url,
      };
      const response = await api.post("/api/modules", payload);
      // response.data.module contains the newly created module
      setModules((prev) => [...prev, response.data.module]);
      setIsAddDialogOpen(false);
      setNewModule({
        name: "",
        type: "personality",
        description: "",
        questions: 0,
        timeLimit: 0,
        status: "draft",
        webgl_url: "",
      });
      toast({
        title: "Module Added",
        description: `${response.data.module.name} has been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding module:", error);
      toast({
        title: "Error",
        description: "Failed to add module.",
        variant: "destructive",
      });
    }
  };

  // 6) Update existing module (Update) :contentReference[oaicite:5]{index=5}
  const handleUpdateModule = async () => {
    if (!currentModule) return;
    try {
      const payload = {
        name: currentModule.name,
        type: currentModule.type,
        description: currentModule.description,
        questions: currentModule.questions,
        timeLimit: currentModule.timeLimit,
        status: currentModule.status,
        webgl_url: currentModule.webgl_url,
      };
      const response = await api.put(`/api/modules/${currentModule._id}`, payload);
      const updated = response.data.module;
      setModules((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );
      setIsEditDialogOpen(false);
      toast({
        title: "Module Updated",
        description: `${updated.name} has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating module:", error);
      toast({
        title: "Error",
        description: "Could not update module.",
        variant: "destructive",
      });
    }
  };

  // 7) Delete module (Delete) :contentReference[oaicite:6]{index=6}
  const handleDelete = async () => {
    if (!currentModule) return;
    try {
      await api.delete(`/api/modules/${currentModule._id}`);
      setModules((prev) => prev.filter((m) => m._id !== currentModule._id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Module Deleted",
        description: `${currentModule.name} has been deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting module:", error);
      toast({
        title: "Error",
        description: "Could not delete module.",
        variant: "destructive",
      });
    }
  };

  // 8) Change status only (Patch)
  const handleStatusChange = async (moduleId, newStatus) => {
    try {
      const response = await api.patch(`/api/modules/${moduleId}/status`, {
        status: newStatus,
      });
      const updated = response.data.module;
      setModules((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );
      toast({
        title: "Status Changed",
        description: `${updated.name} is now ${updated.status}.`,
      });
    } catch (error) {
      console.error("Error changing status:", error);
      toast({
        title: "Error",
        description: "Could not change status.",
        variant: "destructive",
      });
    }
  };

  // 9) Helper to render status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-600">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-600">Inactive</Badge>;
      case "draft":
        return <Badge className="bg-amber-100 text-amber-600">Draft</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-600">Unknown</Badge>;
    }
  };

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Module Editor
            </h1>
            <p className="text-white">
              Create, edit, and manage assessment modules
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Module
          </Button>
        </div>

        {/* Search + Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Assessment Modules</CardTitle>
              <Input
                type="text"
                placeholder="Search modules..."
                className="w-[250px]"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Module Name</TableHead>
                  <TableHead className="text-center">Type</TableHead>
                  {/* <TableHead className="text-center">Questions</TableHead> */}
                  <TableHead className="text-center">Avg Time</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Last Updated</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModules.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-gray-500"
                    >
                      No modules found. Try a different search or add a new
                      module.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredModules.map((module) => (
                    <TableRow key={module._id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{module.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {module.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize text-center">
                        {module.type}
                      </TableCell>
                      {/* <TableCell className="text-center">{module.questions}</TableCell> */}
                      <TableCell className="text-center">{module.average_time} min</TableCell>
                      <TableCell className="text-center">{getStatusBadge(module.status)}</TableCell>
                      <TableCell className="text-center"> 
                        {new Date(module.updated).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Toggle Active/Inactive */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleStatusChange(
                                module._id,
                                module.status === "active"
                                  ? "inactive"
                                  : "active"
                              )
                            }
                          >
                            {module.status === "active" ? (
                              <>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Deactivate</span>
                              </>
                            ) : (
                              <>
                                <EyeClosed className="h-4 w-4" />
                                <span className="sr-only">Activate</span>
                              </>
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(module)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(module)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Module Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Module</DialogTitle>
              <DialogDescription>
                Create a new assessment module. Fill out the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Module Name</Label>
                <Input
                  id="name"
                  value={newModule.name}
                  onChange={(e) =>
                    setNewModule({ ...newModule, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newModule.type}
                  onValueChange={(value) =>
                    setNewModule({ ...newModule, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personality">Personality</SelectItem>
                    <SelectItem value="aptitude">Aptitude</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="cognitive">Cognitive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newModule.description}
                  onChange={(e) =>
                    setNewModule({ ...newModule, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <Label htmlFor="maxscore">Max Score</Label>
                  <Input
                    id="maxscore"
                    type="number"
                    min="5"
                    value={newModule.max_score || ""}
                    onChange={(e) =>
                      setNewModule({
                        ...newModule,
                        max_score: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div> 
                <div>
                  <Label htmlFor="timeLimit">Avg Time (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="1"
                    value={newModule.average_time || ""}
                    onChange={(e) =>
                      setNewModule({
                        ...newModule,
                        average_time: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newModule.status}
                  onValueChange={(value) =>
                    setNewModule({ ...newModule, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="webgl_url">WebGL URL</Label>
                <Input
                  id="webgl_url"
                  value={newModule.webgl_url}
                  onChange={(e) =>
                    setNewModule({ ...newModule, webgl_url: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddModule}>Add Module</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Module Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Module</DialogTitle>
              <DialogDescription>
                Update the details of this assessment module.
              </DialogDescription>
            </DialogHeader>
            {currentModule && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Module Name</Label>
                  <Input
                    id="edit-name"
                    value={currentModule.name}
                    onChange={(e) =>
                      setCurrentModule({
                        ...currentModule,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Type</Label>
                  <Select
                    value={currentModule.type}
                    onValueChange={(value) =>
                      setCurrentModule({ ...currentModule, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personality">Personality</SelectItem>
                      <SelectItem value="aptitude">Aptitude</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="cognitive">Cognitive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={currentModule.description}
                    onChange={(e) =>
                      setCurrentModule({
                        ...currentModule,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-maxscore">Max Score</Label>
                    <Input
                      id="edit-maxscore"
                      type="number"
                      min="5"
                      value={currentModule.max_score}
                      onChange={(e) =>
                        setCurrentModule({
                          ...currentModule,
                          max_score: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-timeLimit">Avg Time (minutes)</Label>
                    <Input
                      id="edit-timeLimit"
                      type="number"
                      min="1"
                      value={currentModule.average_time}
                      onChange={(e) =>
                        setCurrentModule({
                          ...currentModule,
                          timeLimit: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={currentModule.status}
                    onValueChange={(value) =>
                      setCurrentModule({ ...currentModule, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-webgl_url">WebGL URL</Label>
                  <Input
                    id="edit-webgl_url"
                    value={currentModule.webgl_url}
                    onChange={(e) =>
                      setCurrentModule({
                        ...currentModule,
                        webgl_url: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateModule}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the module "
                {currentModule?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Module
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default ModuleEditor;








// import React, { useState } from 'react';
// import PageLayout from '@/components/layout/PageLayout';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
// import { toast } from '@/hooks/use-toast';

// // Mock data for modules
// const initialModules = [
//   {
//     id: 1,
//     name: 'Leadership',
//     type: 'Aptitude',
//     //description: 'Myers-Briggs Type Indicator assessment to determine personality type.',
//     questions: 5,
//     timeLimit: 15,
//     status: 'active',
//     updated: '2025-03-22',
//   },
//   {
//     id: 2,
//     name: 'Emotional intelligence',
//     type: 'personality',
//     //description: 'Assessment of the five broad dimensions of personality.',
//     questions: 5,
//     timeLimit: 20,
//     status: 'active',
//     updated: '2025-03-25',
//   },
//   {
//     id: 3,
//     name: 'Teamwork',
//     type: 'behavioral',
//     //description: 'Evaluation of leadership qualities and style preferences.',
//     questions: 5,
//     timeLimit: 12,
//     status: 'active',
//     updated: '2025-03-10',
//   },
  
// ];

// const ModuleEditor = () => {
//   const [modules, setModules] = useState(initialModules);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [currentModule, setCurrentModule] = useState(null);
//   const [newModule, setNewModule] = useState({
//     name: '',
//     type: 'personality',
//     description: '',
//     questions: 0,
//     timeLimit: 0,
//     status: 'draft',
//   });

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const openEditDialog = (module) => {
//     setCurrentModule(module);
//     setIsEditDialogOpen(true);
//   };

//   const openDeleteDialog = (module) => {
//     setCurrentModule(module);
//     setIsDeleteDialogOpen(true);
//   };

//   const handleDelete = () => {
//     if (currentModule) {
//       setModules(modules.filter(m => m.id !== currentModule.id));
//       setIsDeleteDialogOpen(false);
//       toast({
//         title: 'Module Deleted',
//         description: `${currentModule.name} has been deleted.`,
//       });
//     }
//   };

//   const handleAddModule = () => {
//     const now = new Date();
//     const newId = Math.max(...modules.map(m => m.id)) + 1;
    
//     const moduleToAdd = {
//       id: newId,
//       ...newModule,
//       updated: now.toISOString().split('T')[0],
//     };
    
//     setModules([...modules, moduleToAdd]);
//     setIsAddDialogOpen(false);
//     setNewModule({
//       name: '',
//       type: 'personality',
//       description: '',
//       questions: 0,
//       timeLimit: 0,
//       status: 'draft',
//     });
    
//     toast({
//       title: 'Module Added',
//       description: `${moduleToAdd.name} has been added successfully.`,
//     });
//   };

//   const handleUpdateModule = () => {
//     if (currentModule) {
//       const now = new Date();
//       const updatedModules = modules.map(m => 
//         m.id === currentModule.id 
//           ? { ...currentModule, updated: now.toISOString().split('T')[0] } 
//           : m
//       );
      
//       setModules(updatedModules);
//       setIsEditDialogOpen(false);
      
//       toast({
//         title: 'Module Updated',
//         description: `${currentModule.name} has been updated successfully.`,
//       });
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

//   const filteredModules = modules.filter(module =>
//     module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     module.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     module.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <PageLayout>
//       <div className="container py-10">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight text-white">Module Editor</h1>
//             <p className="text-white">
//               Create, edit, and manage assessment modules
//             </p>
//           </div>
//           <Button onClick={() => setIsAddDialogOpen(true)}>
//             <Plus className="h-4 w-4 mr-2" />
//             Add New Module
//           </Button>
//         </div>

//         <Card>
//           <CardHeader className="pb-3">
//             <div className="flex items-center justify-between">
//               <CardTitle>Assessment Modules</CardTitle>
//               <Input
//                 type="text"
//                 placeholder="Search modules..."
//                 className="w-[250px]"
//                 value={searchTerm}
//                 onChange={handleSearch}
//               />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Module Name</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Questions</TableHead>
//                   <TableHead>Avg Time</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Last Updated</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredModules.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="text-center py-6 text-gray-500">
//                       No modules found. Try a different search or add a new module.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filteredModules.map((module) => (
//                     <TableRow key={module.id}>
//                       <TableCell className="font-medium">
//                         <div>
//                           <div>{module.name}</div>
//                           <div className="text-xs text-gray-500 mt-1">{module.description}</div>
//                         </div>
//                       </TableCell>
//                       <TableCell className="capitalize">{module.type}</TableCell>
//                       <TableCell>{module.questions}</TableCell>
//                       <TableCell>{module.timeLimit} min</TableCell>
//                       <TableCell>{getStatusBadge(module.status)}</TableCell>
//                       <TableCell>{module.updated}</TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button 
//                             variant="ghost" 
//                             size="icon"
//                             onClick={() => openEditDialog(module)}
//                           >
//                             <Edit className="h-4 w-4" />
//                             <span className="sr-only">Edit</span>
//                           </Button>
//                           <Button 
//                             variant="ghost" 
//                             size="icon"
//                             onClick={() => openDeleteDialog(module)}
//                           >
//                             <Trash2 className="h-4 w-4 text-red-500" />
//                             <span className="sr-only">Delete</span>
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         {/* Add Module Dialog */}
//         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//           <DialogContent className="max-w-md">
//             <DialogHeader>
//               <DialogTitle>Add New Module</DialogTitle>
//               <DialogDescription>
//                 Create a new assessment module. Fill out the details below.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="name">Module Name</Label>
//                 <Input 
//                   id="name" 
//                   value={newModule.name}
//                   onChange={(e) => setNewModule({...newModule, name: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="type">Type</Label>
//                 <Select 
//                   value={newModule.type}
//                   onValueChange={(value) => setNewModule({...newModule, type: value})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="personality">Personality</SelectItem>
//                     <SelectItem value="aptitude">Aptitude</SelectItem>
//                     <SelectItem value="behavioral">Behavioral</SelectItem>
//                     <SelectItem value="cognitive">Cognitive</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea 
//                   id="description" 
//                   value={newModule.description}
//                   onChange={(e) => setNewModule({...newModule, description: e.target.value})}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="questions">Questions</Label>
//                   <Input 
//                     id="questions" 
//                     type="number" 
//                     min="1"
//                     value={newModule.questions || ''}
//                     onChange={(e) => setNewModule({...newModule, questions: parseInt(e.target.value) || 0})}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
//                   <Input 
//                     id="timeLimit" 
//                     type="number" 
//                     min="1"
//                     value={newModule.timeLimit || ''}
//                     onChange={(e) => setNewModule({...newModule, timeLimit: parseInt(e.target.value) || 0})}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="status">Status</Label>
//                 <Select 
//                   value={newModule.status}
//                   onValueChange={(value) => setNewModule({...newModule, status: value})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="active">Active</SelectItem>
//                     <SelectItem value="inactive">Inactive</SelectItem>
//                     <SelectItem value="draft">Draft</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddModule}>Add Module</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Edit Module Dialog */}
//         <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//           <DialogContent className="max-w-md">
//             <DialogHeader>
//               <DialogTitle>Edit Module</DialogTitle>
//               <DialogDescription>
//                 Update the details of this assessment module.
//               </DialogDescription>
//             </DialogHeader>
//             {currentModule && (
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="edit-name">Module Name</Label>
//                   <Input 
//                     id="edit-name" 
//                     value={currentModule.name}
//                     onChange={(e) => setCurrentModule({...currentModule, name: e.target.value})}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="edit-type">Type</Label>
//                   <Select 
//                     value={currentModule.type}
//                     onValueChange={(value) => setCurrentModule({...currentModule, type: value})}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="personality">Personality</SelectItem>
//                       <SelectItem value="aptitude">Aptitude</SelectItem>
//                       <SelectItem value="behavioral">Behavioral</SelectItem>
//                       <SelectItem value="cognitive">Cognitive</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label htmlFor="edit-description">Description</Label>
//                   <Textarea 
//                     id="edit-description" 
//                     value={currentModule.description}
//                     onChange={(e) => setCurrentModule({...currentModule, description: e.target.value})}
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="edit-questions">Questions</Label>
//                     <Input 
//                       id="edit-questions" 
//                       type="number" 
//                       min="1"
//                       value={currentModule.questions}
//                       onChange={(e) => setCurrentModule({...currentModule, questions: parseInt(e.target.value) || 0})}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="edit-timeLimit">Time Limit (minutes)</Label>
//                     <Input 
//                       id="edit-timeLimit" 
//                       type="number" 
//                       min="1"
//                       value={currentModule.timeLimit}
//                       onChange={(e) => setCurrentModule({...currentModule, timeLimit: parseInt(e.target.value) || 0})}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="edit-status">Status</Label>
//                   <Select 
//                     value={currentModule.status}
//                     onValueChange={(value) => setCurrentModule({...currentModule, status: value})}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="active">Active</SelectItem>
//                       <SelectItem value="inactive">Inactive</SelectItem>
//                       <SelectItem value="draft">Draft</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             )}
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleUpdateModule}>Save Changes</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Delete Confirmation Dialog */}
//         <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Confirm Deletion</DialogTitle>
//               <DialogDescription>
//                 Are you sure you want to delete the module "{currentModule?.name}"? This action cannot be undone.
//               </DialogDescription>
//             </DialogHeader>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button variant="destructive" onClick={handleDelete}>
//                 Delete Module
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </PageLayout>
//   );
// };

// export default ModuleEditor;