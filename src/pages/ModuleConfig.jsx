import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Puzzle, 
  Brain, 
  Clock, 
  Lightbulb, 
  Users, 
  BadgeCheck,
  Save
} from 'lucide-react';

const availableModules = [
  {
    id: 1,
    name: 'Cognitive Ability',
    description: 'Measures problem-solving, critical thinking, and learning ability',
    icon: Brain,
    defaultSelected: true,
    duration: '25 min'
  },
  {
    id: 2,
    name: 'Personality Assessment',
    description: 'Evaluates personality traits, work preferences, and cultural fit',
    icon: Puzzle,
    defaultSelected: true,
    duration: '20 min'
  },
  {
    id: 3,
    name: 'Situational Judgment',
    description: 'Assesses decision-making and judgment in work scenarios',
    icon: Lightbulb,
    defaultSelected: false,
    duration: '15 min'
  },
  {
    id: 4,
    name: 'Leadership Potential',
    description: 'Measures leadership qualities and management potential',
    icon: Users,
    defaultSelected: false,
    duration: '30 min'
  },
  {
    id: 5,
    name: 'Time Management',
    description: 'Evaluates organization and prioritization skills',
    icon: Clock,
    defaultSelected: true,
    duration: '10 min'
  },
  {
    id: 6,
    name: 'Professional Ethics',
    description: 'Assesses ethics and integrity in professional settings',
    icon: BadgeCheck,
    defaultSelected: false,
    duration: '15 min'
  },
];

const ModuleConfig = () => {
  const [selectedModules, setSelectedModules] = useState(
    availableModules.filter(module => module.defaultSelected).map(module => module.id)
  );
  
  const handleModuleToggle = (moduleId) => {
    setSelectedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };
  
  const handleSaveConfig = () => {
    toast({
      title: "Configuration Saved",
      description: `${selectedModules.length} modules selected for assessments.`,
    });
  };
  
  const getTotalDuration = () => {
    return availableModules
      .filter(module => selectedModules.includes(module.id))
      .reduce((total, module) => {
        const minutes = parseInt(module.duration.split(' ')[0]);
        return total + minutes;
      }, 0);
  };
  
  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Assessment Configuration</h1>
          <p className="text-gray-500">
            Select which modules to include in candidate assessments
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Select Assessment Modules</CardTitle>
              <CardDescription>
                Choose which modules to include in assessments sent to candidates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-5">
                  {availableModules.map((module) => {
                    const Icon = module.icon;
                    return (
                      <div key={module.id} className="flex items-start space-x-4 border p-4 rounded-md">
                        <div className={`p-2 rounded-md ${selectedModules.includes(module.id) ? 'bg-recruiter-accent text-recruiter-primary' : 'bg-gray-100'}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`module-${module.id}`} className="text-base font-medium">
                              {module.name}
                            </Label>
                            <span className="text-sm text-gray-500">{module.duration}</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {module.description}
                          </p>
                        </div>
                        <Checkbox
                          id={`module-${module.id}`}
                          checked={selectedModules.includes(module.id)}
                          onCheckedChange={() => handleModuleToggle(module.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="justify-between border-t p-6">
              <div>
                <p className="text-sm font-medium">
                  Selected: {selectedModules.length} of {availableModules.length} modules
                </p>
                <p className="text-sm text-gray-500">
                  Total assessment time: {getTotalDuration()} minutes
                </p>
              </div>
              <Button onClick={handleSaveConfig}>
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
              <CardDescription>
                Overview of your assessment setup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Selected Modules</h3>
                {selectedModules.length > 0 ? (
                  <ul className="space-y-2">
                    {availableModules
                      .filter(module => selectedModules.includes(module.id))
                      .map((module) => {
                        const Icon = module.icon;
                        return (
                          <li key={module.id} className="flex items-center">
                            <Icon className="h-4 w-4 mr-2 text-recruiter-primary" />
                            <span className="text-sm">{module.name}</span>
                          </li>
                        );
                      })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No modules selected</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Assessment Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Modules:</span>
                    <span className="text-sm">{selectedModules.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Duration:</span>
                    <span className="text-sm">{getTotalDuration()} minutes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ModuleConfig;
