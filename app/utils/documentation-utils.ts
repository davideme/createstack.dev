import type { DocumentationTool } from "~/types/project";

export const getDocumentationTechnicalConsiderations = (toolId: string): string => {
  const considerations = {
    "github-wiki": `- Native GitHub integration with zero configuration overhead
- Git-based storage ensures version control for documentation
- Markdown support for easy formatting and cross-platform compatibility
- Collaborative editing with GitHub's permission system
- Automatic linking and cross-referencing capabilities`,
    "gitlab-wiki": `- Native GitLab integration with CI/CD pipeline support
- Support for both Markdown and AsciiDoc formats
- Git-based storage with full version history
- Access controls integrated with GitLab's permission system
- Automated documentation deployment options`,
    readme: `- Universal compatibility across all Git platforms
- Version controlled alongside source code
- Automatic rendering on repository home pages
- Simple markdown syntax for quick documentation
- No additional setup or configuration required`,
    gitbook: `- Modern, professional documentation interface
- Git synchronization for version-controlled content
- Collaborative editing with real-time updates
- API documentation generation capabilities
- Advanced search and navigation features`,
    notion: `- All-in-one workspace combining docs, databases, and planning
- Block-based editor with rich content types
- Real-time collaboration and commenting features
- Template system for consistent documentation structure
- Integration capabilities with other productivity tools`,
    confluence: `- Enterprise-grade documentation platform
- Rich text editor with advanced formatting options
- Deep integration with Jira and other Atlassian tools
- Advanced permission and space management
- Powerful search and content discovery features`,
    mkdocs: `- Static site generation for fast, reliable documentation
- Markdown-based authoring with theme customization
- Plugin ecosystem for extended functionality
- Easy deployment to GitHub Pages or other hosting
- Offline documentation access capabilities`,
    docusaurus: `- React-based platform optimized for developer documentation
- Built-in versioning and internationalization support
- Integrated blog functionality for announcements
- Optimized for performance and SEO
- Extensive customization and theming options`,
    gitiles: `- Lightweight Git repository browser with markdown rendering
- Fast performance with minimal resource requirements
- Simple setup and maintenance overhead
- Google-proven technology stack
- Clean, minimalist interface for code and documentation`,
    bookstack: `- Self-hosted solution for complete data control
- WYSIWYG editor for non-technical team members
- Hierarchical organization with books, chapters, and pages
- User management and permission controls
- Full-text search across all documentation`
  }
  return considerations[toolId as keyof typeof considerations] || "Standard documentation platform capabilities"
};

export const getDocumentationPositiveConsequences = (toolId: string): string[] => {
  const positive = {
    "github-wiki": [
      "Zero setup required for GitHub repositories",
      "Native integration ensures seamless developer workflow",
      "Version controlled documentation alongside code",
      "Free for all GitHub repositories",
      "Familiar interface for GitHub users"
    ],
    "gitlab-wiki": [
      "Native GitLab integration with CI/CD capabilities",
      "Support for multiple markup formats",
      "Access controls aligned with project permissions",
      "Free for all GitLab repositories",
      "Automated documentation workflows possible"
    ],
    readme: [
      "Universal compatibility across all platforms",
      "Always visible on repository landing page",
      "Version controlled with source code",
      "Zero additional infrastructure required",
      "Quick to create and maintain"
    ],
    gitbook: [
      "Professional, modern documentation appearance",
      "Real-time collaboration capabilities",
      "Git synchronization for developer workflows",
      "API documentation generation features",
      "Advanced search and navigation"
    ],
    notion: [
      "All-in-one workspace reduces tool fragmentation",
      "Flexible block-based content creation",
      "Real-time collaboration and updates",
      "Template system for consistency",
      "Integration with productivity workflows"
    ],
    confluence: [
      "Enterprise-grade features and reliability",
      "Deep Atlassian ecosystem integration",
      "Advanced permission and governance controls",
      "Rich content creation capabilities",
      "Powerful search and discovery features"
    ],
    mkdocs: [
      "Static sites provide fast, reliable access",
      "Easy deployment to various hosting platforms",
      "Customizable themes and appearance",
      "Plugin ecosystem for extended functionality",
      "Offline documentation access"
    ],
    docusaurus: [
      "Optimized for developer and open source documentation",
      "Built-in versioning and internationalization",
      "Excellent performance and SEO optimization",
      "React-based customization capabilities",
      "Integrated blog for project updates"
    ],
    gitiles: [
      "Minimal resource requirements and setup",
      "Fast performance for large repositories",
      "Google-proven reliability and stability",
      "Clean, distraction-free interface",
      "Simple markdown rendering"
    ],
    bookstack: [
      "Complete control over data and hosting",
      "User-friendly WYSIWYG editor",
      "Hierarchical content organization",
      "Granular user permissions",
      "Full-text search capabilities"
    ]
  }
  return positive[toolId as keyof typeof positive] || ["Standard documentation benefits"]
};

export const getDocumentationNegativeConsequences = (toolId: string): string[] => {
  const negative = {
    "github-wiki": [
      "Limited to basic markdown formatting",
      "No advanced features like versioning UI",
      "Requires GitHub account for all contributors",
      "Limited customization options",
      "No built-in analytics or metrics"
    ],
    "gitlab-wiki": [
      "Limited to GitLab ecosystem",
      "Requires GitLab account for all contributors",
      "Less mature than dedicated documentation platforms",
      "Limited theme and customization options",
      "No advanced analytics features"
    ],
    readme: [
      "Limited to single-page documentation",
      "No advanced navigation or search features",
      "Basic markdown formatting only",
      "Can become unwieldy for large projects",
      "No collaborative editing features"
    ],
    gitbook: [
      "Subscription cost for advanced features",
      "Dependency on external service availability",
      "Limited offline editing capabilities",
      "Learning curve for advanced features",
      "Potential vendor lock-in concerns"
    ],
    notion: [
      "Subscription cost for team features",
      "Not specifically designed for technical documentation",
      "Limited code syntax highlighting",
      "Potential performance issues with large content",
      "Dependency on external service"
    ],
    confluence: [
      "Higher subscription costs for enterprise features",
      "Complexity can be overwhelming for simple needs",
      "Requires training for non-technical users",
      "Performance can degrade with large content volumes",
      "Vendor lock-in with Atlassian ecosystem"
    ],
    mkdocs: [
      "Requires technical setup and maintenance",
      "Static nature limits dynamic content",
      "No built-in collaborative editing",
      "Requires separate hosting infrastructure",
      "Technical knowledge needed for customization"
    ],
    docusaurus: [
      "Requires React/JavaScript knowledge for customization",
      "Static site limitations for dynamic content",
      "Initial setup complexity for non-developers",
      "Requires hosting infrastructure",
      "Facebook/Meta dependency concerns"
    ],
    gitiles: [
      "Very basic feature set",
      "Limited formatting and styling options",
      "No collaborative editing features",
      "Requires technical setup and maintenance",
      "No built-in search or navigation aids"
    ],
    bookstack: [
      "Requires self-hosting infrastructure",
      "Security and maintenance responsibility",
      "Limited integration with external tools",
      "Requires technical expertise for setup",
      "No built-in version control for content"
    ]
  }
  return negative[toolId as keyof typeof negative] || ["Standard documentation limitations"]
};

export const getDocumentationImplementationEffort = (toolId: string): string => {
  const efforts = {
    "github-wiki": "Low - Enable wiki in repository settings",
    "gitlab-wiki": "Low - Enable wiki in project settings",
    readme: "Minimal - Create README.md file in repository",
    gitbook: "Medium - Account setup and Git integration configuration",
    notion: "Medium - Workspace setup and permission configuration",
    confluence: "Medium - Space setup and user management configuration",
    mkdocs: "High - Site setup, theme configuration, and hosting deployment",
    docusaurus: "High - Project initialization, customization, and hosting setup",
    gitiles: "High - Server setup and configuration",
    bookstack: "High - Self-hosting setup, database configuration, and user management"
  }
  return efforts[toolId as keyof typeof efforts] || "Medium - Standard platform setup required"
};

export const getDocumentationTrainingRequirements = (toolId: string): string => {
  const training = {
    "github-wiki": "Minimal - Basic markdown knowledge",
    "gitlab-wiki": "Minimal - Markdown/AsciiDoc syntax",
    readme: "Minimal - Basic markdown syntax",
    gitbook: "Low - Platform-specific editor training",
    notion: "Medium - Block-based editor and workspace concepts",
    confluence: "Medium - Rich editor and space management",
    mkdocs: "High - Static site concepts and configuration",
    docusaurus: "High - React concepts and documentation framework",
    gitiles: "Low - Basic Git and markdown knowledge",
    bookstack: "Low - WYSIWYG editor and organization concepts"
  }
  return training[toolId as keyof typeof training] || "Medium - Platform-specific training needed"
};

export const getDocumentationImplementationSteps = (toolId: string): string[] => {
  const steps = {
    "github-wiki": [
      "Navigate to repository Settings",
      "Enable Wiki feature in repository settings",
      "Create initial wiki page with project overview",
      "Set up wiki structure and navigation",
      "Add content and establish editing guidelines"
    ],
    "gitlab-wiki": [
      "Navigate to project Settings > General > Visibility",
      "Enable Wiki feature for the project",
      "Create initial wiki page with project documentation",
      "Configure CI/CD for automated documentation updates",
      "Establish content structure and contribution guidelines"
    ],
    readme: [
      "Create README.md file in repository root",
      "Add project description and getting started guide",
      "Include installation and usage instructions",
      "Add contribution guidelines and contact information",
      "Keep content updated with project changes"
    ],
    gitbook: [
      "Create GitBook account and organization",
      "Connect GitBook to Git repository",
      "Configure synchronization settings",
      "Set up space structure and initial content",
      "Configure team access and permissions"
    ],
    notion: [
      "Create Notion workspace or use existing one",
      "Set up documentation space with template structure",
      "Configure team access and permissions",
      "Create initial pages and content hierarchy",
      "Establish content guidelines and maintenance processes"
    ],
    confluence: [
      "Set up Confluence space for project documentation",
      "Configure space permissions and user access",
      "Create page templates for consistent documentation",
      "Set up initial content structure and navigation",
      "Integrate with Jira if using Atlassian ecosystem"
    ],
    mkdocs: [
      "Install MkDocs and choose theme",
      "Configure mkdocs.yml with site structure",
      "Create initial markdown documentation files",
      "Set up deployment pipeline (GitHub Pages, etc.)",
      "Configure search and navigation features"
    ],
    docusaurus: [
      "Initialize Docusaurus project with npx",
      "Configure docusaurus.config.js for project needs",
      "Set up documentation structure and navigation",
      "Configure deployment to hosting platform",
      "Customize theme and add project branding"
    ],
    gitiles: [
      "Set up Gitiles server infrastructure",
      "Configure repository access and permissions",
      "Set up markdown rendering configuration",
      "Configure web server and security settings",
      "Test documentation rendering and access"
    ],
    bookstack: [
      "Set up BookStack server and database",
      "Configure web server (Apache/Nginx) and PHP",
      "Create initial admin account and configure settings",
      "Set up user accounts and permission groups",
      "Create initial book structure and content organization"
    ]
  }
  return steps[toolId as keyof typeof steps] || ["Configure documentation platform", "Set up initial content structure", "Configure team access", "Establish content guidelines"]
};

export const getDocumentationAlternativesConsidered = (selectedToolId: string, documentationTools: DocumentationTool[]): string => {
  const otherTools = documentationTools.filter(tool => tool.id !== selectedToolId);
  
  if (otherTools.length === 0) {
    return "No alternative documentation tools were evaluated.";
  }
  
  const alternatives = otherTools.slice(0, 3).map(tool => {
    const reason = getAlternativeRejectionReason(selectedToolId, tool.id);
    return `- **${tool.name}**: ${tool.description.split('.')[0]}. ${reason}`;
  });
  
  return alternatives.join('\n');
};

const getAlternativeRejectionReason = (selectedId: string, alternativeId: string): string => {
  const reasons: Record<string, Record<string, string>> = {
    "github-wiki": {
      "gitlab-wiki": "Not compatible with GitHub repositories",
      readme: "Limited to single-page documentation, less suitable for comprehensive docs",
      gitbook: "Additional cost and complexity not justified for simple project needs",
      notion: "Not optimized for technical documentation workflows",
      confluence: "Too expensive and complex for small team needs"
    },
    "gitlab-wiki": {
      "github-wiki": "Project hosted on GitLab, not GitHub",
      readme: "Need multi-page documentation capabilities",
      gitbook: "Prefer native GitLab integration over external service",
      notion: "Not optimized for technical documentation workflows",
      confluence: "Too expensive for small team requirements"
    },
    readme: {
      "github-wiki": "Prefer single-file simplicity over wiki complexity",
      "gitlab-wiki": "Prefer single-file simplicity over wiki complexity",
      gitbook: "Project too simple to justify external documentation platform",
      notion: "Prefer keeping documentation in repository with code",
      confluence: "Too expensive and complex for simple project needs"
    },
    gitbook: {
      "github-wiki": "Need professional appearance and advanced features",
      readme: "Require multi-page documentation with advanced features",
      notion: "Need documentation-specific features and Git integration",
      confluence: "Prefer standalone solution over Atlassian ecosystem dependency",
      mkdocs: "Prefer hosted solution over self-managed static site"
    }
  };
  
  return reasons[selectedId]?.[alternativeId] || "Did not meet specific project requirements";
};
