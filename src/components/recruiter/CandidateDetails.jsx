import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Download, FileCheck } from 'lucide-react';

const CandidateDetails = ({ candidate }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress':
      case 'started': return 'bg-blue-100 text-blue-800';
      case 'not-started':
      case 'not started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '';
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'Completed';
      case 'in-progress':
      case 'started': return 'In Progress';
      case 'not-started':
      case 'not started': return 'Not Started';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" alt={candidate.full_name} />
                <AvatarFallback>{getInitials(candidate.full_name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{candidate.full_name}</CardTitle>
                <CardDescription>{candidate.email}</CardDescription>
              </div>
            </div>
            <Badge className={getStatusColor(candidate.status)}>
              {getStatusText(candidate.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 py-2">
            {candidate.position && (
              <div>
                <p className="text-sm font-medium text-gray-500">Position</p>
                <p>{candidate.position}</p>
              </div>
            )}
            {candidate.assessmentDate && (
              <div>
                <p className="text-sm font-medium text-gray-500">Assessment Date</p>
                <p>{candidate.assessmentDate}</p>
              </div>
            )}
            {candidate.completionDate && (
              <div>
                <p className="text-sm font-medium text-gray-500">Completion Date</p>
                <p>{candidate.completionDate}</p>
              </div>
            )}
            {candidate.timeSpent && (
              <div>
                <p className="text-sm font-medium text-gray-500">Time Spent</p>
                <p>{candidate.timeSpent}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* COMPLETED STATE */}
      {candidate.status?.toLowerCase() === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessment Results</CardTitle>
            <CardDescription>Overall performance and key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Overall Score */}
            {candidate.score && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Overall Score</h3>
                  <span className="text-sm font-bold">{candidate.score}%</span>
                </div>
                <Progress value={candidate.score} className="h-2" />
              </div>
            )}

            {/* Divider */}
            <Separator className="my-6" />

            {/* Trait / Skill / Module Breakdown */}
{(candidate.traits?.length > 0 ||
  candidate.skills?.length > 0 ||
  candidate.moduleResults?.length > 0) && (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-medium mb-4">Assessment Modules</h3>
      <div className="space-y-4">
        {(candidate.traits || []).map((trait, index) => (
          <div key={`trait-${index}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">{trait.name}</span>
              <span className="text-sm font-medium">{trait.score}%</span>
            </div>
            <Progress value={trait.score} className="h-2" />
          </div>
        ))}

        {(candidate.skills || []).map((skill, index) => (
          <div key={`skill-${index}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">{skill.name}</span>
              <span className="text-sm font-medium">{skill.score}%</span>
            </div>
            <Progress value={skill.score} className="h-2" />
          </div>
        ))}

        {(candidate.moduleResults || []).map((mod, index) => (
          <div key={`mod-${index}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">{mod.moduleName}</span>
              <span className="text-sm font-medium">{mod.percentage}%</span>
            </div>
            <Progress value={mod.percentage} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  </div>
)}

          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              <FileCheck className="mr-2 h-4 w-4" />
              View Full Report
            </Button>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Results
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* IN PROGRESS */}
      {candidate.status?.toLowerCase() === 'started' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessment In Progress</CardTitle>
            <CardDescription>The candidate is currently taking this assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Started on</p>
                <p className="text-sm text-gray-500">{candidate.assessmentDate}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Progress</p>
              <Progress value={40} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">2 of 4 modules completed</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Send Reminder</Button>
          </CardFooter>
        </Card>
      )}

      {/* NOT STARTED */}
      {candidate.status?.toLowerCase() === 'not started' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessment Not Started</CardTitle>
            <CardDescription>The candidate has not begun the assessment yet</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full">Send Reminder</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CandidateDetails;

