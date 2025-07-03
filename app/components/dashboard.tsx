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
  const [showIaC, setShowIaC] = useState(false)

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

  const generateTerraformCode = () => {
    const repoName = projectName.trim() || "my-project"
    
    const terraformTemplates = {
      github: `# Terraform configuration for GitHub repository
terraform {
  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 5.0"
    }
  }
}

provider "github" {
  # Configure with your GitHub token
  # export GITHUB_TOKEN="your_token_here"
}

resource "github_repository" "${repoName.replace(/[^a-zA-Z0-9]/g, '_')}" {
  name        = "${repoName}"
  description = "Repository created with Terraform"
  
  visibility = "public"  # or "private"
  
  has_issues    = true
  has_projects  = true
  has_wiki      = true
  
  auto_init = true
}`,
      gitlab: `# Terraform configuration for GitLab project
terraform {
  required_providers {
    gitlab = {
      source  = "gitlabhq/gitlab"
      version = "~> 16.0"
    }
  }
}

provider "gitlab" {
  # Configure with your GitLab token
  # export GITLAB_TOKEN="your_token_here"
}

resource "gitlab_project" "${repoName.replace(/[^a-zA-Z0-9]/g, '_')}" {
  name        = "${repoName}"
  description = "Project created with Terraform"
  
  visibility_level = "public"  # or "private"
  
  issues_enabled         = true
  merge_requests_enabled = true
  wiki_enabled          = true
  
  initialize_with_readme = true
}`,
      azure: `# Terraform configuration for Azure DevOps repository
terraform {
  required_providers {
    azuredevops = {
      source  = "microsoft/azuredevops"
      version = "~> 0.10"
    }
  }
}

provider "azuredevops" {
  # Configure with your Azure DevOps token
  # export AZDO_PERSONAL_ACCESS_TOKEN="your_token_here"
  # export AZDO_ORG_SERVICE_URL="https://dev.azure.com/your-org"
}

resource "azuredevops_git_repository" "${repoName.replace(/[^a-zA-Z0-9]/g, '_')}" {
  project_id = azuredevops_project.project.id
  name       = "${repoName}"
  
  initialization {
    init_type = "Clean"
  }
}

resource "azuredevops_project" "project" {
  name       = "${repoName}-project"
  visibility = "private"
}`
    }
    
    return terraformTemplates[selectedPlatform as keyof typeof terraformTemplates] || terraformTemplates.github
  }

  const generatePulumiCode = () => {
    const repoName = projectName.trim() || "my-project"
    
    return `# Pulumi TypeScript program for ${platforms.find(p => p.id === selectedPlatform)?.name}
import * as github from "@pulumi/github";

const repository = new github.Repository("${repoName.replace(/[^a-zA-Z0-9]/g, '-')}", {
    name: "${repoName}",
    description: "Repository created with Pulumi",
    visibility: "public", // or "private"
    hasIssues: true,
    hasProjects: true,
    hasWiki: true,
    autoInit: true,
});

export const repositoryUrl = repository.htmlUrl;
export const cloneUrl = repository.cloneUrl;`
  }

  const generateCloudFormationCode = () => {
    const repoName = projectName.trim() || "my-project"
    
    return `# AWS CloudFormation template for CodeCommit repository
AWSTemplateFormatVersion: '2010-09-09'
Description: 'CodeCommit repository created with CloudFormation'

Resources:
  ${repoName.replace(/[^a-zA-Z0-9]/g, '')}Repository:
    Type: AWS::CodeCommit::Repository
    Properties:
      RepositoryName: ${repoName}
      RepositoryDescription: "Repository created with CloudFormation"
      
Outputs:
  RepositoryCloneUrlHttp:
    Description: "HTTP clone URL for the repository"
    Value: !GetAtt ${repoName.replace(/[^a-zA-Z0-9]/g, '')}Repository.CloneUrlHttp
    
  RepositoryCloneUrlSsh:
    Description: "SSH clone URL for the repository"
    Value: !GetAtt ${repoName.replace(/[^a-zA-Z0-9]/g, '')}Repository.CloneUrlSsh`
  }

  const generateCDKCode = () => {
    const repoName = projectName.trim() || "my-project"
    const className = repoName.replace(/[^a-zA-Z0-9]/g, '') + 'Stack'
    
    if (selectedPlatform === 'github') {
      return `// AWS CDK TypeScript for GitHub repository
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class ${className} extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Note: GitHub repository creation via CDK requires third-party constructs
    // Install: npm install @cloudcomponents/cdk-github-webhook
    
    // For GitHub, consider using GitHub Actions with CDK:
    // 1. Use GitHub CLI in CDK custom resource
    // 2. Use GitHub REST API via Lambda function
    // 3. Use third-party constructs like @cloudcomponents/cdk-github-webhook
    
    // Example with custom resource:
    const createGitHubRepo = new cdk.CustomResource(this, 'GitHubRepository', {
      serviceToken: githubRepoProvider.serviceToken,
      properties: {
        repositoryName: '${repoName}',
        description: 'Repository created with AWS CDK',
        private: false,
        autoInit: true
      }
    });
  }
}`
    } else if (selectedPlatform === 'codecommit') {
      return `// AWS CDK TypeScript for CodeCommit repository
import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { Construct } from 'constructs';

export class ${className} extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create CodeCommit repository
    const repository = new codecommit.Repository(this, '${repoName.replace(/[^a-zA-Z0-9]/g, '')}Repository', {
      repositoryName: '${repoName}',
      description: 'Repository created with AWS CDK',
    });

    // Output the repository clone URLs
    new cdk.CfnOutput(this, 'RepositoryCloneUrlHttp', {
      value: repository.repositoryCloneUrlHttp,
      description: 'HTTP clone URL for the repository',
    });

    new cdk.CfnOutput(this, 'RepositoryCloneUrlSsh', {
      value: repository.repositoryCloneUrlSsh,
      description: 'SSH clone URL for the repository',
    });

    new cdk.CfnOutput(this, 'RepositoryArn', {
      value: repository.repositoryArn,
      description: 'ARN of the repository',
    });
  }
}`
    } else {
      return `// AWS CDK TypeScript - Generic template
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class ${className} extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // CDK primarily supports AWS services
    // For ${platforms.find(p => p.id === selectedPlatform)?.name}, consider:
    // 1. Using platform-specific APIs via Lambda functions
    // 2. Custom resources with platform SDKs
    // 3. Third-party CDK constructs if available
    
    // Example: Custom resource approach
    // const customResource = new cdk.CustomResource(this, 'ExternalRepository', {
    //   serviceToken: customProvider.serviceToken,
    //   properties: {
    //     platform: '${selectedPlatform}',
    //     repositoryName: '${repoName}',
    //     description: 'Repository created with AWS CDK'
    //   }
    // });
  }
}`
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Code copied to clipboard!")
    })
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
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    className="flex items-center space-x-2"
                    disabled={!projectName.trim()}
                    onClick={handleCreateRepository}
                  >
                    <span>{platforms.find(p => p.id === selectedPlatform)?.emoji}</span>
                    <span>Create Repository</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="flex items-center space-x-2"
                    disabled={!projectName.trim()}
                    onClick={() => setShowIaC(!showIaC)}
                  >
                    <span>🏗️</span>
                    <span>Infrastructure as Code</span>
                  </Button>
                </div>

                {/* Infrastructure as Code Section */}
                {showIaC && projectName.trim() && (
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="text-sm font-medium">Infrastructure as Code Templates</h4>
                    
                    <Tabs defaultValue="terraform" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="terraform">Terraform</TabsTrigger>
                        <TabsTrigger value="pulumi">Pulumi</TabsTrigger>
                        <TabsTrigger value="cdk">CDK</TabsTrigger>
                        <TabsTrigger value="cloudformation">CloudFormation</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="terraform" className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Terraform HCL configuration</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generateTerraformCode())}
                          >
                            Copy Code
                          </Button>
                        </div>
                        <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-64">
                          <code>{generateTerraformCode()}</code>
                        </pre>
                      </TabsContent>
                      
                      <TabsContent value="pulumi" className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Pulumi TypeScript program</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generatePulumiCode())}
                          >
                            Copy Code
                          </Button>
                        </div>
                        <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-64">
                          <code>{generatePulumiCode()}</code>
                        </pre>
                      </TabsContent>
                      
                      <TabsContent value="cdk" className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">AWS CDK TypeScript</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generateCDKCode())}
                          >
                            Copy Code
                          </Button>
                        </div>
                        <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-64">
                          <code>{generateCDKCode()}</code>
                        </pre>
                      </TabsContent>
                      
                      <TabsContent value="cloudformation" className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">AWS CloudFormation template</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generateCloudFormationCode())}
                          >
                            Copy Code
                          </Button>
                        </div>
                        <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-64">
                          <code>{generateCloudFormationCode()}</code>
                        </pre>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
