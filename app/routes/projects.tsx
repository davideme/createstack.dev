import type { Route } from "./+types/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { 
  Calendar,
  Clock,
  ExternalLink,
  GitBranch,
  Plus,
  Search,
  Trash2,
  Settings,
  Home,
  FileText,
  Bell
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { useState, useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projects - CreateStack" },
    { name: "description", content: "Manage all your projects in one place" },
  ];
}

interface Project {
  id: string;
  name: string;
  platform: string;
  createdAt: Date;
  lastModified: Date;
  status: 'active' | 'archived' | 'draft';
  repositoryUrl?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState("projects");

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('createstack-projects');
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        const projectsWithDates = parsed.map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          lastModified: new Date(project.lastModified)
        }));
        setProjects(projectsWithDates);
      } catch (error) {
        console.error('Failed to parse saved projects:', error);
        // Create some sample projects for demo
        const sampleProjects: Project[] = [
          {
            id: '1',
            name: 'E-commerce Platform',
            platform: 'github',
            createdAt: new Date('2024-12-15'),
            lastModified: new Date('2024-12-20'),
            status: 'active',
            repositoryUrl: 'https://github.com/user/ecommerce-platform'
          },
          {
            id: '2',
            name: 'Mobile App Backend',
            platform: 'gitlab',
            createdAt: new Date('2024-12-10'),
            lastModified: new Date('2024-12-18'),
            status: 'active',
            repositoryUrl: 'https://gitlab.com/user/mobile-backend'
          },
          {
            id: '3',
            name: 'Analytics Dashboard',
            platform: 'bitbucket',
            createdAt: new Date('2024-12-01'),
            lastModified: new Date('2024-12-05'),
            status: 'draft'
          },
          {
            id: '4',
            name: 'Legacy System Migration',
            platform: 'azure',
            createdAt: new Date('2024-11-15'),
            lastModified: new Date('2024-11-30'),
            status: 'archived'
          }
        ];
        setProjects(sampleProjects);
        localStorage.setItem('createstack-projects', JSON.stringify(sampleProjects));
      }
    }
  }, []);

  // Filter projects based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.platform.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [projects, searchTerm]);

  const platformEmojis: Record<string, string> = {
    github: '🐙',
    gitlab: '🦊',
    bitbucket: '🪣',
    azure: '☁️',
    codecommit: '⚡',
    sourcehut: '🏚️',
    gitea: '🍃'
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800'
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return `${Math.floor(diffDays / 30)} months ago`;
    }
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('createstack-projects', JSON.stringify(updatedProjects));
  };

  const navigateToHome = () => {
    window.location.href = '/';
  };

  const sidebarItems = [
    { id: "dashboard", label: "Project", icon: Home },
    { id: "projects", label: "All Projects", icon: FileText },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center space-x-2 px-3 py-2">
              <Avatar className="h-8 w-8 bg-blue-600">
                <AvatarFallback className="bg-blue-600 text-white font-bold text-sm">CS</AvatarFallback>
              </Avatar>
              <span className="font-bold text-lg">CreateStack</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => {
                            if (item.id === "dashboard") {
                              window.location.href = "/";
                            } else if (item.id === "projects") {
                              setActiveTab(item.id);
                            } else {
                              setActiveTab(item.id);
                            }
                          }}
                          isActive={activeTab === item.id}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center space-x-3 px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john@example.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          {/* Header */}
          <div className="bg-background border-b px-4 py-3 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                  <p className="text-sm text-muted-foreground">Manage and organize all your development projects</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={navigateToHome}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Project</span>
                </Button>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Project Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      Export Projects
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Import Projects
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
              <Avatar className="mx-auto w-24 h-24 mb-4">
                <AvatarFallback className="bg-muted">
                  <GitBranch className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Get started by creating your first project'
                }
              </p>
              {!searchTerm && (
                <Button onClick={navigateToHome}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {platformEmojis[project.platform] || '📁'}
                        </span>
                        <div>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <CardDescription className="flex items-center space-x-2 mt-1">
                            <span className="capitalize">{project.platform}</span>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${statusColors[project.status]}`}
                            >
                              {project.status}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Created {formatDate(project.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Updated {getRelativeTime(project.lastModified)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        {project.repositoryUrl ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(project.repositoryUrl, '_blank')}
                            className="flex items-center space-x-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>View Repo</span>
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled
                            className="flex items-center space-x-1"
                          >
                            <GitBranch className="h-3 w-3" />
                            <span>Draft</span>
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button size="sm" variant="ghost">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deleteProject(project.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </div>
  </SidebarProvider>
  );
}
