import type { VendorDetails, Platform, DependencyTool, DocumentationTool, CICDTool, IssueTrackingTool, FeatureFlagTool } from "~/types/project";

export const getVendorDetails = (platformId: string): VendorDetails => {
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
};

export const getDependencyVendorDetails = (toolId: string): VendorDetails => {
  const details = {
    dependabot: {
      vendorName: "Dependabot",
      company: "Microsoft Corporation (GitHub)",
      productService: "Automated Dependency Updates",
      pricingModel: "Free with GitHub",
      contractTerms: "GitHub Terms of Service",
      supportSLA: "Community + GitHub Support",
      compliance: "SOC 2, ISO 27001, GDPR",
      dataResidency: "Global (GitHub infrastructure)",
      businessStability: "High (Microsoft-backed)",
      marketPosition: "Leading (GitHub integration)",
      integrationCapability: "Excellent (native GitHub)",
      scalability: "Excellent",
      securityCertifications: "SOC 2, ISO 27001",
      references: "github.com/dependabot"
    },
    renovate: {
      vendorName: "Renovate",
      company: "Mend.io (formerly WhiteSource)",
      productService: "Universal Dependency Updates",
      pricingModel: "Free (self-hosted) / SaaS plans",
      contractTerms: "OSS license / Commercial terms",
      supportSLA: "Community / Commercial support",
      compliance: "SOC 2, GDPR compliant",
      dataResidency: "Configurable / EU/US options",
      businessStability: "High (Mend.io backing)",
      marketPosition: "Strong (multi-platform)",
      integrationCapability: "Excellent (60+ platforms)",
      scalability: "Excellent",
      securityCertifications: "SOC 2, ISO 27001",
      references: "renovatebot.com"
    },
    snyk: {
      vendorName: "Snyk",
      company: "Snyk Ltd",
      productService: "Security-focused Dependency Scanning",
      pricingModel: "Freemium / Pro from $25/month",
      contractTerms: "Standard SaaS / Enterprise",
      supportSLA: "Tiered support (Free/Pro/Enterprise)",
      compliance: "SOC 2, ISO 27001, GDPR",
      dataResidency: "Multi-region options",
      businessStability: "High (well-funded startup)",
      marketPosition: "Leading (security focus)",
      integrationCapability: "Excellent (CI/CD + IDEs)",
      scalability: "Excellent",
      securityCertifications: "SOC 2, ISO 27001",
      references: "snyk.io"
    },
    whitesource: {
      vendorName: "Mend",
      company: "Mend.io (formerly WhiteSource)",
      productService: "Enterprise Dependency Management",
      pricingModel: "Enterprise pricing (contact sales)",
      contractTerms: "Enterprise license agreements",
      supportSLA: "Enterprise support included",
      compliance: "SOC 2, ISO 27001, GDPR, HIPAA",
      dataResidency: "Multi-region / on-premise",
      businessStability: "High (established enterprise)",
      marketPosition: "Leading (enterprise segment)",
      integrationCapability: "Excellent (200+ languages)",
      scalability: "Enterprise-grade",
      securityCertifications: "SOC 2, ISO 27001, FedRAMP",
      references: "mend.io"
    },
    "gitlab-deps": {
      vendorName: "GitLab Dependency Scanning",
      company: "GitLab Inc",
      productService: "Integrated Dependency Scanning",
      pricingModel: "Free tier / Premium from $19/user",
      contractTerms: "GitLab Terms of Service",
      supportSLA: "Tiered support (Free/Premium/Ultimate)",
      compliance: "SOC 2, ISO 27001, GDPR",
      dataResidency: "Global / GitLab.com or self-hosted",
      businessStability: "High (public company)",
      marketPosition: "Strong (DevOps platform)",
      integrationCapability: "Excellent (GitLab native)",
      scalability: "Excellent",
      securityCertifications: "SOC 2, ISO 27001",
      references: "gitlab.com"
    },
    manual: {
      vendorName: "Manual Process",
      company: "Internal Team",
      productService: "Manual Dependency Management",
      pricingModel: "Developer time costs",
      contractTerms: "Internal process",
      supportSLA: "Internal team capacity",
      compliance: "Depends on internal practices",
      dataResidency: "Internal control",
      businessStability: "Depends on team availability",
      marketPosition: "Traditional approach",
      integrationCapability: "Manual integration required",
      scalability: "Limited by team capacity",
      securityCertifications: "None (manual process)",
      references: "Internal documentation"
    }
  }
  
  return details[toolId as keyof typeof details] || details.manual
};

export const getComplianceDetails = (platformId: string): string => {
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
};

export const generateVendorComparison = (
  projectName: string,
  selectedPlatform: string,
  platforms: Platform[]
): string => {
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
};

export const generateDependencyVendorComparison = (
  projectName: string,
  selectedDepTool: string,
  dependencyTools: DependencyTool[]
): string => {
  const tool = dependencyTools.find(t => t.id === selectedDepTool)
  const repoName = projectName.trim() || "my-project"
  const currentDate = new Date().toISOString().split('T')[0]
  
  if (!tool) return ""
  
  // Get detailed vendor information for the selected dependency tool
  const vendorDetails = getDependencyVendorDetails(selectedDepTool)
  
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

# Vendor Entry Details for ${tool.name}
Project: ${repoName}
Evaluation Date: ${currentDate}
Status: Under evaluation
Tool Type: Dependency Management

# Instructions:
1. Copy the tab-separated row above
2. Paste into your vendor evaluation spreadsheet
3. The row includes: Vendor Name, Company, Product/Service, Pricing Model, Contract Terms, Support SLA, Compliance, Data Residency, Business Stability, Market Position, Integration Capability, Scalability, Security Certifications, References, Project Name, Evaluation Date, Status

# Tool Summary for ${tool.name}:
- Platform: ${tool.platform}
- Pricing: ${tool.pricing}
- Best For: ${tool.bestFor}
- Key Features: ${tool.features.join(', ')}`
};

export const getDocumentationVendorDetails = (toolId: string): VendorDetails => {
  const details = {
    gitbook: {
      vendorName: "GitBook",
      company: "GitBook SAS",
      productService: "Modern documentation platform with Git integration",
      pricingModel: "Freemium: Free tier (personal), Plus ($5/editor/month), Pro ($12.50/editor/month), Enterprise (custom)",
      contractTerms: "Monthly/Annual subscriptions, Enterprise custom agreements, 14-day free trial",
      supportSLA: "Email support for paid plans, Priority support for Enterprise",
      compliance: "GDPR compliant, SOC 2 Type II certified",
      dataResidency: "Primary: United States, European Union options available",
      businessStability: "Well-funded startup, Growing user base, Established market presence",
      marketPosition: "Strong in developer documentation space, Modern UI focus",
      integrationCapability: "Git sync, REST API, Webhooks, Third-party integrations",
      scalability: "Cloud-native scaling, CDN distribution, Performance optimized",
      securityCertifications: "SOC 2 Type II, Regular security assessments",
      references: "Stripe, Algolia, Linear (public documentation examples)"
    },
    notion: {
      vendorName: "Notion",
      company: "Notion Labs Inc.",
      productService: "All-in-one workspace for notes, docs, and collaboration",
      pricingModel: "Freemium: Free (personal), Plus ($8/user/month), Business ($15/user/month), Enterprise ($25/user/month)",
      contractTerms: "Monthly/Annual subscriptions, Enterprise agreements, Free trial available",
      supportSLA: "Email support for paid plans, Priority for Business/Enterprise",
      compliance: "SOC 2 Type II, GDPR, CCPA compliant",
      dataResidency: "United States, European Union options",
      businessStability: "Unicorn startup ($10B+ valuation), Rapidly growing user base",
      marketPosition: "Leader in productivity/collaboration space, Strong brand recognition",
      integrationCapability: "Public API, Extensive third-party integrations, Embedding capabilities",
      scalability: "Cloud infrastructure, Real-time collaboration at scale",
      securityCertifications: "SOC 2 Type II, ISO 27001 in progress",
      references: "Pixar, McDonald's, Netflix (publicly disclosed customers)"
    },
    confluence: {
      vendorName: "Confluence",
      company: "Atlassian Corporation",
      productService: "Team workspace and knowledge management platform",
      pricingModel: "Standard ($5/user/month), Premium ($10/user/month), Enterprise (custom), Data Center (perpetual)",
      contractTerms: "Monthly/Annual subscriptions, Data Center licensing, Enterprise agreements",
      supportSLA: "24/7 for Premium+, Business hours for Standard, SLA guarantees for Enterprise",
      compliance: "SOC 2, ISO 27001, FedRAMP, GDPR, HIPAA-eligible",
      dataResidency: "Multiple global regions, Data Center for on-premises",
      businessStability: "Public company (NASDAQ: TEAM), Stable revenue, 250,000+ customers",
      marketPosition: "Market leader in enterprise collaboration, Strong ecosystem",
      integrationCapability: "REST API, Atlassian Marketplace, Deep Jira integration",
      scalability: "Enterprise-grade, Data Center scaling, Performance monitoring",
      securityCertifications: "SOC 2 Type II, ISO 27001, FedRAMP ATO",
      references: "NASA, Spotify, Visa (case studies available)"
    }
  }
  
  return details[toolId as keyof typeof details] || {
    vendorName: "Unknown Vendor",
    company: "Not specified",
    productService: "Documentation platform",
    pricingModel: "Contact vendor for pricing",
    contractTerms: "Standard subscription terms",
    supportSLA: "Standard support",
    compliance: "Standard compliance",
    dataResidency: "Contact vendor",
    businessStability: "Established vendor",
    marketPosition: "Market participant",
    integrationCapability: "Standard integrations",
    scalability: "Standard scaling",
    securityCertifications: "Standard security",
    references: "Contact vendor for references"
  }
};

export const generateDocumentationVendorComparison = (
  projectName: string,
  selectedDocTool: string,
  documentationTools: DocumentationTool[]
): string => {
  const repoName = projectName.trim() || "my-project"
  const tool = documentationTools.find(t => t.id === selectedDocTool)
  const currentDate = new Date().toISOString().split('T')[0]
  
  if (!tool) {
    return `Tool ${selectedDocTool} not found in documentation tools list.`
  }
  
  const vendorDetails = getDocumentationVendorDetails(selectedDocTool)
  
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

# Vendor Entry Details for ${tool.name}
Project: ${repoName}
Evaluation Date: ${currentDate}
Status: Under evaluation
Tool Type: Documentation Platform

# Instructions:
1. Copy the tab-separated row above
2. Paste into your vendor evaluation spreadsheet
3. The row includes: Vendor Name, Company, Product/Service, Pricing Model, Contract Terms, Support SLA, Compliance, Data Residency, Business Stability, Market Position, Integration Capability, Scalability, Security Certifications, References, Project Name, Evaluation Date, Status

# Tool Summary for ${tool.name}:
- Platform: ${tool.platform}
- Pricing: ${tool.pricing}
- Best For: ${tool.bestFor}
- Key Features: ${tool.features.join(', ')}`
};

export const getCICDVendorDetails = (toolId: string): VendorDetails => {
  const details = {
    "github-actions": {
      vendorName: "GitHub Actions",
      company: "Microsoft Corporation",
      productService: "Cloud-based CI/CD platform integrated with GitHub",
      pricingModel: "Usage-based: Free for public repos, $0.008/minute for private repos",
      contractTerms: "Monthly billing, Enterprise agreements available",
      supportSLA: "24/7 for Enterprise, Business hours for Pro/Team, Community for Free",
      compliance: "SOC 2, ISO 27001, PCI DSS, GDPR, Privacy Shield",
      dataResidency: "Primary: United States, Available: European Union",
      businessStability: "Part of Microsoft GitHub, Stable revenue, Wide adoption",
      marketPosition: "Leading CI/CD platform for GitHub users",
      integrationCapability: "Native GitHub integration, Marketplace actions, REST API",
      scalability: "Auto-scaling, Matrix builds, Self-hosted runners",
      securityCertifications: "SOC 2 Type II, ISO 27001, Regular security audits",
      references: "Microsoft, Netflix, Spotify (public case studies available)"
    },
    "gitlab-ci": {
      vendorName: "GitLab CI/CD",
      company: "GitLab Inc.",
      productService: "Integrated CI/CD platform within GitLab ecosystem",
      pricingModel: "Freemium: Free tier available, Premium ($19/user/month), Ultimate ($99/user/month)",
      contractTerms: "Monthly/Annual subscriptions, Custom enterprise terms",
      supportSLA: "24/7 for Ultimate, Business hours for Premium, Community for Free",
      compliance: "SOC 2, ISO 27001, FedRAMP, GDPR, Cloud Security Alliance STAR",
      dataResidency: "Multiple global regions, Self-hosted deployment option",
      businessStability: "Public company (NASDAQ: GTLB), Growing revenue",
      marketPosition: "Strong competitor in DevOps space, Enterprise focus",
      integrationCapability: "Native GitLab integration, Auto DevOps, Kubernetes support",
      scalability: "Enterprise-grade scaling, Self-hosted options, Performance monitoring",
      securityCertifications: "SOC 2 Type II, ISO 27001, FedRAMP ATO",
      references: "CERN, Goldman Sachs, Ticketmaster (case studies available)"
    },
    "jenkins": {
      vendorName: "Jenkins",
      company: "Jenkins Community / CloudBees (Enterprise)",
      productService: "Open source automation server with enterprise support options",
      pricingModel: "Open source: Free, Enterprise support: Contact for pricing",
      contractTerms: "Open source license, Enterprise subscription terms",
      supportSLA: "Community support, Enterprise SLA available",
      compliance: "Depends on deployment, Enterprise compliance features available",
      dataResidency: "Self-hosted, Full control over data location",
      businessStability: "Large open source community, Enterprise vendor support",
      marketPosition: "Established leader in CI/CD automation",
      integrationCapability: "Extensive plugin ecosystem (1000+ plugins), REST API",
      scalability: "Distributed builds, Master-slave architecture, Cloud agents",
      securityCertifications: "Depends on deployment and configuration",
      references: "Netflix, LinkedIn, eBay (public case studies available)"
    },
    "circleci": {
      vendorName: "CircleCI",
      company: "Circle Internet Services Inc.",
      productService: "Cloud-native CI/CD platform with high performance focus",
      pricingModel: "Usage-based: Free tier, Performance ($15/month), Scale ($2000/month)",
      contractTerms: "Monthly/Annual subscriptions, Custom enterprise agreements",
      supportSLA: "24/7 for Scale, Business hours for Performance, Community for Free",
      compliance: "SOC 2, ISO 27001, PCI DSS, GDPR, FedRAMP",
      dataResidency: "United States, European Union options available",
      businessStability: "Private company, Series E funding, Growing market share",
      marketPosition: "Strong performance focus, Developer-friendly platform",
      integrationCapability: "REST API, Orbs ecosystem, VCS integrations",
      scalability: "Auto-scaling, Parallelism, Resource classes",
      securityCertifications: "SOC 2 Type II, ISO 27001, Regular penetration testing",
      references: "Facebook, Spotify, GoPro (public case studies available)"
    },
    "google-cloud-build": {
      vendorName: "Google Cloud Build",
      company: "Google LLC",
      productService: "Fully managed CI/CD platform with container-native builds",
      pricingModel: "Usage-based: 120 free build-minutes/day, $0.003/build-minute after",
      contractTerms: "Monthly billing, Google Cloud customer agreement, Enterprise terms available",
      supportSLA: "24/7 for Premium Support, Business hours for Basic, Community for Free",
      compliance: "SOC 2, ISO 27001, PCI DSS, GDPR, HIPAA (BAA available)",
      dataResidency: "Global regions available, Data residency controls",
      businessStability: "Part of Alphabet Inc., Stable revenue, Large enterprise adoption",
      marketPosition: "Strong in GCP ecosystem, Container-native focus",
      integrationCapability: "Native GCP integration, GitHub/Bitbucket connectors, REST API",
      scalability: "Auto-scaling, Parallel builds, Global infrastructure",
      securityCertifications: "SOC 2 Type II, ISO 27001, Regular security audits",
      references: "Spotify, Shopify, PayPal (public case studies available)"
    },
    "manual": {
      vendorName: "Manual Deployment",
      company: "Internal Team",
      productService: "Manual deployment and CI/CD processes",
      pricingModel: "Internal labor costs only",
      contractTerms: "Internal process, No external contracts",
      supportSLA: "Internal team availability",
      compliance: "Organization-dependent",
      dataResidency: "Full control, On-premises",
      businessStability: "Dependent on internal team",
      marketPosition: "Traditional approach, Full control",
      integrationCapability: "Custom integrations possible",
      scalability: "Limited by manual processes",
      securityCertifications: "Organization-dependent",
      references: "Internal projects only"
    }
  };
  
  return details[toolId as keyof typeof details] || {
    vendorName: "Unknown CI/CD Tool",
    company: "Unknown Company",
    productService: "CI/CD Platform",
    pricingModel: "Contact vendor",
    contractTerms: "Standard terms",
    supportSLA: "Standard support",
    compliance: "Standard compliance",
    dataResidency: "Contact vendor",
    businessStability: "Established vendor",
    marketPosition: "Market participant",
    integrationCapability: "Standard integrations",
    scalability: "Standard scaling",
    securityCertifications: "Standard security",
    references: "Contact vendor for references"
  }
};

export const generateCICDVendorComparison = (
  projectName: string,
  selectedCICDTool: string,
  cicdTools: CICDTool[]
): string => {
  const repoName = projectName.trim() || "my-project"
  const tool = cicdTools.find(t => t.id === selectedCICDTool)
  const currentDate = new Date().toISOString().split('T')[0]
  
  if (!tool) {
    return `Tool ${selectedCICDTool} not found in CI/CD tools list.`
  }
  
  const vendorDetails = getCICDVendorDetails(selectedCICDTool)
  
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

# Vendor Entry Details for ${tool.name}
Project: ${repoName}
Evaluation Date: ${currentDate}
Status: Under evaluation
Tool Type: CI/CD Platform

# Instructions:
1. Copy the tab-separated row above
2. Paste into your vendor evaluation spreadsheet
3. The row includes: Vendor Name, Company, Product/Service, Pricing Model, Contract Terms, Support SLA, Compliance, Data Residency, Business Stability, Market Position, Integration Capability, Scalability, Security Certifications, References, Project Name, Evaluation Date, Status

# Tool Summary for ${tool.name}:
- Platform: ${tool.platform}
- Pricing: ${tool.pricing}
- Best For: ${tool.bestFor}
- Key Features: ${tool.features.join(', ')}`
};

export const generateIssueTrackingVendorComparison = (
  projectName: string,
  selectedTool: string,
  issueTrackingTools: IssueTrackingTool[]
): string => {
  const repoName = projectName.trim() || "my-project"
  const tool = issueTrackingTools.find(t => t.id === selectedTool)
  const currentDate = new Date().toISOString().split('T')[0]
  
  if (!tool) {
    return `# Issue Tracking Vendor Comparison Row - Tool not found`
  }
  
  const vendorDetails = getIssueTrackingVendorDetails(tool)
  
  return `# Issue Tracking Vendor Comparison Row for ${repoName}

## Tab-separated vendor row (copy everything between the dashes):
---
${vendorDetails.vendorName}	${vendorDetails.company}	${vendorDetails.productService}	${vendorDetails.pricingModel}	${vendorDetails.contractTerms}	${vendorDetails.supportSLA}	${vendorDetails.compliance}	${vendorDetails.dataResidency}	${vendorDetails.businessStability}	${vendorDetails.marketPosition}	${vendorDetails.integrationCapability}	${vendorDetails.scalability}	${vendorDetails.securityCertifications}	${vendorDetails.references}	${repoName}	${currentDate}	Under Evaluation
---

# Instructions:
1. Copy the tab-separated row above
2. Paste into your vendor evaluation spreadsheet
3. The row includes: Vendor Name, Company, Product/Service, Pricing Model, Contract Terms, Support SLA, Compliance, Data Residency, Business Stability, Market Position, Integration Capability, Scalability, Security Certifications, References, Project Name, Evaluation Date, Status

# Tool Summary for ${tool.name}:
- Platform: ${tool.platform}
- Pricing: ${tool.pricing}
- Best For: ${tool.bestFor}
- Key Features: ${tool.features.join(', ')}`
};

function getIssueTrackingVendorDetails(tool: IssueTrackingTool): VendorDetails {
  const vendorMappings: Record<string, VendorDetails> = {
    "github-issues": {
      vendorName: "GitHub Issues",
      company: "GitHub (Microsoft)",
      productService: "Issue Tracking & Project Management",
      pricingModel: "Free for public repos, per-user/month for private",
      contractTerms: "Monthly/Annual subscription",
      supportSLA: "Community support (free), Priority support (paid)",
      compliance: "SOC 2 Type II, ISO 27001, GDPR",
      dataResidency: "Global (US, EU options)",
      businessStability: "High - Microsoft subsidiary",
      marketPosition: "Market leader in code hosting",
      integrationCapability: "Excellent - GitHub ecosystem",
      scalability: "Excellent - Cloud-native",
      securityCertifications: "SOC 2, ISO 27001, FedRAMP",
      references: "Open source community, enterprise customers"
    },
    "gitlab-issues": {
      vendorName: "GitLab Issues",
      company: "GitLab Inc.",
      productService: "Issue Tracking & Project Management",
      pricingModel: "Freemium, per-user/month",
      contractTerms: "Monthly/Annual subscription",
      supportSLA: "Community support (free), Priority support (paid)",
      compliance: "SOC 2 Type II, ISO 27001, GDPR",
      dataResidency: "Global (US, EU options)",
      businessStability: "High - Public company",
      marketPosition: "Strong competitor to GitHub",
      integrationCapability: "Excellent - GitLab ecosystem",
      scalability: "Excellent - Cloud-native",
      securityCertifications: "SOC 2, ISO 27001",
      references: "Enterprise customers, DevOps teams"
    },
    "jira": {
      vendorName: "Jira",
      company: "Atlassian",
      productService: "Issue Tracking & Project Management",
      pricingModel: "Per-user/month, volume discounts",
      contractTerms: "Monthly/Annual subscription",
      supportSLA: "Community support, Priority support (paid)",
      compliance: "SOC 2 Type II, ISO 27001, GDPR",
      dataResidency: "Global (US, EU, Australia)",
      businessStability: "High - Established public company",
      marketPosition: "Market leader in issue tracking",
      integrationCapability: "Excellent - Atlassian ecosystem",
      scalability: "Excellent - Enterprise-grade",
      securityCertifications: "SOC 2, ISO 27001, Cloud Security Alliance",
      references: "Fortune 500 companies, enterprise customers"
    },
    "linear": {
      vendorName: "Linear",
      company: "Linear",
      productService: "Issue Tracking & Project Management",
      pricingModel: "Per-user/month",
      contractTerms: "Monthly/Annual subscription",
      supportSLA: "Email support, Priority support (paid)",
      compliance: "SOC 2 Type II, GDPR",
      dataResidency: "US, EU options",
      businessStability: "Medium - Growing startup",
      marketPosition: "Emerging player, developer-focused",
      integrationCapability: "Good - Growing ecosystem",
      scalability: "Good - Modern architecture",
      securityCertifications: "SOC 2",
      references: "Tech startups, product teams"
    },
    "asana": {
      vendorName: "Asana",
      company: "Asana Inc.",
      productService: "Project Management & Issue Tracking",
      pricingModel: "Freemium, per-user/month",
      contractTerms: "Monthly/Annual subscription",
      supportSLA: "Community support, Priority support (paid)",
      compliance: "SOC 2 Type II, ISO 27001, GDPR",
      dataResidency: "Global (US, EU options)",
      businessStability: "High - Public company",
      marketPosition: "Strong in project management",
      integrationCapability: "Excellent - Wide integrations",
      scalability: "Excellent - Enterprise-grade",
      securityCertifications: "SOC 2, ISO 27001",
      references: "Enterprise customers, project teams"
    }
  }
  
  return vendorMappings[tool.id] || {
    vendorName: tool.name,
    company: "Unknown",
    productService: "Issue Tracking & Project Management",
    pricingModel: tool.pricing,
    contractTerms: "Per terms of service",
    supportSLA: "Standard support",
    compliance: "Check vendor documentation",
    dataResidency: "Check vendor documentation",
    businessStability: "Check vendor documentation",
    marketPosition: "Check vendor documentation",
    integrationCapability: "Check vendor documentation",
    scalability: "Check vendor documentation",
    securityCertifications: "Check vendor documentation",
    references: "Check vendor documentation"
  }
}

export const generateFeatureFlagVendorComparison = (
  projectName: string,
  selectedFeatureFlagTool: string,
  featureFlagTools: FeatureFlagTool[]
): string => {
  const tool = featureFlagTools.find(t => t.id === selectedFeatureFlagTool)
  const repoName = projectName.trim() || "my-project"
  const currentDate = new Date().toISOString().split('T')[0]
  
  if (!tool) return ""
  
  // Get detailed vendor information for the selected feature flag tool
  const vendorDetails = getFeatureFlagVendorDetails(selectedFeatureFlagTool)
  
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

# Vendor Entry Details for ${tool.name}
Project: ${repoName}
Evaluation Date: ${currentDate}
Status: Under evaluation
Tool Type: Feature Flag Management

# Instructions:
1. Copy the tab-separated row above
2. Paste into your vendor evaluation spreadsheet
3. The row includes: Vendor Name, Company, Product/Service, Pricing Model, Contract Terms, Support SLA, Compliance, Data Residency, Business Stability, Market Position, Integration Capability, Scalability, Security Certifications, References, Project Name, Evaluation Date, Status

# Tool Summary for ${tool.name}:
- Platform: ${tool.platform}
- Pricing: ${tool.pricing}
- Best For: ${tool.bestFor}
- Key Features: ${tool.features.join(', ')}`
};

export const getFeatureFlagVendorDetails = (toolId: string): VendorDetails => {
  const vendorMappings: Record<string, VendorDetails> = {
    "launchdarkly": {
      vendorName: "LaunchDarkly",
      company: "LaunchDarkly Inc.",
      productService: "Feature Flag Management & Experimentation Platform",
      pricingModel: "Subscription-based: Starter ($8.33/seat/month), Pro ($16.67/seat/month), Enterprise (custom)",
      contractTerms: "Monthly/Annual subscriptions, Enterprise custom agreements, 14-day free trial",
      supportSLA: "24/7 for Enterprise, Business hours for Pro, Email support for Starter",
      compliance: "SOC 2 Type II, ISO 27001, GDPR, CCPA, HIPAA",
      dataResidency: "United States, European Union, Canada",
      businessStability: "High - Well-funded private company, Series D funding",
      marketPosition: "Market leader in feature flag management",
      integrationCapability: "Excellent - 50+ SDKs, REST API, webhooks, extensive integrations",
      scalability: "Enterprise-grade - Billions of feature flag evaluations daily",
      securityCertifications: "SOC 2 Type II, ISO 27001, penetration testing",
      references: "IBM, Atlassian, CircleCI, Microsoft (case studies available)"
    },
    "split": {
      vendorName: "Split",
      company: "Split Software Inc.",
      productService: "Feature Flag Platform with Impact Measurement",
      pricingModel: "Freemium: Developer (free), Team ($20/seat/month), Business ($60/seat/month)",
      contractTerms: "Monthly/Annual subscriptions, Custom enterprise terms, 30-day free trial",
      supportSLA: "24/7 for Business, Business hours for Team, Community for Developer",
      compliance: "SOC 2 Type II, GDPR, CCPA",
      dataResidency: "United States, European Union",
      businessStability: "Private company, Series B funding, growing customer base",
      marketPosition: "Strong in feature experimentation and impact measurement",
      integrationCapability: "Good - 20+ SDKs, REST API, integrations with analytics tools",
      scalability: "Enterprise-ready - High-performance feature flag evaluation",
      securityCertifications: "SOC 2 Type II, regular security assessments",
      references: "Product teams, engineering organizations"
    },
    "flagsmith": {
      vendorName: "Flagsmith",
      company: "Flagsmith Ltd.",
      productService: "Open Source Feature Flag & Remote Config Service",
      pricingModel: "Freemium: Free (50k requests/month), Scale ($45/month), Enterprise (custom)",
      contractTerms: "Monthly/Annual subscriptions, Open source license, Self-hosted options",
      supportSLA: "Community support, Priority support for paid plans",
      compliance: "GDPR, SOC 2 (in progress)",
      dataResidency: "Global - Self-hosted deployment available",
      businessStability: "Growing open-source company, VC-backed",
      marketPosition: "Strong in open-source feature flag space",
      integrationCapability: "Good - Multiple SDKs, REST API, self-hosted flexibility",
      scalability: "Good - Scales with infrastructure, auto-scaling options",
      securityCertifications: "Security-focused development, regular audits",
      references: "Open source community, development teams"
    },
    "posthog": {
      vendorName: "PostHog",
      company: "PostHog Inc.",
      productService: "All-in-one Product Analytics with Feature Flags",
      pricingModel: "Usage-based: Free (1M events/month), Paid ($0.00031/event)",
      contractTerms: "Monthly billing, Annual discounts, Enterprise agreements",
      supportSLA: "Community support, Priority support for paid plans",
      compliance: "SOC 2 Type II, GDPR, CCPA",
      dataResidency: "United States, European Union, self-hosted options",
      businessStability: "Well-funded startup, Series B, open-source backing",
      marketPosition: "Strong in product analytics with integrated feature flags",
      integrationCapability: "Excellent - Multiple SDKs, API, extensive integrations",
      scalability: "High - Built for scale, efficient event processing",
      securityCertifications: "SOC 2 Type II, security-first architecture",
      references: "Product teams, startups, growth companies"
    },
    "unleash": {
      vendorName: "Unleash",
      company: "Unleash AS",
      productService: "Open Source Feature Toggle Service",
      pricingModel: "Open source free, Pro ($80/month), Enterprise (custom)",
      contractTerms: "Open source license, Commercial subscriptions, Self-hosted options",
      supportSLA: "Community support, Professional support for paid plans",
      compliance: "GDPR, SOC 2 (in progress)",
      dataResidency: "Global - Self-hosted deployment available",
      businessStability: "Established open-source company, commercial backing",
      marketPosition: "Strong in enterprise open-source feature management",
      integrationCapability: "Good - Multiple SDKs, REST API, flexible architecture",
      scalability: "Enterprise-grade - Designed for large-scale deployments",
      securityCertifications: "Security-focused, regular security reviews",
      references: "Enterprise customers, development teams"
    },
    "configcat": {
      vendorName: "ConfigCat",
      company: "ConfigCat Kft.",
      productService: "Feature Flag Service with Quick Setup",
      pricingModel: "Freemium: Free (1k users), Pro ($99/month), Enterprise (custom)",
      contractTerms: "Monthly/Annual subscriptions, 10-day free trial",
      supportSLA: "Email support, Priority support for paid plans",
      compliance: "GDPR, SOC 2 (in progress)",
      dataResidency: "United States, European Union",
      businessStability: "Growing SaaS company, stable service",
      marketPosition: "Focused on simplicity and ease of use",
      integrationCapability: "Good - 10+ SDKs, REST API, webhooks",
      scalability: "Good - Cloud-native, auto-scaling",
      securityCertifications: "Security-focused development, regular assessments",
      references: "Development teams, small to medium businesses"
    },
    "optimizely": {
      vendorName: "Optimizely",
      company: "Optimizely Inc.",
      productService: "Digital Experience Optimization Platform",
      pricingModel: "Enterprise pricing (contact for quote)",
      contractTerms: "Annual enterprise agreements, Custom pricing",
      supportSLA: "24/7 enterprise support, Dedicated customer success",
      compliance: "SOC 2 Type II, ISO 27001, GDPR, CCPA, HIPAA",
      dataResidency: "United States, European Union, global presence",
      businessStability: "High - Established enterprise company, strong revenue",
      marketPosition: "Market leader in digital experience optimization",
      integrationCapability: "Excellent - Extensive SDKs, APIs, enterprise integrations",
      scalability: "Enterprise-grade - Handles massive scale and traffic",
      securityCertifications: "SOC 2 Type II, ISO 27001, regular security audits",
      references: "Fortune 500 companies, enterprise customers"
    },
    "github-actions-flags": {
      vendorName: "GitHub",
      company: "Microsoft Corporation",
      productService: "Environment Variables for Feature Flags",
      pricingModel: "Included with GitHub Actions usage",
      contractTerms: "GitHub Terms of Service, Actions usage-based billing",
      supportSLA: "GitHub support tiers",
      compliance: "SOC 2, ISO 27001, GDPR (via GitHub)",
      dataResidency: "United States, European Union (via GitHub)",
      businessStability: "High - Part of Microsoft ecosystem",
      marketPosition: "Basic feature flag capability within GitHub",
      integrationCapability: "Limited - GitHub Actions and environment variables",
      scalability: "Good - Scales with GitHub Actions infrastructure",
      securityCertifications: "SOC 2 Type II, ISO 27001 (via GitHub)",
      references: "GitHub users, development teams"
    },
    "custom-implementation": {
      vendorName: "Custom Implementation",
      company: "Internal Development Team",
      productService: "Custom Feature Flag System",
      pricingModel: "Development and infrastructure costs",
      contractTerms: "Internal project, no external contracts",
      supportSLA: "Internal team support",
      compliance: "Depends on implementation",
      dataResidency: "Controlled by implementation",
      businessStability: "Depends on internal resources",
      marketPosition: "Custom solution",
      integrationCapability: "Full control over integrations",
      scalability: "Depends on implementation",
      securityCertifications: "Depends on implementation",
      references: "Internal use only"
    }
  }
  
  return vendorMappings[toolId] || {
    vendorName: "Unknown Tool",
    company: "Unknown",
    productService: "Feature Flag Management",
    pricingModel: "Unknown",
    contractTerms: "Per terms of service",
    supportSLA: "Standard support",
    compliance: "Check vendor documentation",
    dataResidency: "Check vendor documentation",
    businessStability: "Check vendor documentation",
    marketPosition: "Check vendor documentation",
    integrationCapability: "Check vendor documentation",
    scalability: "Check vendor documentation",
    securityCertifications: "Check vendor documentation",
    references: "Check vendor documentation"
  }
}

// Remove this line - no longer needed
// const featureFlagTools = []; // This will be imported properly when used
