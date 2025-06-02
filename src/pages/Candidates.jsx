import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import PageLayout from '@/components/layout/PageLayout';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search } from 'lucide-react';
import CandidateDetails from '@/components/recruiter/CandidateDetails';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState('all');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await api.get('/api/auth/candidates');
        setCandidates(response.data.candidates || []);
      } catch (error) {
        console.error('Failed to fetch candidates:', error);
        setCandidates([]);
      }
    };

    fetchCandidates();
  }, []);

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '';
    return name.trim().split(/\s+/).map(word => word[0]?.toUpperCase() || '').join('');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'started': return 'bg-blue-100 text-blue-800';
      case 'not started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCandidates = candidates
    .filter(candidate =>
      candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(candidate => {
      if (tab === 'all') return true;
      return candidate.status?.toLowerCase() === tab.replace('-', ' ');
    });

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Candidates</h1>
            <p className="text-white">Manage and view assessment results for all candidates</p>
          </div>
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
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="not-started">Not Started</TabsTrigger>
                <TabsTrigger value="started">Started</TabsTrigger>
              </TabsList>

              <div className="rounded-md border">
                <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b">
                  <div className="col-span-3">Candidate</div>
                  <div>Status</div>
                </div>

                {filteredCandidates.length > 0 ? (
                  <div className="divide-y">
                    {filteredCandidates.map((candidate) => (
                      <div
                        key={candidate._id}
                        className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        <div className="col-span-3 flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt={candidate.full_name} />
                            <AvatarFallback>{getInitials(candidate.full_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{candidate.full_name}</div>
                            <div className="text-sm text-gray-500">{candidate.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge className={getStatusColor(candidate.status)}>
                            {candidate.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No candidates found matching your criteria.
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


// import React, { useState, useEffect } from 'react';
// import api from '@/lib/api';
// import PageLayout from '@/components/layout/PageLayout';
// import {
//   Card, CardContent, CardHeader, CardTitle
// } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Search } from 'lucide-react';
// import CandidateDetails from '@/components/recruiter/CandidateDetails';
// import {
//   Tabs,
//   TabsList,
//   TabsTrigger,
//   TabsContent
// } from '@/components/ui/tabs';
// const Candidates = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       try {
//         const response = await api.get('/api/auth/candidates');
//         setCandidates(response.data.candidates || []);
//       } catch (error) {
//         console.error('Failed to fetch candidates:', error);
//         setCandidates([]);
//       }
//     };

//     fetchCandidates();
//   }, []);

//   const filteredCandidates = candidates.filter(candidate =>
//     candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//  const getInitials = (name) => {
//   if (!name || typeof name !== 'string') return '';

//   return name
//     .trim()
//     .split(/\s+/) // split by one or more spaces
//     .map(word => word[0]?.toUpperCase() || '')
//     .join('');
// };


//   const getStatusColor = status => {
//     switch (status) {
//       case 'completed':    return 'bg-green-100 text-green-800';
//       case 'started':  return 'bg-blue-100 text-blue-800';
//       case 'not-started':  return 'bg-gray-100 text-gray-800';
//       default:             return 'bg-gray-100 text-gray-800';
//     }
//   };



//   return (
//     <PageLayout>
//       <div className="container py-10">
//         <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight text-white">Candidates</h1>
//             <p className="text-white">
//               Manage and view assessment results for all candidates
//             </p>
//           </div>
          
//         </div>

//         <Card>
//           <CardHeader>
//             <div className="flex flex-col sm:flex-row gap-4 justify-between">
//               <div className="relative max-w-md">
//                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
//                 <Input
//                   placeholder="Search candidates..."
//                   className="pl-8"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//               {/* <Button variant="outline">
//                 <Filter className="mr-2 h-4 w-4" />
//                 Filter
//               </Button> */}
//             </div>
//           </CardHeader>
//           <CardContent>
//             <Tabs defaultValue="all">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="all">All</TabsTrigger>
//                 <TabsTrigger value="completed">Completed</TabsTrigger>
//                 <TabsTrigger value="not-started">Not Started</TabsTrigger>
//                 <TabsTrigger value="started">Started</TabsTrigger>
//               </TabsList>

//               <div className="rounded-md border">
//                 <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
//                   <div className="col-span-4">Candidate</div>
//                   {/* <div>Position</div> */}
//                   {/* <div>Date</div> */}
//                   <div>Status</div>
//                 </div>

//                 {filteredCandidates.length > 0 ? (
//                   <div className="divide-y">
//                     {filteredCandidates.map((candidate) => (
//                       <div
//                         key={candidate.id}
//                         className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-50 cursor-pointer"
//                         onClick={() => setSelectedCandidate(candidate)}
//                       >
//                         <div className="col-span-2 flex items-center gap-3">
//                           <Avatar className="h-8 w-8">
//                             <AvatarImage src="/placeholder.svg" alt={candidate.name} />
//                             <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <div className="font-medium">{candidate.name}</div>
//                             <div className="text-sm text-gray-500">{candidate.email}</div>
//                           </div>
//                         </div>
//                         <div className="flex items-center">{candidate.position}</div>
//                         <div className="flex items-center">{candidate.assessmentDate}</div>
//                         <div className="flex items-center">
//                           <Badge className={getStatusColor(candidate.status)}>
//                             {candidate.status === 'completed' && 'Completed'}
//                             {candidate.status === 'in-progress' && 'In Progress'}
//                             {candidate.status === 'not-started' && 'Not Started'}
//                           </Badge>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="p-4 text-center text-gray-500">
//                     No candidates found matching your search criteria.
//                   </div>
//                 )}
//               </div>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>

//       <Dialog open={!!selectedCandidate} onOpenChange={(open) => !open && setSelectedCandidate(null)}>
//         <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Candidate Details</DialogTitle>
//           </DialogHeader>
//           {selectedCandidate && <CandidateDetails candidate={selectedCandidate} />}
//         </DialogContent>
//       </Dialog>
//     </PageLayout>
//   );
// };

// export default Candidates;