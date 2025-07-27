import { SidebarProvider, SidebarInset, SidebarTrigger } from "~/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Settings, Plus } from "lucide-react"
import { useCurrentProject } from "~/lib/db"

interface AppLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  headerActions?: React.ReactNode
}

export function AppLayout({ children, title, description, headerActions }: AppLayoutProps) {
  const { clearCurrentProject } = useCurrentProject()

  const handleNewProject = async () => {
    // Clear the current project data before navigating to new project
    await clearCurrentProject()
    window.location.href = '/'
  }
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        
        <SidebarInset>
          {/* Header */}
          <div className="bg-background border-b px-4 py-3 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {headerActions}
                
                <Button 
                  onClick={handleNewProject}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Project</span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Account Settings</DropdownMenuItem>
                    <DropdownMenuItem>Project Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Export Data</DropdownMenuItem>
                    <DropdownMenuItem>Clear All Data</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
