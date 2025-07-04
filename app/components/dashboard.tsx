import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Progress } from "~/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Separator } from "~/components/ui/separator"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ScrollArea } from "~/components/ui/scroll-area"
import { AppLayout } from "~/components/shared/app-layout"
import { ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import { useDB, db, type Project } from "~/lib/db"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("project")
  const [projectName, setProjectName] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("github")
  const [showIaC, setShowIaC] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedDepTool, setSelectedDepTool] = useState("dependabot")
  const { isReady, error } = useDB()

  // Load saved data on component mount
  useEffect(() => {
    if (!isReady) return;

    const loadPreferences = async () => {
      try {
        const savedProjectName = await db.getPreference('currentProjectName')
        const savedPlatform = await db.getPreference('selectedPlatform')
        const savedTime = await db.getPreference('lastSaved')
        
        if (savedProjectName) {
          setProjectName(savedProjectName)
        }
        
        if (savedPlatform) {
          setSelectedPlatform(savedPlatform)
        }
        
        if (savedTime) {
          setLastSaved(new Date(savedTime))
        }
      } catch (error) {
        console.error('Failed to load preferences:', error)
      }
    }

    loadPreferences()
  }, [isReady])

  // Reset dependency tool selection when platform changes if current selection is not available
  useEffect(() => {
    const availableTools = getAvailableDependencyTools()
    const isCurrentToolAvailable = availableTools.some(tool => tool.id === selectedDepTool)
    
    if (!isCurrentToolAvailable && availableTools.length > 0) {
      // Set to the first available tool, preferring platform-specific ones
      const platformSpecificTool = availableTools.find(tool => 
        (selectedPlatform === 'github' && tool.id === 'dependabot') ||
        (selectedPlatform === 'gitlab' && tool.id === 'gitlab-deps')
      )
      setSelectedDepTool(platformSpecificTool?.id || availableTools[0].id)
    }
  }, [selectedPlatform])

  const getAvailableDependencyTools = () => {
    return dependencyTools.filter(tool => {
      // Platform-specific filtering
      if (tool.id === 'dependabot') {
        return selectedPlatform === 'github'
      }
      if (tool.id === 'gitlab-deps') {
        return selectedPlatform === 'gitlab'
      }
      // Other tools are available for all platforms
      return true
    })
  }

  const getDependencyToolDocumentationUrl = (toolId: string) => {
    const urls = {
      dependabot: "https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuring-dependabot-version-updates#enabling-dependabot-version-updates",
      renovate: "https://docs.renovatebot.com/getting-started/",
      snyk: "https://docs.snyk.io/getting-started",
      whitesource: "https://docs.mend.io/bundle/integrations/page/getting_started.html",
      "gitlab-deps": "https://docs.gitlab.com/ee/user/application_security/dependency_scanning/",
      manual: "#" // No specific documentation for manual management
    }
    return urls[toolId as keyof typeof urls] || "#"
  }

  const handleConfigureTool = () => {
    const url = getDependencyToolDocumentationUrl(selectedDepTool)
    if (url !== "#") {
      window.open(url, '_blank')
    } else {
      alert("Manual dependency management doesn't require specific configuration. Simply review and update dependencies as needed.")
    }
  }

  // Autosave project name and create/update project in projects list
  useEffect(() => {
    if (!isReady || !projectName.trim()) return;

    setIsSaving(true)
    
    const saveTimer = setTimeout(async () => {
      try {
        await db.setPreference('currentProjectName', projectName)
        await db.setPreference('lastSaved', new Date().toISOString())
        setLastSaved(new Date())
        
        // Save/update project in the projects list
        await saveOrUpdateProject(projectName.trim(), selectedPlatform)
        
        setIsSaving(false)
      } catch (error) {
        console.error('Failed to save project:', error)
        setIsSaving(false)
      }
    }, 1000) // Save after 1 second of inactivity

    return () => {
      clearTimeout(saveTimer)
      if (!projectName.trim()) {
        setIsSaving(false)
      }
    }
  }, [projectName, selectedPlatform, isReady])

  // Autosave selected platform
  useEffect(() => {
    if (!isReady) return;

    setIsSaving(true)
    const saveTimer = setTimeout(async () => {
      try {
        await db.setPreference('selectedPlatform', selectedPlatform)
        await db.setPreference('lastSaved', new Date().toISOString())
        setLastSaved(new Date())
        
        // Update project platform if project name exists
        if (projectName.trim()) {
          await saveOrUpdateProject(projectName.trim(), selectedPlatform)
        }
        
        setIsSaving(false)
      } catch (error) {
        console.error('Failed to save platform preference:', error)
        setIsSaving(false)
      }
    }, 100) // Quick save for platform changes

    return () => clearTimeout(saveTimer)
  }, [selectedPlatform, projectName, isReady])

  // Clear saved data function
  const clearSavedData = async () => {
    try {
      await db.setPreference('currentProjectName', null)
      await db.setPreference('selectedPlatform', null)
      await db.setPreference('lastSaved', null)
      
      // Remove draft project from projects list
      const draftProject = await db.getProject('current-draft')
      if (draftProject) {
        await db.deleteProject('current-draft')
      }
      
      setProjectName("")
      setSelectedPlatform("github")
      setLastSaved(null)
      setIsSaving(false)
    } catch (error) {
      console.error('Failed to clear saved data:', error)
    }
  }

  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)
    
    if (diffMinutes < 1) {
      return "just now"
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
    } else if (diffMinutes < 1440) {
      const diffHours = Math.floor(diffMinutes / 60)
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Save or update project in the projects list
  const saveOrUpdateProject = async (name: string, platform: string) => {
    try {
      // Check if a draft project already exists
      let existingProject = await db.getProject('current-draft')
      
      const projectData: Project = {
        id: 'current-draft',
        name: name,
        platform: platform,
        createdAt: existingProject?.createdAt || new Date(),
        lastModified: new Date(),
        status: 'draft',
        repositoryUrl: undefined
      }
      
      await db.saveProject(projectData)
    } catch (error) {
      console.error('Failed to save project:', error)
    }
  }

  const platforms = [
    {
      id: "github",
      name: "GitHub",
      emoji: "🐙",
      description: "Most popular platform with strong community, Git-based, CI/CD via Actions. ✅ Pull Requests supported.",
      bestFor: "Open-source projects, startups, enterprise.",
      url: "https://github.com/new?name="
    },
    {
      id: "gitlab",
      name: "GitLab",
      emoji: "🦊",
      description: "All-in-one DevOps platform (Git + CI/CD + issue tracking + container registry). ✅ Merge Requests supported.",
      bestFor: "End-to-end software lifecycle management.",
      url: "https://gitlab.com/projects/new?project%5Bname%5D="
    },
    {
      id: "bitbucket",
      name: "Bitbucket",
      emoji: "🪣",
      description: "Atlassian product with Jira integration, supports Git and Mercurial (legacy). ✅ Pull Requests supported.",
      bestFor: "Teams using Jira and other Atlassian tools.",
      url: "https://bitbucket.org/repo/create?name="
    },
    {
      id: "azure",
      name: "Azure Repos",
      emoji: "☁️",
      description: "Part of Azure DevOps; supports Git and TFVC repositories. ✅ Pull Requests supported.",
      bestFor: "Microsoft stack and Azure cloud users.",
      url: "https://dev.azure.com/"
    },
    {
      id: "codecommit",
      name: "AWS CodeCommit",
      emoji: "⚡",
      description: "Fully managed Git hosting by AWS. Integrates with IAM and other AWS tools. ✅ Pull Requests supported.",
      bestFor: "Cloud-native teams using AWS infrastructure.",
      url: "https://console.aws.amazon.com/codesuite/codecommit/repositories/new"
    },
    {
      id: "sourcehut",
      name: "SourceHut",
      emoji: "🏚️",
      description: "Minimalist, open-source focused. No JavaScript frontend. ⚠️ Uses email-based patch workflows instead of web-based pull requests.",
      bestFor: "Lightweight, privacy-conscious development.",
      url: "https://git.sr.ht/create"
    },
    {
      id: "gitea",
      name: "Gitea / Gogs",
      emoji: "🍃",
      description: "Self-hosted, lightweight Git servers. ✅ Pull Requests supported.",
      bestFor: "Teams needing self-hosted, low-overhead Git.",
      url: "#" // Self-hosted, no direct URL
    }
  ]

  const dependencyTools = [
    {
      id: "dependabot",
      name: "Dependabot",
      emoji: "🤖",
      description: "GitHub's built-in automated dependency updates. ✅ Security alerts, automated PRs, supports 20+ ecosystems. Languages: JavaScript/Node.js, Python, Ruby, Java, .NET, Go, PHP, Rust, Elixir, Docker, GitHub Actions.",
      platform: "GitHub",
      bestFor: "GitHub repositories, automated security updates.",
      pricing: "Free on GitHub",
      features: ["Security alerts", "Automated PRs", "Version updates", "Vulnerability scanning"]
    },
    {
      id: "renovate",
      name: "Renovate",
      emoji: "🔄",
      description: "Universal dependency update tool. ✅ Multi-platform support, highly configurable, self-hosted option available. Languages: JavaScript/Node.js, Python, Java, .NET, Go, PHP, Ruby, Rust, Docker, Kubernetes, Terraform, and 60+ package managers.",
      platform: "Multi-platform",
      bestFor: "Complex projects, custom update strategies.",
      pricing: "Free (self-hosted), WhiteSource hosted plans available",
      features: ["Multi-platform", "Custom configs", "Scheduled updates", "Grouped updates"]
    },
    {
      id: "snyk",
      name: "Snyk",
      emoji: "🛡️",
      description: "Security-focused dependency scanning. ✅ Vulnerability database, license compliance, container scanning. Languages: JavaScript/Node.js, Python, Java, .NET, Ruby, Go, PHP, Scala, Swift, C/C++, Docker, Kubernetes.",
      platform: "Multi-platform",
      bestFor: "Security-first teams, enterprise compliance.",
      pricing: "Free tier, Pro plans from $25/month",
      features: ["Vulnerability scanning", "License compliance", "Container security", "IDE integrations"]
    },
    {
      id: "whitesource",
      name: "WhiteSource (Mend)",
      emoji: "🔍",
      description: "Enterprise dependency management. ✅ License compliance, vulnerability scanning, policy enforcement. Languages: JavaScript/Node.js, Python, Java, .NET, Ruby, Go, PHP, C/C++, Scala, R, and 200+ programming languages.",
      platform: "Multi-platform",
      bestFor: "Enterprise teams, compliance requirements.",
      pricing: "Enterprise pricing, contact for quotes",
      features: ["License scanning", "Policy enforcement", "Risk assessment", "Compliance reporting"]
    },
    {
      id: "gitlab-deps",
      name: "GitLab Dependency Scanning",
      emoji: "🦊",
      description: "GitLab's built-in dependency scanning. ✅ Security dashboard, merge request integration, CI/CD native. Languages: JavaScript/Node.js, Python, Java, .NET, Go, PHP, Ruby, C/C++, Scala.",
      platform: "GitLab",
      bestFor: "GitLab users, integrated DevOps workflows.",
      pricing: "Free tier, Premium features from $19/user/month",
      features: ["Security dashboard", "MR integration", "CI/CD native", "Vulnerability management"]
    },
    {
      id: "manual",
      name: "Manual Management",
      emoji: "👤",
      description: "Traditional manual dependency updates. ⚠️ No automation, requires manual monitoring and updates. Languages: All programming languages (manual process).",
      platform: "Any",
      bestFor: "Small projects, full control over updates.",
      pricing: "Free (but requires developer time)",
      features: ["Full control", "No automation", "Manual review", "Custom timing"]
    }
  ]

  const handleCreateRepository = async () => {
    if (projectName.trim()) {
      const platform = platforms.find(p => p.id === selectedPlatform)
      if (platform) {
        try {
          // Update existing draft project to active status
          const draftProject = await db.getProject('current-draft')
          
          if (draftProject) {
            // Update existing draft project to active
            const activeProject: Project = {
              ...draftProject,
              id: Date.now().toString(), // Give it a permanent ID
              status: 'active',
              lastModified: new Date(),
              repositoryUrl: platform.url !== '#' ? platform.url + encodeURIComponent(projectName.trim()) : undefined
            }
            
            // Delete the draft and save as active project
            await db.deleteProject('current-draft')
            await db.saveProject(activeProject)
          } else {
            // Fallback: create new project if draft doesn't exist
            const newProject: Project = {
              id: Date.now().toString(),
              name: projectName.trim(),
              platform: selectedPlatform,
              createdAt: new Date(),
              lastModified: new Date(),
              status: 'active',
              repositoryUrl: platform.url !== '#' ? platform.url + encodeURIComponent(projectName.trim()) : undefined
            }
            await db.saveProject(newProject)
          }
        } catch (error) {
          console.error('Failed to create project:', error)
        }

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

  const generateADR = () => {
    const repoName = projectName.trim() || "my-project"
    const platform = platforms.find(p => p.id === selectedPlatform)
    const currentDate = new Date().toISOString().split('T')[0]
    const adrNumber = "001" // Could be made dynamic based on existing ADRs
    
    return `# ADR-${adrNumber}: Code Hosting Platform Selection for ${repoName}

## Status
Accepted

## Date
${currentDate}

## Context
We need to select a code hosting platform for the ${repoName} project. This decision will impact our development workflow, collaboration processes, CI/CD capabilities, and integration options.

## Decision
We have decided to use **${platform?.name}** as our code hosting platform.

## Rationale
### Platform Overview
${platform?.description}

### Key Benefits
- **Best suited for**: ${platform?.bestFor}
- **Ecosystem integration**: ${getEcosystemBenefits(selectedPlatform)}
- **Team familiarity**: ${getTeamFamiliarityNotes(selectedPlatform)}

### Technical Considerations
${getTechnicalConsiderations(selectedPlatform)}

## Consequences
### Positive
- ${getPositiveConsequences(selectedPlatform).join('\n- ')}

### Negative
- ${getNegativeConsequences(selectedPlatform).join('\n- ')}

### Neutral
- Repository URL: \`${platform?.url !== '#' ? platform?.url + encodeURIComponent(repoName) : 'Self-hosted instance required'}\`
- Primary use case: Source code management and version control
- Expected team size: [To be filled]
- Project visibility: [Public/Private - To be decided]

## Implementation Notes
1. Set up repository with appropriate access controls
2. Configure branch protection rules
3. Set up CI/CD workflows ${getCIGuidance(selectedPlatform)}
4. Document contribution guidelines
5. Configure issue templates and pull request templates

## Alternatives Considered
${getAlternativesConsidered(selectedPlatform)}

## Review Date
${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} (90 days from decision)

---
*This ADR was generated by CreateStack.dev on ${currentDate}*`
  }

  const generateDependencyADR = () => {
    const repoName = projectName.trim() || "my-project"
    const tool = dependencyTools.find(t => t.id === selectedDepTool)
    const currentDate = new Date().toISOString().split('T')[0]
    const adrNumber = "002" // Could be made dynamic based on existing ADRs
    
    return `# ADR-${adrNumber}: Dependency Management Tool Selection for ${repoName}

## Status
Accepted

## Date
${currentDate}

## Context
We need to select a dependency management tool for the ${repoName} project. This decision will impact our security posture, maintenance overhead, development workflow, and how we handle dependency updates and vulnerability management.

## Decision
We have decided to use **${tool?.name}** for dependency management.

## Rationale
### Tool Overview
${tool?.description}

### Key Benefits
- **Best suited for**: ${tool?.bestFor}
- **Platform compatibility**: ${tool?.platform}
- **Pricing model**: ${tool?.pricing}
- **Key features**: ${tool?.features.join(', ')}

### Technical Considerations
${getDependencyTechnicalConsiderations(selectedDepTool)}

## Consequences
### Positive
- ${getDependencyPositiveConsequences(selectedDepTool).join('\n- ')}

### Negative
- ${getDependencyNegativeConsequences(selectedDepTool).join('\n- ')}

### Neutral
- Documentation: ${getDependencyToolDocumentationUrl(selectedDepTool)}
- Implementation effort: ${getDependencyImplementationEffort(selectedDepTool)}
- Team training required: ${getDependencyTrainingRequirements(selectedDepTool)}

## Implementation Notes
1. ${getDependencyImplementationSteps(selectedDepTool).join('\n2. ')}

## Alternatives Considered
${getDependencyAlternativesConsidered(selectedDepTool)}

## Review Date
${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} (90 days from decision)

---
*This ADR was generated by CreateStack.dev on ${currentDate}*`
  }

  const getDependencyTechnicalConsiderations = (toolId: string) => {
    const considerations = {
      dependabot: `- Native GitHub integration with zero configuration overhead
- Automatic security vulnerability detection and patching
- Support for 20+ package ecosystems and languages
- Pull request-based workflow for dependency updates
- Configurable update schedules and grouping options`,
      renovate: `- Universal platform support (GitHub, GitLab, Bitbucket, Azure DevOps)
- Highly configurable with extensive customization options
- Support for 60+ package managers and ecosystems
- Advanced scheduling and grouping capabilities
- Self-hosted deployment option for enhanced control`,
      snyk: `- Security-first approach with comprehensive vulnerability database
- License compliance scanning and policy enforcement
- Container and infrastructure as code scanning
- IDE integrations for developer workflow integration
- Advanced reporting and analytics capabilities`,
      whitesource: `- Enterprise-grade compliance and risk management
- Support for 200+ programming languages and package managers
- Advanced license policy enforcement and legal compliance
- Risk scoring and prioritization algorithms
- Integration with enterprise security and compliance workflows`,
      "gitlab-deps": `- Native GitLab integration with built-in CI/CD pipeline support
- Security dashboard with merge request integration
- Automatic vulnerability detection in CI/CD pipelines
- Policy-based security gates and compliance controls
- Integration with GitLab's complete DevOps platform`,
      manual: `- Complete control over dependency update timing and process
- No automated changes or potential breaking updates
- Custom review and testing processes for each update
- Requires manual monitoring of security advisories
- Time-intensive but provides maximum oversight`
    }
    return considerations[toolId as keyof typeof considerations] || "Standard dependency management capabilities"
  }

  const getDependencyPositiveConsequences = (toolId: string) => {
    const positive = {
      dependabot: [
        "Zero configuration required for basic functionality",
        "Native GitHub integration ensures seamless workflow",
        "Automatic security vulnerability patching reduces risk",
        "Free for all GitHub repositories",
        "Well-documented and widely adopted"
      ],
      renovate: [
        "Platform-agnostic solution works across different Git hosts",
        "Highly customizable to fit complex project requirements",
        "Self-hosted option provides complete control and privacy",
        "Advanced scheduling prevents overwhelming pull requests",
        "Active open-source community and regular updates"
      ],
      snyk: [
        "Security-focused approach prioritizes vulnerability management",
        "Comprehensive license compliance reduces legal risks",
        "Developer-friendly IDE integrations catch issues early",
        "Detailed vulnerability intelligence and remediation guidance",
        "Enterprise-grade reporting and compliance features"
      ],
      whitesource: [
        "Enterprise-scale support for large organizations",
        "Comprehensive language and ecosystem coverage",
        "Advanced compliance and risk management capabilities",
        "Professional support and service level agreements",
        "Integration with enterprise security frameworks"
      ],
      "gitlab-deps": [
        "Native integration with GitLab's complete DevOps platform",
        "Built-in security dashboard and reporting",
        "Automatic integration with CI/CD pipelines",
        "Policy enforcement at the merge request level",
        "No additional tool licensing for GitLab users"
      ],
      manual: [
        "Complete control over update timing and testing",
        "No risk of automated breaking changes",
        "Custom review processes ensure quality",
        "No dependency on external tools or services",
        "Perfect understanding of all changes being made"
      ]
    }
    return positive[toolId as keyof typeof positive] || ["Tool-specific advantages"]
  }

  const getDependencyNegativeConsequences = (toolId: string) => {
    const negative = {
      dependabot: [
        "Limited to GitHub platform only",
        "Less configuration flexibility compared to alternatives",
        "Can generate many pull requests without careful configuration",
        "Limited support for complex monorepo scenarios",
        "Dependency on GitHub's service availability"
      ],
      renovate: [
        "Requires more initial configuration and setup time",
        "Can be overwhelming with extensive configuration options",
        "Self-hosted deployment requires infrastructure management",
        "Learning curve for advanced configuration features",
        "May require dedicated team member for optimal configuration"
      ],
      snyk: [
        "Commercial product with licensing costs for advanced features",
        "Can be noisy with many security alerts requiring triage",
        "Focus on security may miss functional dependency updates",
        "Requires integration setup across development tools",
        "May require security expertise to interpret results effectively"
      ],
      whitesource: [
        "Enterprise pricing may be prohibitive for smaller teams",
        "Complex setup and configuration for full feature utilization",
        "Requires dedicated compliance and security expertise",
        "May be overkill for simple projects or small teams",
        "Vendor lock-in with proprietary enterprise features"
      ],
      "gitlab-deps": [
        "Limited to GitLab platform and users",
        "Premium features require paid GitLab subscription",
        "Less extensive than dedicated dependency management tools",
        "Dependent on GitLab's roadmap and feature priorities",
        "May not cover all specialized package managers"
      ],
      manual: [
        "Significant time investment required for monitoring and updates",
        "High risk of missing critical security vulnerabilities",
        "Prone to human error and inconsistent processes",
        "Does not scale well with project or team growth",
        "May lead to outdated dependencies and technical debt"
      ]
    }
    return negative[toolId as keyof typeof negative] || ["Tool-specific limitations"]
  }

  const getDependencyImplementationEffort = (toolId: string) => {
    const effort = {
      dependabot: "Low - Enable in GitHub repository settings, optionally add .github/dependabot.yml",
      renovate: "Medium - Configure renovate.json and set up authentication",
      snyk: "Medium - Install CLI, configure integrations, set up policies",
      whitesource: "High - Enterprise deployment, policy configuration, training",
      "gitlab-deps": "Low - Enable in GitLab project settings and CI/CD pipeline",
      manual: "High - Establish processes, monitoring, and update procedures"
    }
    return effort[toolId as keyof typeof effort] || "Varies based on tool complexity"
  }

  const getDependencyTrainingRequirements = (toolId: string) => {
    const training = {
      dependabot: "Minimal - Basic understanding of pull request workflows",
      renovate: "Moderate - Configuration syntax and scheduling concepts",
      snyk: "Moderate - Security vulnerability assessment and remediation",
      whitesource: "Extensive - Enterprise compliance and policy management",
      "gitlab-deps": "Minimal - GitLab CI/CD and merge request workflows",
      manual: "Extensive - Security monitoring and update best practices"
    }
    return training[toolId as keyof typeof training] || "Standard tool-specific training"
  }

  const getDependencyImplementationSteps = (toolId: string) => {
    const steps = {
      dependabot: [
        "Enable Dependabot security updates in repository settings",
        "Create .github/dependabot.yml configuration file",
        "Configure update schedules and package ecosystems",
        "Set up branch protection rules for automated PRs",
        "Configure team notification preferences"
      ],
      renovate: [
        "Install Renovate app or configure self-hosted instance",
        "Create renovate.json configuration file",
        "Configure platform authentication and permissions",
        "Set up update schedules and grouping rules",
        "Configure branch protection and auto-merge policies"
      ],
      snyk: [
        "Sign up for Snyk account and install CLI tools",
        "Integrate with repository and CI/CD pipelines",
        "Configure vulnerability policies and thresholds",
        "Set up IDE integrations for developer workflows",
        "Establish security triage and remediation processes"
      ],
      whitesource: [
        "Deploy WhiteSource agents and configure organization settings",
        "Set up project scanning and policy enforcement",
        "Configure license compliance rules and approval workflows",
        "Integrate with enterprise security and compliance systems",
        "Train team on compliance reporting and risk management"
      ],
      "gitlab-deps": [
        "Enable dependency scanning in GitLab project settings",
        "Configure .gitlab-ci.yml to include dependency scanning jobs",
        "Set up security dashboard monitoring and alerts",
        "Configure merge request security policies",
        "Establish vulnerability triage and remediation workflows"
      ],
      manual: [
        "Establish dependency monitoring and tracking processes",
        "Create update schedules and responsibility assignments",
        "Set up security advisory monitoring systems",
        "Develop testing and validation procedures for updates",
        "Document update procedures and emergency response plans"
      ]
    }
    return steps[toolId as keyof typeof steps] || ["Configure tool according to documentation", "Set up monitoring and alerting", "Train team on tool usage", "Establish update and triage processes"]
  }

  const getDependencyAlternativesConsidered = (selectedToolId: string) => {
    const alternatives = dependencyTools
      .filter(t => t.id !== selectedToolId)
      .slice(0, 3) // Show top 3 alternatives
      .map(tool => `- **${tool.name}**: ${tool.description} Best for: ${tool.bestFor}`)
      .join('\n')
    
    return alternatives || "Other dependency management approaches were evaluated but deemed less suitable for this project's requirements."
  }

  const getEcosystemBenefits = (platformId: string) => {
    const benefits = {
      github: "Largest developer community, extensive third-party integrations, GitHub Actions for CI/CD",
      gitlab: "Built-in DevOps lifecycle tools, integrated CI/CD, container registry, security scanning",
      bitbucket: "Seamless Atlassian suite integration (Jira, Confluence), built-in CI/CD with Pipelines",
      azure: "Native Microsoft/Azure ecosystem integration, Azure DevOps services, enterprise features",
      codecommit: "AWS service integration, IAM-based access control, scalable and secure",
      sourcehut: "Minimal, privacy-focused, email-based workflows, no JavaScript dependencies",
      gitea: "Self-hosted control, lightweight resource usage, customizable to organization needs"
    }
    return benefits[platformId as keyof typeof benefits] || "Platform-specific integration benefits"
  }

  const getTeamFamiliarityNotes = (platformId: string) => {
    const notes = {
      github: "Most widely known platform among developers",
      gitlab: "Growing adoption, especially in enterprise environments",
      bitbucket: "Common in organizations already using Atlassian tools",
      azure: "Familiar to teams working with Microsoft technologies",
      codecommit: "Suitable for AWS-native development teams",
      sourcehut: "Appeals to developers preferring minimal, traditional workflows",
      gitea: "Requires self-hosting expertise but offers full control"
    }
    return notes[platformId as keyof typeof notes] || "Team will need to learn platform-specific features"
  }

  const getTechnicalConsiderations = (platformId: string) => {
    const considerations = {
      github: `- Git-based version control with web interface
- GitHub Actions for CI/CD automation
- API access for integrations
- Large file storage with Git LFS support
- Advanced security features (Dependabot, CodeQL)`,
      gitlab: `- Comprehensive DevOps platform beyond just Git hosting
- Built-in CI/CD with GitLab Runners
- Integrated container registry and package management
- Security and compliance features built-in
- Self-hosted options available`,
      bitbucket: `- Git and Mercurial support (though Mercurial is legacy)
- Bitbucket Pipelines for CI/CD
- Jira integration for issue tracking
- Code insights and quality gates
- Atlassian ecosystem synergy`,
      azure: `- Integrated with Azure DevOps services
- Azure Pipelines for CI/CD
- Azure Artifacts for package management
- Strong integration with Microsoft development tools
- Enterprise-grade security and compliance`,
      codecommit: `- Fully managed Git service by AWS
- Scales automatically with usage
- Integrated with AWS IAM for access control
- Pay-per-use pricing model
- Regional availability for compliance`,
      sourcehut: `- Email-based workflows (patches via email)
- Minimal web interface, focus on Git fundamentals
- No JavaScript required for basic operations
- Open-source and transparent development model
- Builds.sr.ht for CI/CD`,
      gitea: `- Self-hosted Git service with full control
- Lightweight and fast performance
- Customizable to organization needs
- API compatibility with other platforms
- Requires infrastructure management`
    }
    return considerations[platformId as keyof typeof considerations] || "Standard Git hosting capabilities with platform-specific features"
  }

  const getPositiveConsequences = (platformId: string) => {
    const positive = {
      github: [
        "Access to the largest developer community and ecosystem",
        "Extensive marketplace of actions and integrations",
        "Strong brand recognition for open-source projects",
        "Excellent documentation and learning resources"
      ],
      gitlab: [
        "Complete DevOps lifecycle in a single platform",
        "Built-in security scanning and compliance tools",
        "No need for multiple tool integrations",
        "Strong self-hosted options for enterprise needs"
      ],
      bitbucket: [
        "Seamless workflow with existing Atlassian tools",
        "Integrated project management through Jira",
        "Good CI/CD capabilities with Pipelines",
        "Familiar interface for Atlassian users"
      ],
      azure: [
        "Native integration with Microsoft development stack",
        "Enterprise-grade security and compliance features",
        "Unified Azure ecosystem for cloud-native development",
        "Strong Visual Studio and VS Code integration"
      ],
      codecommit: [
        "Tight integration with AWS services and IAM",
        "Automatic scaling without infrastructure management",
        "Pay-per-use pricing model",
        "Regional data residency options"
      ],
      sourcehut: [
        "Privacy-focused development environment",
        "Traditional, email-based Git workflows",
        "No JavaScript dependencies",
        "Transparent and open-source platform"
      ],
      gitea: [
        "Full control over hosting and customization",
        "Lightweight resource requirements",
        "No vendor lock-in",
        "Cost-effective for large teams"
      ]
    }
    return positive[platformId as keyof typeof positive] || ["Platform-specific advantages"]
  }

  const getNegativeConsequences = (platformId: string) => {
    const negative = {
      github: [
        "Potential vendor lock-in with platform-specific features",
        "Limited self-hosting options",
        "Can be expensive for large private repositories",
        "Subject to Microsoft's strategic decisions"
      ],
      gitlab: [
        "Can be complex for simple use cases",
        "Requires learning GitLab-specific workflows",
        "Self-hosted version requires infrastructure expertise",
        "Less third-party ecosystem compared to GitHub"
      ],
      bitbucket: [
        "Smaller community compared to GitHub",
        "Limited marketplace of integrations",
        "Tied to Atlassian ecosystem decisions",
        "Less suitable for open-source community projects"
      ],
      azure: [
        "Requires familiarity with Microsoft ecosystem",
        "Can be complex for non-Microsoft stack projects",
        "Learning curve for Azure DevOps concepts",
        "Pricing can be complex to understand"
      ],
      codecommit: [
        "AWS-specific, less suitable for multi-cloud strategies",
        "Limited community features",
        "No built-in project management tools",
        "Requires AWS account and billing setup"
      ],
      sourcehut: [
        "Minimal web interface may not suit all users",
        "Email-based workflows require adaptation",
        "Smaller community and ecosystem",
        "Limited third-party integrations"
      ],
      gitea: [
        "Requires self-hosting infrastructure and maintenance",
        "Team needs expertise in server management",
        "Responsibility for security updates and backups",
        "May lack some advanced features of hosted solutions"
      ]
    }
    return negative[platformId as keyof typeof negative] || ["Platform-specific limitations"]
  }

  const getCIGuidance = (platformId: string) => {
    const guidance = {
      github: "(GitHub Actions recommended)",
      gitlab: "(GitLab CI/CD built-in)",
      bitbucket: "(Bitbucket Pipelines available)",
      azure: "(Azure Pipelines integration)",
      codecommit: "(integrate with AWS CodeBuild/CodePipeline)",
      sourcehut: "(builds.sr.ht for CI builds)",
      gitea: "(external CI/CD tools like Jenkins, GitLab CI, or GitHub Actions)"
    }
    return guidance[platformId as keyof typeof guidance] || "(configure appropriate CI/CD solution)"
  }

  const getAlternativesConsidered = (selectedPlatformId: string) => {
    const alternatives = platforms
      .filter(p => p.id !== selectedPlatformId)
      .slice(0, 3) // Show top 3 alternatives
      .map(platform => `- **${platform.name}**: ${platform.description} Best for: ${platform.bestFor}`)
      .join('\n')
    
    return alternatives || "Other major Git hosting platforms were evaluated but deemed less suitable for this project's requirements."
  }

  const generateVendorComparison = () => {
    const platform = platforms.find(p => p.id === selectedPlatform)
    const repoName = projectName.trim() || "my-project"
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Get detailed vendor information for the selected platform
    const vendorDetails = getVendorDetails(selectedPlatform)
    
    // Generate single row entry with universal vendor evaluation criteria
    const vendorRow = [
      vendorDetails.vendorName,
      vendorDetails.company,
      vendorDetails.productService,
      vendorDetails.pricingModel,
      vendorDetails.contractTerms,
      vendorDetails.supportSLA,
      vendorDetails.compliance,
      vendorDetails.dataResidency,
      vendorDetails.businessStability,
      vendorDetails.marketPosition,
      vendorDetails.integrationCapability,
      vendorDetails.scalability,
      vendorDetails.securityCertifications,
      vendorDetails.references,
      repoName,
      currentDate,
      "Under Evaluation"
    ].join('\t')
    
    return `${vendorRow}

# Vendor Entry Details for ${platform?.name}
Project: ${repoName}
Evaluation Date: ${currentDate}
Status: Under evaluation

# Instructions:
1. Copy the tab-separated row above
2. Paste into your vendor evaluation spreadsheet
3. The row includes: Vendor Name, Company, Product/Service, Pricing Model, Contract Terms, Support SLA, Compliance, Data Residency, Business Stability, Market Position, Integration Capability, Scalability, Security Certifications, References, Project Name, Evaluation Date, Status

# Compliance Summary for ${platform?.name}:
${getComplianceDetails(selectedPlatform)}`
  }

  const getVendorDetails = (platformId: string) => {
    const details = {
      github: {
        vendorName: "GitHub",
        company: "Microsoft Corporation",
        productService: "Cloud-based code repository and development platform",
        pricingModel: "Freemium: Free tier available, Pro ($4/user/month), Team ($4/user/month), Enterprise ($21/user/month)",
        contractTerms: "Monthly/Annual subscriptions, Enterprise custom agreements, 30-day free trial",
        supportSLA: "24/7 for Enterprise, Business hours for Pro/Team, Community for Free",
        compliance: "SOC 2, ISO 27001, PCI DSS, GDPR, Privacy Shield",
        dataResidency: "Primary: United States, Available: European Union",
        businessStability: "Acquired by Microsoft (2018), Stable revenue, 100M+ users",
        marketPosition: "Market leader in code hosting, Strong developer mindshare",
        integrationCapability: "Extensive API, 10,000+ marketplace integrations, Webhooks",
        scalability: "Handles enterprise scale, Unlimited repositories, Auto-scaling infrastructure",
        securityCertifications: "SOC 2 Type II, ISO 27001, Regular security audits",
        references: "Microsoft, Netflix, Spotify, Shopify (public case studies available)"
      },
      gitlab: {
        vendorName: "GitLab",
        company: "GitLab Inc.",
        productService: "Complete DevOps platform with source code management",
        pricingModel: "Freemium: Free tier available, Premium ($19/user/month), Ultimate ($99/user/month)",
        contractTerms: "Monthly/Annual subscriptions, Custom enterprise terms, Self-hosted licensing",
        supportSLA: "24/7 for Ultimate, Business hours for Premium, Community for Free",
        compliance: "SOC 2, ISO 27001, FedRAMP, GDPR, Cloud Security Alliance STAR",
        dataResidency: "Multiple global regions, Self-hosted deployment option",
        businessStability: "Public company (NASDAQ: GTLB), Growing revenue, 30M+ users",
        marketPosition: "Strong competitor in DevOps space, Enterprise focus",
        integrationCapability: "REST/GraphQL APIs, Built-in DevOps tools, Third-party integrations",
        scalability: "Enterprise-grade scaling, Self-hosted options, Performance monitoring",
        securityCertifications: "SOC 2 Type II, ISO 27001, FedRAMP ATO",
        references: "CERN, Goldman Sachs, Ticketmaster (case studies available)"
      },
      bitbucket: {
        vendorName: "Bitbucket",
        company: "Atlassian Corporation",
        productService: "Code repository with integrated CI/CD and project management",
        pricingModel: "Freemium: Free (5 users), Standard ($3/user/month), Premium ($6/user/month)",
        contractTerms: "Monthly/Annual subscriptions, Data Center perpetual licensing",
        supportSLA: "24/7 for Premium, Business hours for Standard, Community for Free",
        compliance: "SOC 2, ISO 27001, GDPR, Privacy Shield",
        dataResidency: "United States, European Union, Australia",
        businessStability: "Part of Atlassian (NASDAQ: TEAM), Stable revenue, 10M+ users",
        marketPosition: "Strong in enterprise with Atlassian ecosystem integration",
        integrationCapability: "REST API, Native Atlassian suite integration, Marketplace apps",
        scalability: "Enterprise scaling with Data Center, Performance monitoring",
        securityCertifications: "SOC 2 Type II, ISO 27001, Regular assessments",
        references: "NASA, Mercedes-Benz, Visa (Atlassian customer references)"
      },
      azure: {
        vendorName: "Azure DevOps",
        company: "Microsoft Corporation",
        productService: "Cloud development services including source control and CI/CD",
        pricingModel: "Freemium: Basic (Free), Basic + Test Plans ($52/user/month), Visual Studio subscriptions",
        contractTerms: "Monthly/Annual, Enterprise agreements, Government contracts available",
        supportSLA: "24/7 for paid plans, Enterprise support available, Community for Basic",
        compliance: "SOC 1/2/3, ISO 27001/27017/27018, FedRAMP High, HIPAA, GDPR",
        dataResidency: "Global Azure regions, Government cloud options",
        businessStability: "Microsoft Corporation, Fortune 500, Extensive cloud revenue",
        marketPosition: "Strong in enterprise Microsoft environments, Growing cloud market",
        integrationCapability: "Azure ecosystem native, REST APIs, Visual Studio integration",
        scalability: "Global Azure infrastructure, Auto-scaling, Enterprise SLAs",
        securityCertifications: "90+ compliance offerings, Continuous security monitoring",
        references: "Progressive Insurance, H&R Block, GE Healthcare"
      },
      codecommit: {
        vendorName: "AWS CodeCommit",
        company: "Amazon Web Services",
        productService: "Managed Git repository service",
        pricingModel: "Pay-per-use: Free tier (5 users), $1/active user/month beyond free tier",
        contractTerms: "Pay-as-you-go, Enterprise discount programs, Government agreements",
        supportSLA: "Varies by AWS Support plan (Basic to Enterprise)",
        compliance: "SOC 1/2/3, PCI DSS, ISO 27001, FedRAMP, HIPAA eligible, GDPR",
        dataResidency: "All AWS regions globally, Government cloud available",
        businessStability: "Amazon.com Inc., Fortune 500, Leading cloud provider",
        marketPosition: "Part of largest cloud platform, Strong enterprise adoption",
        integrationCapability: "Native AWS services integration, SDK/CLI, REST API",
        scalability: "AWS global infrastructure, Auto-scaling, Enterprise support",
        securityCertifications: "Comprehensive AWS compliance framework, Regular audits",
        references: "Netflix, Airbnb, Samsung (AWS customer case studies)"
      },
      sourcehut: {
        vendorName: "SourceHut",
        company: "SourceHut",
        productService: "Minimalist software development platform",
        pricingModel: "Donation-based: Free tier, Paid support ($20-100/year)",
        contractTerms: "No formal contracts, Donation-based model, Open source",
        supportSLA: "Community support, Email for paid users, No formal SLA",
        compliance: "GDPR compliant, Privacy-focused, Minimal data collection",
        dataResidency: "EU/US options, Self-hosted available",
        businessStability: "Small independent company, Community-supported",
        marketPosition: "Niche market, Privacy-focused developers",
        integrationCapability: "REST API, Email-based workflows, Minimal integrations",
        scalability: "Small to medium scale, Self-hosted scaling",
        securityCertifications: "Open source transparency, Community security review",
        references: "Open source projects, Privacy-conscious organizations"
      },
      gitea: {
        vendorName: "Gitea",
        company: "Community-driven/Various hosting providers",
        productService: "Self-hosted Git service platform",
        pricingModel: "Open source: Free self-hosted, Hosted options vary by provider",
        contractTerms: "MIT License for software, Commercial hosting terms vary",
        supportSLA: "Community support, Commercial support available from providers",
        compliance: "Configurable based on deployment, Full control for compliance",
        dataResidency: "Full control with self-hosting options",
        businessStability: "Open source project, Multiple commercial providers",
        marketPosition: "Growing self-hosted alternative, Cost-effective solution",
        integrationCapability: "GitHub-compatible API, Community plugins, Customizable",
        scalability: "Depends on infrastructure, Self-managed scaling",
        securityCertifications: "Open source security model, Third-party audits available",
        references: "Organizations requiring self-hosted solutions, Cost-conscious enterprises"
      }
    }
    
    return details[platformId as keyof typeof details] || details.github
  }

  const getComplianceDetails = (platformId: string) => {
    const compliance = {
      github: `• SOC 2 Type II certified
• ISO 27001:2013 certified  
• PCI DSS compliant for payment processing
• GDPR compliant with EU data processing
• Privacy Shield certified (US-EU data transfers)
• Data residency: Primary in US, EU availability
• Regular third-party security audits
• Incident response and breach notification procedures`,
      gitlab: `• SOC 2 Type II certified
• ISO 27001:2013 certified
• FedRAMP Authority to Operate (ATO)
• GDPR compliant with EU data protection
• Cloud Security Alliance (CSA) STAR Level 1
• Data residency: US, EU, Self-hosted options
• Dedicated compliance team and documentation
• Audit trail and compliance reporting features`,
      bitbucket: `• SOC 2 Type II certified
• ISO 27001:2013 certified
• GDPR compliant with data protection
• Privacy Shield certified
• Data residency: US, EU, Australia
• Atlassian Trust Center for compliance documentation
• Regular security assessments and penetration testing
• Compliance integration with other Atlassian tools`,
      azure: `• SOC 1/2/3 certified
• ISO 27001, 27017, 27018 certified
• FedRAMP High authorization
• HIPAA/HITECH compliant (with BAA)
• GDPR compliant with EU data residency
• Government cloud options (Azure Government)
• Extensive compliance portfolio (90+ certifications)
• Built-in compliance tools and reporting`,
      codecommit: `• SOC 1/2/3 certified
• ISO 27001, 27017, 27018 certified
• FedRAMP High and Moderate authorized
• PCI DSS Level 1 certified
• HIPAA eligible with BAA
• GDPR compliant with EU regions
• Government cloud (AWS GovCloud)
• Comprehensive AWS compliance framework`,
      sourcehut: `• Privacy-focused by design
• GDPR compliant with minimal data collection
• No tracking or analytics by default
• Self-hosted option for complete data control
• Open source transparency
• Email-based workflows for audit trails
• Minimal data retention policies
• Community-driven security model`,
      gitea: `• Compliance depends on deployment configuration
• Self-hosted provides complete data control
• Can be configured for GDPR compliance
• Audit logging available
• Open source for security transparency
• Customizable security policies
• Data residency fully controlled by organization
• Third-party security audits possible with commercial support`
    }
    
    return compliance[platformId as keyof typeof compliance] || "Compliance details vary by deployment"
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Code copied to clipboard!")
    })
  }

  const clearSavedDataAction = (
    <Button 
      variant="default"
      onClick={clearSavedData}
      className="flex items-center space-x-2"
      disabled={!isReady}
    >
      <span>+</span>
      <span>New Project</span>
    </Button>
  )

  if (error) {
    return (
      <AppLayout 
        title="Project" 
        description="Database Error"
      >
        <div className="text-center py-8">
          <p className="text-red-600">Failed to initialize database: {error}</p>
          <p className="text-sm text-muted-foreground mt-2">Please refresh the page to try again.</p>
        </div>
      </AppLayout>
    )
  }

  if (!isReady) {
    return (
      <AppLayout 
        title="Project" 
        description="Loading..."
      >
        <div className="text-center py-8">
          <p>Initializing database...</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout 
      title="Project" 
      description="Welcome back! Here's what's happening."
      headerActions={clearSavedDataAction}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Code Hosting Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">{platforms.find(p => p.id === selectedPlatform)?.emoji}</span>
              <span>Code Hosting</span>
              {isSaving && (
                <div className="flex items-center space-x-1 ml-auto">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  <span className="text-xs text-muted-foreground font-normal">Saving...</span>
                </div>
              )}
            </CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>Create a new repository for your project on your preferred platform</span>
                  {(projectName.trim() || selectedPlatform !== "github") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSavedData}
                      className="text-xs h-6 px-2"
                    >
                      Clear All
                    </Button>
                  )}
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
                
                {/* ADR Section */}
                {projectName.trim() && (
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">📝 Architecture Decision Record</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generateADR())}
                      >
                        Copy ADR
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Document your code hosting platform decision for future reference
                    </p>
                  </div>
                )}

                {/* Vendor Comparison Section */}
                {projectName.trim() && (
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">📊 Vendor Entry</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generateVendorComparison())}
                      >
                        Copy Vendor Row
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Single vendor entry ready for your evaluation spreadsheet
                    </p>
                  </div>
                )}

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
                        <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                          <pre className="p-3 text-xs">
                            <code>{generateTerraformCode()}</code>
                          </pre>
                        </ScrollArea>
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
                        <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                          <pre className="p-3 text-xs">
                            <code>{generatePulumiCode()}</code>
                          </pre>
                        </ScrollArea>
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
                        <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                          <pre className="p-3 text-xs">
                            <code>{generateCDKCode()}</code>
                          </pre>
                        </ScrollArea>
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
                        <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                          <pre className="p-3 text-xs">
                            <code>{generateCloudFormationCode()}</code>
                          </pre>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>

        {/* Dependencies Management Card */}
        <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-xl">{dependencyTools.find(t => t.id === selectedDepTool)?.emoji}</span>
                  <span>Dependencies Management</span>
                  {isSaving && (
                    <div className="flex items-center space-x-1 ml-auto">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      <span className="text-xs text-muted-foreground font-normal">Saving...</span>
                    </div>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>Manage your project dependencies and automate updates</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSavedData}
                    className="text-xs h-6 px-2"
                  >
                    Clear All
                  </Button>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="dep-tool-select" className="text-sm font-medium">
                    Dependency Tool
                  </label>
                  <Select value={selectedDepTool} onValueChange={setSelectedDepTool}>
                    <SelectTrigger id="dep-tool-select">
                      <SelectValue placeholder="Select a dependency tool" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableDependencyTools().map((tool) => (
                        <SelectItem key={tool.id} value={tool.id}>
                          <div className="flex items-center space-x-2">
                            <span>{tool.emoji}</span>
                            <span>{tool.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Tool Info */}
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium mb-1 flex items-center space-x-2">
                    <span>{dependencyTools.find(t => t.id === selectedDepTool)?.emoji}</span>
                    <span>{dependencyTools.find(t => t.id === selectedDepTool)?.name}</span>
                  </h4>
                  <p className="text-xs text-muted-foreground mb-1">
                    {dependencyTools.find(t => t.id === selectedDepTool)?.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Best for:</strong> {dependencyTools.find(t => t.id === selectedDepTool)?.bestFor}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    className="flex items-center space-x-2"
                    disabled={!projectName.trim()}
                    onClick={handleConfigureTool}
                  >
                    <span>{dependencyTools.find(t => t.id === selectedDepTool)?.emoji}</span>
                    <span>Configure Tool</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* ADR Section */}
                {projectName.trim() && (
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">📝 Architecture Decision Record</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generateDependencyADR())}
                      >
                        Copy ADR
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Document your dependencies management decision for future reference
                    </p>
                  </div>
                )}

                {/* Vendor Comparison Section */}
                {projectName.trim() && (
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">📊 Vendor Entry</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generateVendorComparison())}
                      >
                        Copy Vendor Row
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Single vendor entry ready for your evaluation spreadsheet
                    </p>
                  </div>
                )}

                {/* Configuration as Code Section */}
                {showIaC && projectName.trim() && (
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="text-sm font-medium">Configuration as Code Templates</h4>
                    
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
                        <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                          <pre className="p-3 text-xs">
                            <code>{generateTerraformCode()}</code>
                          </pre>
                        </ScrollArea>
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
                        <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                          <pre className="p-3 text-xs">
                            <code>{generatePulumiCode()}</code>
                          </pre>
                        </ScrollArea>
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
                        <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                          <pre className="p-3 text-xs">
                            <code>{generateCDKCode()}</code>
                          </pre>
                        </ScrollArea>
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
                        <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                          <pre className="p-3 text-xs">
                            <code>{generateCloudFormationCode()}</code>
                          </pre>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>
      </div>
    </AppLayout>
  )
}
