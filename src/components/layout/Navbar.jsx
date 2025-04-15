import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Menu, User, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') {
    return null;
  }

  const roleColor = user?.role === 'candidate' 
    ? 'bg-candidate-primary' 
    : user?.role === 'recruiter' 
      ? 'bg-recruiter-primary' 
      : 'bg-admin-primary';

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full ${roleColor}`}></div>
            <span className="font-bold">GameOn Assessment</span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6">
              {user?.role === 'candidate' && (
                <>
                  <Link to="/candidate-dashboard" className="text-sm font-medium hover:text-primary">
                    Dashboard
                  </Link>
                  <Link to="/assessments" className="text-sm font-medium hover:text-primary">
                    Assessments
                  </Link>
                  <Link to="/results" className="text-sm font-medium hover:text-primary">
                    Results
                  </Link>
                </>
              )}

              {user?.role === 'recruiter' && (
                <>
                  <Link to="/recruiter-dashboard" className="text-sm font-medium hover:text-primary">
                    Dashboard
                  </Link>
                  <Link to="/candidates" className="text-sm font-medium hover:text-primary">
                    Candidates
                  </Link>
                  <Link to="/analytics" className="text-sm font-medium hover:text-primary">
                    Analytics
                  </Link>
                  <Link to="/assessment-config" className="text-sm font-medium hover:text-primary">
                    Assessment Config
                  </Link>
                </>
              )}

              {user?.role === 'admin' && (
                <>
                  <Link to="/admin-dashboard" className="text-sm font-medium hover:text-primary">
                    Dashboard
                  </Link>
                  <Link to="/module-editor" className="text-sm font-medium hover:text-primary">
                    Modules
                  </Link>
                  <Link to="/system-settings" className="text-sm font-medium hover:text-primary">
                    Settings
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                    <span className="mt-1 text-xs font-semibold capitalize text-gray-500">
                      {user?.role}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {user?.role === 'recruiter' && (
                  <DropdownMenuItem asChild>
                    <Link to="/assessment-config" className="cursor-pointer flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Assessment Config</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user?.role === 'candidate' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/candidate-dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/assessments">Assessments</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/results">Results</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                  </>
                )}

                {user?.role === 'recruiter' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/recruiter-dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/candidates">Candidates</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/analytics">Analytics</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/assessment-config">Assessment Config</Link>
                    </DropdownMenuItem>
                  </>
                )}

                {user?.role === 'admin' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin-dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/user-management">Users</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/module-management">Modules</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
