import type { Platform } from "~/types/project";

export const generateTerraformCode = (projectName: string, selectedPlatform: string): string => {
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
};

export const generatePulumiCode = (projectName: string, platforms: Platform[], selectedPlatform: string): string => {
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
};

export const generateCloudFormationCode = (projectName: string): string => {
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
};

export const generateCDKCode = (projectName: string, selectedPlatform: string, platforms: Platform[]): string => {
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
};
