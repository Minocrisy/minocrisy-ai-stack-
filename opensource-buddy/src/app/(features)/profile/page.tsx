"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Contribution } from '@/types';

// Mock user data - in production this would come from an API
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  skills: ['Technical Writing', 'Testing', 'Documentation', 'User Experience'],
  interests: ['Web Development', 'Machine Learning', 'Open Source'],
  contributions: [
    {
      id: '1',
      projectId: '1',
      type: 'documentation',
      title: 'Improve React Documentation',
      description: 'Added beginner-friendly examples to the React documentation',
      status: 'accepted',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-16T15:30:00Z',
    },
    {
      id: '2',
      projectId: '2',
      type: 'bug-report',
      title: 'UI Bug in TensorFlow Examples',
      description: 'Reported and documented a UI inconsistency in the tutorial interface',
      status: 'submitted',
      createdAt: '2024-01-10T14:20:00Z',
      updatedAt: '2024-01-10T14:20:00Z',
    },
  ],
};

export default function ProfilePage() {
  const [user, setUser] = useState<User>(mockUser);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const addSkill = () => {
    if (newSkill && !user.skills.includes(newSkill)) {
      setUser(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setUser(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const addInterest = () => {
    if (newInterest && !user.interests.includes(newInterest)) {
      setUser(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest],
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setUser(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove),
    }));
  };

  const getStatusColor = (status: Contribution['status']) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'needs-revision':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-20 w-20 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ✕
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Add a new skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill}>Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interests Section */}
          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => removeInterest(interest)}
                    >
                      {interest} ✕
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Add a new interest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  />
                  <Button onClick={addInterest}>Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contributions Section */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {user.contributions.map((contribution) => (
                  <div
                    key={contribution.id}
                    className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {contribution.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {contribution.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(contribution.status)}>
                        {contribution.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{contribution.type}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(contribution.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
