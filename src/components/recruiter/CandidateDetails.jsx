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
import {
  Award,
  Calendar,
  Clock,
  Download,
  BarChart3,
  PieChart,
  FileCheck,
} from 'lucide-react';

const CandidateDetails = ({ candidate }) => {
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

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'not-started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Candidate Profile Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" alt={candidate.name} />
                <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{candidate.name}</CardTitle>
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
            <div>
              <p className="text-sm font-medium text-gray-500">Position</p>
              <p>{candidate.position}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Assessment Date</p>
              <p>{candidate.assessmentDate}</p>
            </div>
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

      {/* Assessment Results */}
      {candidate.status === 'completed' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assessment Results</CardTitle>
              <CardDescription>
                Overall performance and key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Overall Score</h3>
                  <span className="text-sm font-bold">{candidate.score}%</span>
                </div>
                <Progress value={candidate.score} className="h-2" />
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-4">Personality Traits</h3>
                  <div className="space-y-4">
                    {candidate.traits?.map((trait, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{trait.name}</span>
                          <span className="text-sm font-medium">{trait.score}%</span>
                        </div>
                        <Progress value={trait.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-sm font-medium mb-4">Skills Assessment</h3>
                  <div className="space-y-4">
                    {candidate.skills?.map((skill, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{skill.name}</span>
                          <span className="text-sm font-medium">{skill.score}%</span>
                        </div>
                        <Progress value={skill.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
        </>
      )}

      {/* Assessment In Progress */}
      {candidate.status === 'in-progress' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessment In Progress</CardTitle>
            <CardDescription>
              The candidate is currently taking this assessment
            </CardDescription>
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
              <p className="text-xs text-gray-500 mt-2">2 of 5 modules completed</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Send Reminder
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Assessment Not Started */}
      {candidate.status === 'not-started' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessment Not Started</CardTitle>
            <CardDescription>
              The candidate has not begun the assessment yet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 text-gray-600 rounded-md">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Scheduled for</p>
                <p className="text-sm text-gray-500">{candidate.assessmentDate}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Send Reminder
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CandidateDetails;
