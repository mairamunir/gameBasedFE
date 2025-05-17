// import React, { useEffect, useState } from 'react';
// import PageLayout from '@/components/layout/PageLayout';
// import {
//   Card, CardContent, CardHeader, CardTitle, CardDescription
// } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Badge } from '@/components/ui/badge';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Search, Filter, UserPlus } from 'lucide-react';
// import axios from 'axios';
// import CandidateDetails from '@/components/recruiter/CandidateDetails';

// const Candidates = () => {
//   const [candidates, setCandidates]         = useState([]);
//   const [filtered, setFiltered]             = useState([]);
//   const [searchQuery, setSearchQuery]       = useState('');
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [loading, setLoading]               = useState(true);

//   // 1️⃣ Fetch real candidate list
//   useEffect(() => {
//     axios.get('/api/auth/candidates')
//       .then(({ data }) => {
//         setCandidates(data.candidates || []);
//         setFiltered(data.candidates || []);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   // 2️⃣ Re‑filter whenever searchQuery changes
//   useEffect(() => {
//     const q = searchQuery.toLowerCase();
//     setFiltered(
//       candidates.filter(c =>
//         c.full_name.toLowerCase().includes(q) ||
//         c.email.toLowerCase().includes(q)
//       )
//     );
//   }, [searchQuery, candidates]);

//   const getStatusColor = status => {
//     switch (status) {
//       case 'completed':    return 'bg-green-100 text-green-800';
//       case 'in-progress':  return 'bg-blue-100 text-blue-800';
//       case 'not-started':  return 'bg-gray-100 text-gray-800';
//       default:             return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getInitials = name =>
//     name.split(' ').map(n => n[0]).join('').toUpperCase();

//   if (loading) {
//     return (
//       <PageLayout>
//         <div className="text-center py-20">Loading candidates…</div>
//       </PageLayout>
//     );
//   }

//   return (
//     <PageLayout>
//       <div className="container py-10">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
//             <p className="text-gray-500">
//               Manage and view assessment results for all candidates
//             </p>
//           </div>
//           <Button>
//             <UserPlus className="mr-2 h-4 w-4" />
//             Add Candidate
//           </Button>
//         </div>

//         <Card>
//           <CardHeader>
//             <div className="flex flex-col sm:flex-row gap-4 justify-between">
//               <div className="relative max-w-md">
//                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
//                 <Input
//                   placeholder="Search candidates…"
//                   className="pl-8"
//                   value={searchQuery}
//                   onChange={e => setSearchQuery(e.target.value)}
//                 />
//               </div>
//               <Button variant="outline">
//                 <Filter className="mr-2 h-4 w-4" />
//                 Filter
//               </Button>
//             </div>
//           </CardHeader>

//           <CardContent>
//             <Tabs defaultValue="all">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="all">All</TabsTrigger>
//                 <TabsTrigger value="completed">Completed</TabsTrigger>
//                 <TabsTrigger value="not-started">Not Started</TabsTrigger>
//               </TabsList>

//               {['all','completed','not-started'].map(statusKey => (
//                 <TabsContent key={statusKey} value={statusKey}>
//                   <div className="rounded-md border">
//                     <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
//                       <div className="col-span-2">Candidate</div>
//                       <div>Position</div>
//                       <div>Date</div>
//                       <div>Status</div>
//                     </div>

//                     <div className="divide-y">
//                       {filtered
//                         .filter(c =>
//                           statusKey === 'all' ? true : c.status === statusKey
//                         )
//                         .map(candidate => (
//                           <div
//                             key={candidate._id}
//                             className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-50 cursor-pointer"
//                             onClick={() => setSelectedCandidate(candidate)}
//                           >
//                             <div className="col-span-2 flex items-center gap-3">
//                               <Avatar className="h-8 w-8">
//                                 <AvatarImage src={candidate.avatarUrl} alt={candidate.full_name}/>
//                                 <AvatarFallback>
//                                   {getInitials(candidate.full_name)}
//                                 </AvatarFallback>
//                               </Avatar>
//                               <div>
//                                 <p className="font-medium">{candidate.full_name}</p>
//                                 <p className="text-sm text-gray-500">
//                                   {candidate.email}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="flex items-center">
//                               {candidate.position || '—'}
//                             </div>
//                             <div className="flex items-center">
//                               {new Date(candidate.assessmentDate).toLocaleDateString()}
//                             </div>
//                             <div className="flex items-center">
//                               <Badge className={getStatusColor(candidate.status)}>
//                                 {candidate.status === 'completed'    && 'Completed'}
//                                 {candidate.status === 'in-progress' && 'In Progress'}
//                                 {candidate.status === 'not-started' && 'Not Started'}
//                               </Badge>
//                             </div>
//                           </div>
//                         ))
//                       }
//                     </div>

//                     {filtered.filter(c =>
//                       statusKey === 'all' ? true : c.status === statusKey
//                     ).length === 0 && (
//                       <div className="p-4 text-center text-gray-500">
//                         No candidates in “{statusKey}” status.
//                       </div>
//                     )}
//                   </div>
//                 </TabsContent>
//               ))}
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>

//       <Dialog
//         open={!!selectedCandidate}
//         onOpenChange={open => {
//           if (!open) setSelectedCandidate(null);
//         }}
//       >
//         <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Candidate Details</DialogTitle>
//           </DialogHeader>
//           {selectedCandidate && (
//             <CandidateDetails candidate={selectedCandidate} />
//           )}
//         </DialogContent>
//       </Dialog>
//     </PageLayout>
//   );
// };

// export default Candidates;



import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, UserPlus } from 'lucide-react';
import CandidateDetails from '@/components/recruiter/CandidateDetails';

// Mock data for candidates
const mockCandidates = [
  {
    id: '1',
    name: 'zara',
    email: 'zara@gmail.com',
    //position: 'Full Stack Developer',
    status: 'completed',
    //assessmentDate: 'Apr 10, 2025',
    //completionDate: 'Apr 11, 2025',
    score: 92,
    traits: [
      { name: 'Leadership', score: 65 },
      { name: 'Emotional Intelligence', score: 82 },
      { name: 'Teamwork', score: 78 }
    ],
    timeSpent: '48 minutes'
  },
  {
    id: '2',
    name: 'maira',
    email: 'maira@gmail.com',
    //position: 'UX Designer',
    status: 'not-started',
    //assessmentDate: 'Apr 12, 2025',
  },
  {
    id: '3',
    name: 'hafsa',
    email: 'hafsa@gmail.com',
    //position: 'Product Manager',
    status: 'completed',
    //assessmentDate: 'Apr 8, 2025',
    //completionDate: 'Apr 9, 2025',
    score: 0,
    traits: [
      { name: 'Leadership', score: 45 },
      { name: 'Emotionl Intelligence', score: 90 },
      { name: 'Teamwork', score: 60 }
    ],
    timeSpent: '52 minutes'
  },
  {
    id: '4',
    name: 'demo',
    email: 'demo@gmail.com',
    //position: 'Backend Developer',
    status: 'completed',
    //assessmentDate: 'Apr 15, 2025',
    score: 0,
    traits: [
      { name: 'Leadership', score: 50 },
      { name: 'Emotionl Intelligence', score: 77 },
      { name: 'Teamwork', score: 40 }
    ],
    timeSpent: '38 minutes'
  },
];

const Candidates = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCandidates = mockCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Candidates</h1>
            <p className="text-white">
              Manage and view assessment results for all candidates
            </p>
          </div>
          {/* <div className="flex gap-2">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Candidate
            </Button>
          </div> */}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button> */}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="not-started">Not Started</TabsTrigger>
              </TabsList>

              <div className="rounded-md border">
                <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                  <div className="col-span-4">Candidate</div>
                  {/* <div>Position</div> */}
                  {/* <div>Date</div> */}
                  <div>Status</div>
                </div>

                {filteredCandidates.length > 0 ? (
                  <div className="divide-y">
                    {filteredCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        <div className="col-span-2 flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt={candidate.name} />
                            <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-sm text-gray-500">{candidate.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center">{candidate.position}</div>
                        <div className="flex items-center">{candidate.assessmentDate}</div>
                        <div className="flex items-center">
                          <Badge className={getStatusColor(candidate.status)}>
                            {candidate.status === 'completed' && 'Completed'}
                            {candidate.status === 'in-progress' && 'In Progress'}
                            {candidate.status === 'not-started' && 'Not Started'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No candidates found matching your search criteria.
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedCandidate} onOpenChange={(open) => !open && setSelectedCandidate(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Candidate Details</DialogTitle>
          </DialogHeader>
          {selectedCandidate && <CandidateDetails candidate={selectedCandidate} />}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Candidates;
