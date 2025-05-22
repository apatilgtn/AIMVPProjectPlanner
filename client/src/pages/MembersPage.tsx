import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { User, UserCog, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface UserData {
  id: number;
  username: string;
  role?: string;
  lastActive?: string;
  status?: 'online' | 'offline' | 'inactive';
}

const MembersPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First get current user info
        const userResponse = await fetch('/api/user');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUser(userData.data?.username);
          
          // Only proceed if we're the admin
          if (userData.data?.username === 'admin') {
            const usersResponse = await fetch('/api/users');
            if (usersResponse.ok) {
              const usersData = await usersResponse.json();
              setUsers(usersData.data || []);
            } else {
              // If API not implemented yet, show placeholder data
              setUsers([
                { id: 1, username: 'admin', role: 'Administrator', lastActive: 'Now', status: 'online' },
                ...generateMockUsers()
              ]);
            }
          } else {
            toast({
              title: "Not authorized",
              description: "Only admin users can view the members page",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching members data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Helper function to generate placeholder data while API is being implemented
  const generateMockUsers = (): UserData[] => {
    // Check if any users were registered in the system
    const registeredUsers = [];
    
    try {
      // Try to get data from localStorage if available
      const storedUsers = localStorage.getItem('registered_users');
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        if (Array.isArray(parsedUsers)) {
          registeredUsers.push(...parsedUsers);
        }
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    
    // If we have actual registered users, show them
    if (registeredUsers.length > 0) {
      return registeredUsers.map((username, index) => ({
        id: index + 2, // Start from 2 since admin is 1
        username,
        role: 'User',
        lastActive: 'Recently',
        status: 'online'
      }));
    }
    
    // Otherwise, use our placeholder data
    return [
      { id: 2, username: 'user1', role: 'User', lastActive: '2 hours ago', status: 'offline' },
      { id: 3, username: 'developer', role: 'Developer', lastActive: '1 day ago', status: 'offline' },
      { id: 4, username: 'project_manager', role: 'Project Manager', lastActive: '3 hours ago', status: 'inactive' }
    ];
  };

  // Helper function to get user role icon
  const getUserRoleIcon = (role?: string) => {
    switch (role) {
      case 'Administrator':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'Developer':
        return <UserCog className="h-4 w-4 text-blue-500" />;
      case 'Project Manager':
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return <User className="h-4 w-4 text-slate-500" />;
    }
  };
  
  // Helper function to get status color
  const getStatusColor = (status?: 'online' | 'offline' | 'inactive') => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-amber-500';
      case 'offline':
      default:
        return 'bg-slate-300';
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800">Team Members</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              Manage your team and user access permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="rounded-full h-8 w-8 bg-indigo-100 flex items-center justify-center mr-3">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {user.username.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold">{user.username}</div>
                          {currentUser === user.username && (
                            <div className="text-xs text-indigo-600">(You)</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getUserRoleIcon(user.role)}
                        <span>{user.role || 'User'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.lastActive || 'Unknown'}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(user.status)}`}></div>
                        <span className="capitalize">{user.status || 'unknown'}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MembersPage;