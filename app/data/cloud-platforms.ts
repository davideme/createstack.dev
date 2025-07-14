import type { CloudPlatform } from "~/types/project";

export const cloudPlatforms: CloudPlatform[] = [
  {
    id: "aws",
    name: "Amazon Web Services",
    emoji: "☁️",
    description: "Comprehensive cloud platform with 200+ services. ✅ Mature ecosystem, extensive documentation, global reach, enterprise support.",
    bestFor: "Enterprise applications, scalable workloads, comprehensive cloud needs.",
    pricing: "Pay-as-you-go, free tier available",
    features: ["200+ services", "Global infrastructure", "Enterprise support", "Compliance certifications", "Hybrid cloud", "AI/ML services"],
    url: "https://aws.amazon.com/",
    targetPersonas: ["developer", "devops", "product-owner", "stakeholder"],
    complexityLevel: "intermediate",
    supportedArchitectures: ["client-server", "microservices", "serverless-web", "serverless-backend", "event-driven", "container-orchestration", "hybrid-cloud", "batch-etl", "streaming-realtime", "olap-focused"],
    iacSupport: ["terraform", "pulumi", "cdk", "cloudformation"],
    regions: ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1", "ap-northeast-1", "ca-central-1", "eu-central-1", "ap-south-1"],
    complianceCertifications: ["SOC 1/2/3", "ISO 27001", "HIPAA", "PCI DSS", "GDPR", "FedRAMP"]
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    emoji: "🔵",
    description: "Microsoft's cloud platform with strong enterprise integration. ✅ Office 365 integration, Windows workloads, hybrid cloud, AI services.",
    bestFor: "Microsoft ecosystem, enterprise applications, hybrid cloud scenarios.",
    pricing: "Pay-as-you-go, free tier available",
    features: ["Office 365 integration", "Windows workloads", "Hybrid cloud", "AI/ML services", "DevOps tools", "Enterprise support"],
    url: "https://azure.microsoft.com/",
    targetPersonas: ["developer", "devops", "product-owner", "stakeholder"],
    complexityLevel: "intermediate",
    supportedArchitectures: ["client-server", "microservices", "serverless-web", "serverless-backend", "event-driven", "container-orchestration", "hybrid-cloud", "batch-etl", "streaming-realtime"],
    iacSupport: ["terraform", "pulumi", "cdk"],
    regions: ["East US", "West US 2", "West Europe", "Southeast Asia", "Japan East", "Australia East", "Canada Central", "UK South"],
    complianceCertifications: ["SOC 1/2/3", "ISO 27001", "HIPAA", "PCI DSS", "GDPR", "FedRAMP"]
  },
  {
    id: "gcp",
    name: "Google Cloud Platform",
    emoji: "🟡",
    description: "Google's cloud platform with strong data and AI capabilities. ✅ BigQuery, Kubernetes Engine, AI/ML services, developer-friendly.",
    bestFor: "Data analytics, machine learning, Kubernetes workloads, developer productivity.",
    pricing: "Pay-as-you-go, free tier available",
    features: ["BigQuery", "Kubernetes Engine", "AI/ML services", "Data analytics", "Developer tools", "Global network"],
    url: "https://cloud.google.com/",
    targetPersonas: ["developer", "devops", "data-scientist", "product-owner"],
    complexityLevel: "intermediate",
    supportedArchitectures: ["client-server", "microservices", "serverless-web", "serverless-backend", "event-driven", "container-orchestration", "batch-etl", "streaming-realtime", "olap-focused"],
    iacSupport: ["terraform", "pulumi"],
    regions: ["us-central1", "us-east1", "europe-west1", "asia-southeast1", "asia-northeast1", "australia-southeast1", "northamerica-northeast1", "europe-north1"],
    complianceCertifications: ["SOC 1/2/3", "ISO 27001", "HIPAA", "PCI DSS", "GDPR"]
  },
  {
    id: "vercel",
    name: "Vercel",
    emoji: "▲",
    description: "Frontend-focused platform with excellent developer experience. ✅ Next.js optimization, edge functions, instant deployments, preview environments.",
    bestFor: "Frontend applications, Next.js projects, Jamstack sites, developer productivity.",
    pricing: "Free tier, Pro from $20/month",
    features: ["Next.js optimization", "Edge functions", "Instant deployments", "Preview environments", "Analytics", "CDN"],
    url: "https://vercel.com/",
    targetPersonas: ["developer", "designer", "product-owner"],
    complexityLevel: "beginner",
    supportedArchitectures: ["jamstack", "serverless-web", "client-server"],
    iacSupport: ["terraform"],
    regions: ["Global CDN", "Edge locations worldwide"],
    complianceCertifications: ["SOC 2", "GDPR"]
  },
  {
    id: "netlify",
    name: "Netlify",
    emoji: "🌐",
    description: "Modern web platform for static sites and serverless functions. ✅ Git-based workflows, form handling, identity management, split testing.",
    bestFor: "Static sites, Jamstack applications, frontend teams, rapid prototyping.",
    pricing: "Free tier, Pro from $19/month",
    features: ["Git-based workflows", "Form handling", "Identity management", "Split testing", "Analytics", "CDN"],
    url: "https://netlify.com/",
    targetPersonas: ["developer", "designer", "product-owner"],
    complexityLevel: "beginner",
    supportedArchitectures: ["jamstack", "serverless-web"],
    iacSupport: ["terraform"],
    regions: ["Global CDN", "Edge locations worldwide"],
    complianceCertifications: ["SOC 2", "GDPR"]
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    emoji: "🌊",
    description: "Developer-friendly cloud platform with simple pricing. ✅ Droplets, Kubernetes, databases, object storage, monitoring.",
    bestFor: "Small to medium applications, developer-focused teams, predictable pricing.",
    pricing: "Fixed pricing, Droplets from $5/month",
    features: ["Droplets", "Kubernetes", "Managed databases", "Object storage", "Monitoring", "Load balancers"],
    url: "https://digitalocean.com/",
    targetPersonas: ["developer", "devops", "product-owner"],
    complexityLevel: "beginner",
    supportedArchitectures: ["client-server", "microservices", "container-orchestration", "monolith"],
    iacSupport: ["terraform", "pulumi"],
    regions: ["NYC", "SF", "AMS", "SGP", "LON", "FRA", "TOR", "BLR"],
    complianceCertifications: ["SOC 2", "GDPR", "ISO 27001"]
  },
  {
    id: "railway",
    name: "Railway",
    emoji: "🚂",
    description: "Modern deployment platform with instant deployments. ✅ Git-based deployments, database provisioning, environment management.",
    bestFor: "Rapid prototyping, small to medium applications, developer productivity.",
    pricing: "Usage-based, free tier available",
    features: ["Git-based deployments", "Database provisioning", "Environment management", "Instant deployments", "Monitoring", "Auto-scaling"],
    url: "https://railway.app/",
    targetPersonas: ["developer", "product-owner"],
    complexityLevel: "beginner",
    supportedArchitectures: ["monolith", "client-server", "serverless-backend"],
    iacSupport: ["terraform"],
    regions: ["US", "EU"],
    complianceCertifications: ["SOC 2", "GDPR"]
  },
  {
    id: "render",
    name: "Render",
    emoji: "🎨",
    description: "Cloud platform for developers with automatic scaling. ✅ Auto-scaling, managed databases, static sites, background jobs.",
    bestFor: "Full-stack applications, automatic scaling, developer experience.",
    pricing: "Free tier, Pro from $7/month",
    features: ["Auto-scaling", "Managed databases", "Static sites", "Background jobs", "SSL certificates", "Custom domains"],
    url: "https://render.com/",
    targetPersonas: ["developer", "devops", "product-owner"],
    complexityLevel: "beginner",
    supportedArchitectures: ["client-server", "monolith", "jamstack", "serverless-backend"],
    iacSupport: ["terraform"],
    regions: ["US", "EU"],
    complianceCertifications: ["SOC 2", "GDPR"]
  },
  {
    id: "fly",
    name: "Fly.io",
    emoji: "🪰",
    description: "Global application platform with edge deployment. ✅ Edge deployment, Docker containers, global distribution, low latency.",
    bestFor: "Global applications, low latency requirements, Docker-based deployments.",
    pricing: "Pay-as-you-go, free tier available",
    features: ["Edge deployment", "Docker containers", "Global distribution", "Low latency", "PostgreSQL", "Redis"],
    url: "https://fly.io/",
    targetPersonas: ["developer", "devops", "product-owner"],
    complexityLevel: "intermediate",
    supportedArchitectures: ["client-server", "microservices", "container-orchestration", "edge-computing"],
    iacSupport: ["terraform"],
    regions: ["Global edge locations", "30+ regions worldwide"],
    complianceCertifications: ["SOC 2", "GDPR"]
  },
  {
    id: "supabase",
    name: "Supabase",
    emoji: "⚡",
    description: "Open source Firebase alternative with PostgreSQL. ✅ PostgreSQL database, real-time subscriptions, authentication, storage.",
    bestFor: "Full-stack applications, real-time features, PostgreSQL preference.",
    pricing: "Free tier, Pro from $25/month",
    features: ["PostgreSQL database", "Real-time subscriptions", "Authentication", "Storage", "Edge functions", "Dashboard"],
    url: "https://supabase.com/",
    targetPersonas: ["developer", "product-owner"],
    complexityLevel: "beginner",
    supportedArchitectures: ["client-server", "jamstack", "serverless-backend", "realtime"],
    iacSupport: ["terraform"],
    regions: ["US", "EU", "AP"],
    complianceCertifications: ["SOC 2", "GDPR"]
  }
];

export function getAvailableCloudPlatforms(architecture: string, personas: string[] = []): CloudPlatform[] {
  let platforms = [...cloudPlatforms];
  
  // Filter by architecture compatibility
  if (architecture) {
    platforms = platforms.filter(platform => 
      platform.supportedArchitectures.includes(architecture)
    );
  }
  
  // If personas are specified, filter and sort by persona relevance
  if (personas.length > 0) {
    // Calculate relevance score based on persona overlap
    platforms = platforms.map(platform => ({
      ...platform,
      relevanceScore: platform.targetPersonas.filter(persona => personas.includes(persona)).length
    })).sort((a, b) => {
      // Sort by relevance score (descending), then alphabetically
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      
      return a.name.localeCompare(b.name);
    });
  }
  
  return platforms;
}

export function getCloudPlatformById(id: string): CloudPlatform | undefined {
  return cloudPlatforms.find(platform => platform.id === id);
}
