import type { Route } from "./+types/projects";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { AppLayout } from "~/components/shared/app-layout";
import { DataTable } from "~/components/ui/data-table";
import { 
  Calendar,
  Clock,
  ExternalLink,
  GitBranch,
  Plus,
  Trash2,
  Settings,
  ArrowUpDown,
  MoreHorizontal,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useProjects, type Project } from "~/lib/db";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projects - CreateStack" },
    { name: "description", content: "Manage all your projects in one place" },
  ];
}

export default function Projects() {
  const { projects, loading, deleteProject } = useProjects();

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

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const navigateToHome = () => {
    window.location.href = '/';
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Project Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {platformEmojis[project.platform] || '📁'}
            </span>
            <div>
              <div className="font-medium">{project.name}</div>
              <div className="text-sm text-muted-foreground capitalize">
                {project.platform}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge 
            variant="secondary" 
            className={`text-xs ${statusColors[status]}`}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return (
          <div className="text-sm">
            {formatDate(date)}
          </div>
        );
      },
    },
    {
      accessorKey: "lastModified",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <Clock className="mr-2 h-4 w-4" />
            Last Modified
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue("lastModified") as Date;
        return (
          <div className="text-sm text-muted-foreground">
            {getRelativeTime(date)}
          </div>
        );
      },
    },
    {
      accessorKey: "repositoryUrl",
      header: "Repository",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div>
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
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const project = row.original;
 
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(project.id)}
              >
                Copy project ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Edit project
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteProject(project.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  const newProjectAction = (
    <Button 
      onClick={navigateToHome}
      className="flex items-center space-x-2"
    >
      <Plus className="h-4 w-4" />
      <span>New Project</span>
    </Button>
  )

  return (
    <AppLayout 
      title="Projects" 
      description="Manage and organize all your development projects"
      headerActions={newProjectAction}
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading projects...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={projects} />
      )}
    </AppLayout>
  );
}
