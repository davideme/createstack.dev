import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Progress } from "~/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Separator } from "~/components/ui/separator"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Bell,
  Settings,
  Home,
  FileText,
  PieChart,
  Calendar,
  Mail,
  ShoppingCart,
  CreditCard,
  User,
  Menu,
  X,
  Github,
  ExternalLink
} from "lucide-react"
import { useState } from "react"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [projectName, setProjectName] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("github")

  const platforms = [
    {
      id: "github",
      name: "GitHub",
      emoji: "🐙",
      description: "Most popular platform with strong community, Git-based, CI/CD via Actions.",
      bestFor: "Open-source projects, startups, enterprise.",
      url: "https://github.com/new?name="
    },
    {
      id: "gitlab",
      name: "GitLab",
      emoji: "🦊",
      description: "All-in-one DevOps platform (Git + CI/CD + issue tracking + container registry).",
      bestFor: "End-to-end software lifecycle management.",
      url: "https://gitlab.com/projects/new?project%5Bname%5D="
    },
    {
      id: "bitbucket",
      name: "Bitbucket",
      emoji: "🪣",
      description: "Atlassian product with Jira integration, supports Git and Mercurial (legacy).",
      bestFor: "Teams using Jira and other Atlassian tools.",
      url: "https://bitbucket.org/repo/create?name="
    },
    {
      id: "azure",
      name: "Azure Repos",
      emoji: "☁️",
      description: "Part of Azure DevOps; supports Git and TFVC repositories.",
      bestFor: "Microsoft stack and Azure cloud users.",
      url: "https://dev.azure.com/"
    },
    {
      id: "codecommit",
      name: "AWS CodeCommit",
      emoji: "⚡",
      description: "Fully managed Git hosting by AWS. Integrates with IAM and other AWS tools.",
      bestFor: "Cloud-native teams using AWS infrastructure.",
      url: "https://console.aws.amazon.com/codesuite/codecommit/repositories/new"
    },
    {
      id: "sourcehut",
      name: "SourceHut",
      emoji: "🏚️",
      description: "Minimalist, open-source focused. No JavaScript frontend.",
      bestFor: "Lightweight, privacy-conscious development.",
      url: "https://git.sr.ht/create"
    },
    {
      id: "gitea",
      name: "Gitea / Gogs",
      emoji: "🍃",
      description: "Self-hosted, lightweight Git servers.",
      bestFor: "Teams needing self-hosted, low-overhead Git.",
      url: "#" // Self-hosted, no direct URL
    }
  ]

  const handleCreateRepository = () => {
    if (projectName.trim()) {
      const platform = platforms.find(p => p.id === selectedPlatform)
      if (platform) {
        if (platform.id === "gitea") {
          alert("Gitea/Gogs requires self-hosting. Please visit your self-hosted instance to create a repository.")
          return
        }
        
        let url = platform.url
        if (platform.id === "azure") {
          // Azure DevOps requires organization setup
          window.open("https://dev.azure.com/", '_blank')
          return
        }
        
        url += encodeURIComponent(projectName.trim())
        window.open(url, '_blank')
      }
    }
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "mail", label: "Mail", icon: Mail },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "customers", label: "Customers", icon: User },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50/40">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="font-bold text-lg">CreateStack</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">john@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening.</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Code Hosting Card */}
          <div className="mb-6">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-xl">{platforms.find(p => p.id === selectedPlatform)?.emoji}</span>
                  <span>Code Hosting</span>
                </CardTitle>
                <CardDescription>
                  Create a new repository for your project on your preferred platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="platform-select" className="text-sm font-medium">
                      Platform
                    </label>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger id="platform-select">
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform.id} value={platform.id}>
                            <div className="flex items-center space-x-2">
                              <span>{platform.emoji}</span>
                              <span>{platform.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="project-name" className="text-sm font-medium">
                      Project Name
                    </label>
                    <Input
                      id="project-name"
                      placeholder="Enter your project name..."
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                {/* Platform Info */}
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium mb-1 flex items-center space-x-2">
                    <span>{platforms.find(p => p.id === selectedPlatform)?.emoji}</span>
                    <span>{platforms.find(p => p.id === selectedPlatform)?.name}</span>
                  </h4>
                  <p className="text-xs text-muted-foreground mb-1">
                    {platforms.find(p => p.id === selectedPlatform)?.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Best for:</strong> {platforms.find(p => p.id === selectedPlatform)?.bestFor}
                  </p>
                </div>
                
                <Button 
                  className="w-full sm:w-auto flex items-center space-x-2"
                  disabled={!projectName.trim()}
                  onClick={handleCreateRepository}
                >
                  <span>{platforms.find(p => p.id === selectedPlatform)?.emoji}</span>
                  <span>Create Repository on {platforms.find(p => p.id === selectedPlatform)?.name}</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
