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
    name: 'Jane Cooper',
    email: 'jane.cooper@example.com',
    position: 'Full Stack Developer',
    status: 'completed',
    assessmentDate: 'Apr 10, 2025',
    completionDate: 'Apr 11, 2025',
    score: 92,
    traits: [
      { name: 'Extraversion', score: 65 },
      { name: 'Conscientiousness', score: 82 },
      { name: 'Openness', score: 78 },
      { name: 'Agreeableness', score: 70 }
    ],
    skills: [
      { name: 'Problem Solving', score: 95 },
      { name: 'Communication', score: 88 },
      { name: 'Technical Skills', score: 90 },
      { name: 'Teamwork', score: 85 }
    ],
    timeSpent: '48 minutes'
  },
  {
    id: '2',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    position: 'UX Designer',
    status: 'in-progress',
    assessmentDate: 'Apr 12, 2025',
  },
  {
    id: '3',
    name: 'John Smith',
    email: 'john.smith@example.com',
    position: 'Product Manager',
    status: 'completed',
    assessmentDate: 'Apr 8, 2025',
    completionDate: 'Apr 9, 2025',
    score: 78,
    traits: [
      { name: 'Extraversion', score: 45 },
      { name: 'Conscientiousness', score: 90 },
      { name: 'Openness', score: 60 },
      { name: 'Agreeableness', score: 75 }
    ],
    skills: [
      { name: 'Problem Solving', score: 80 },
      { name: 'Communication', score: 75 },
      { name: 'Technical Skills', score: 70 },
      { name: 'Teamwork', score: 90 }
    ],
    timeSpent: '52 minutes'
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    position: 'Backend Developer',
    status: 'not-started',
    assessmentDate: 'Apr 15, 2025',
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
            <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
            <p className="text-gray-500">
              Manage and view assessment results for all candidates
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Candidate
            </Button>
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
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="not-started">Not Started</TabsTrigger>
              </TabsList>

              <div className="rounded-md border">
                <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                  <div className="col-span-2">Candidate</div>
                  <div>Position</div>
                  <div>Date</div>
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
