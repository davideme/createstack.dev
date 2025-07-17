import type { CloudPlatform, CloudPlatformProduct } from "~/types/project";

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
    complianceCertifications: ["SOC 1/2/3", "ISO 27001", "HIPAA", "PCI DSS", "GDPR", "FedRAMP"],
    products: [
      {
        id: "ec2",
        name: "EC2 (Elastic Compute Cloud)",
        emoji: "🖥️",
        description: "Scalable virtual servers in the cloud with various instance types and operating systems.",
        bestFor: "Web applications, development environments, high-performance computing",
        supportedArchitectures: ["client-server", "microservices", "monolith", "hybrid-cloud"],
        category: "compute",
        pricing: "On-demand, Reserved, Spot instances",
        features: ["Auto Scaling", "Load Balancing", "Multiple instance types", "Custom AMIs", "Security Groups"],
        url: "https://aws.amazon.com/ec2/",
        popularityRank: 1,
        subcategory: "virtual-machines"
      },
      {
        id: "lightsail",
        name: "Lightsail",
        emoji: "💡",
        description: "Easy-to-use cloud platform for simple web applications and websites.",
        bestFor: "Simple web applications, blogs, small business websites",
        supportedArchitectures: ["client-server", "monolith"],
        category: "compute",
        pricing: "Fixed monthly pricing starting at $3.50",
        features: ["Pre-configured stacks", "Static IP", "DNS management", "Load balancers", "CDN"],
        url: "https://aws.amazon.com/lightsail/",
        popularityRank: 3,
        subcategory: "virtual-machines"
      },
      {
        id: "lambda",
        name: "Lambda",
        emoji: "⚡",
        description: "Serverless compute service that runs code without provisioning servers.",
        bestFor: "Event-driven applications, microservices, real-time data processing",
        supportedArchitectures: ["serverless-web", "serverless-backend", "event-driven", "microservices"],
        category: "serverless",
        pricing: "Pay per request and compute time",
        features: ["Event triggers", "Auto scaling", "Built-in monitoring", "Multiple runtimes", "VPC support"],
        url: "https://aws.amazon.com/lambda/",
        popularityRank: 1,
        subcategory: "functions"
      },
      {
        id: "rds",
        name: "RDS (Relational Database Service)",
        emoji: "🗃️",
        description: "Managed relational database service supporting multiple database engines.",
        bestFor: "Web applications, enterprise applications, data warehousing",
        supportedArchitectures: ["client-server", "microservices", "monolith", "hybrid-cloud"],
        category: "database",
        pricing: "On-demand and Reserved instances",
        features: ["Multi-AZ deployments", "Automated backups", "Read replicas", "Multiple engines", "Performance monitoring"],
        url: "https://aws.amazon.com/rds/",
        popularityRank: 1,
        subcategory: "relational"
      },
      {
        id: "dynamodb",
        name: "DynamoDB",
        emoji: "🚀",
        description: "Fast and flexible NoSQL database service for any scale.",
        bestFor: "High-performance applications, real-time applications, IoT, gaming",
        supportedArchitectures: ["serverless-backend", "microservices", "event-driven"],
        category: "database",
        pricing: "Pay per request or provisioned capacity",
        features: ["Single-digit millisecond latency", "Global tables", "Auto scaling", "ACID transactions", "Point-in-time recovery"],
        url: "https://aws.amazon.com/dynamodb/",
        popularityRank: 2,
        subcategory: "nosql"
      },
      {
        id: "s3",
        name: "S3 (Simple Storage Service)",
        emoji: "📦",
        description: "Object storage service with industry-leading scalability and data availability.",
        bestFor: "Static websites, data archiving, content distribution, backup",
        supportedArchitectures: ["jamstack", "client-server", "microservices", "serverless-web", "batch-etl"],
        category: "storage",
        pricing: "Pay for storage used and requests",
        features: ["99.999999999% durability", "Lifecycle policies", "Versioning", "Cross-region replication", "Static website hosting"],
        url: "https://aws.amazon.com/s3/",
        popularityRank: 1,
        subcategory: "object-storage"
      },
      {
        id: "ecs",
        name: "ECS (Elastic Container Service)",
        emoji: "🐳",
        description: "Fully managed container orchestration service for Docker containers.",
        bestFor: "Containerized applications, microservices, CI/CD pipelines",
        supportedArchitectures: ["microservices", "container-orchestration", "client-server"],
        category: "container",
        pricing: "Pay for underlying EC2 instances or Fargate tasks",
        features: ["Service discovery", "Load balancing", "Auto scaling", "Security", "Monitoring"],
        url: "https://aws.amazon.com/ecs/",
        popularityRank: 1,
        subcategory: "orchestration"
      },
      {
        id: "eks",
        name: "EKS (Elastic Kubernetes Service)",
        emoji: "☸️",
        description: "Managed Kubernetes service for running Kubernetes applications.",
        bestFor: "Kubernetes workloads, cloud-native applications, hybrid deployments",
        supportedArchitectures: ["microservices", "container-orchestration"],
        category: "container",
        pricing: "Pay for control plane and worker nodes",
        features: ["Managed control plane", "Auto scaling", "Security patching", "Networking", "Add-ons"],
        url: "https://aws.amazon.com/eks/",
        popularityRank: 2,
        subcategory: "orchestration"
      },
      {
        id: "api-gateway",
        name: "API Gateway",
        emoji: "🚪",
        description: "Fully managed service for creating, publishing, and managing APIs.",
        bestFor: "REST APIs, WebSocket APIs, serverless applications",
        supportedArchitectures: ["serverless-backend", "microservices", "event-driven"],
        category: "networking",
        pricing: "Pay per API call and data transfer",
        features: ["Request/response transformation", "Authentication", "Rate limiting", "Monitoring", "Caching"],
        url: "https://aws.amazon.com/api-gateway/",
        popularityRank: 1,
        subcategory: "api-management"
      }
    ]
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
    complianceCertifications: ["SOC 1/2/3", "ISO 27001", "HIPAA", "PCI DSS", "GDPR", "FedRAMP"],
    products: [
      {
        id: "app-service",
        name: "App Service",
        emoji: "🌐",
        description: "Fully managed platform for building, deploying, and scaling web apps.",
        bestFor: "Web applications, REST APIs, mobile backends",
        supportedArchitectures: ["client-server", "serverless-web", "microservices"],
        category: "compute",
        pricing: "Based on App Service plan tier",
        features: ["Auto scaling", "DevOps integration", "Custom domains", "SSL certificates", "Deployment slots"],
        url: "https://azure.microsoft.com/en-us/services/app-service/",
        popularityRank: 1,
        subcategory: "web-apps"
      },
      {
        id: "functions",
        name: "Azure Functions",
        emoji: "⚡",
        description: "Serverless compute service for event-driven applications.",
        bestFor: "Event processing, scheduled tasks, microservices",
        supportedArchitectures: ["serverless-backend", "event-driven", "microservices"],
        category: "serverless",
        pricing: "Consumption plan or Premium plan",
        features: ["Multiple triggers", "Durable Functions", "Language flexibility", "Integrated security", "Monitoring"],
        url: "https://azure.microsoft.com/en-us/services/functions/",
        popularityRank: 1,
        subcategory: "functions"
      },
      {
        id: "sql-database",
        name: "SQL Database",
        emoji: "🗃️",
        description: "Fully managed SQL database service with built-in intelligence.",
        bestFor: "Modern applications, data warehousing, analytics",
        supportedArchitectures: ["client-server", "microservices", "hybrid-cloud"],
        category: "database",
        pricing: "DTU or vCore-based models",
        features: ["Auto-tuning", "Threat detection", "Geo-replication", "Elastic pools", "Backup retention"],
        url: "https://azure.microsoft.com/en-us/services/sql-database/",
        popularityRank: 1,
        subcategory: "relational"
      },
      {
        id: "cosmos-db",
        name: "Cosmos DB",
        emoji: "🌌",
        description: "Globally distributed, multi-model database service for any scale.",
        bestFor: "Global applications, IoT, real-time personalization",
        supportedArchitectures: ["microservices", "event-driven", "serverless-backend"],
        category: "database",
        pricing: "Pay for throughput and storage",
        features: ["Global distribution", "Multi-model", "SLA guarantees", "Auto scaling", "Multiple APIs"],
        url: "https://azure.microsoft.com/en-us/services/cosmos-db/",
        popularityRank: 2,
        subcategory: "nosql"
      },
      {
        id: "storage",
        name: "Azure Storage",
        emoji: "📦",
        description: "Massively scalable cloud storage for any type of data.",
        bestFor: "File storage, blob storage, static websites, backup",
        supportedArchitectures: ["jamstack", "client-server", "microservices", "batch-etl"],
        category: "storage",
        pricing: "Pay for storage used and operations",
        features: ["Multiple storage types", "Geo-redundancy", "Lifecycle management", "Static website hosting", "CDN integration"],
        url: "https://azure.microsoft.com/en-us/services/storage/",
        popularityRank: 1,
        subcategory: "object-storage"
      },
      {
        id: "aks",
        name: "AKS (Azure Kubernetes Service)",
        emoji: "🐳",
        description: "Managed Kubernetes service for containerized applications.",
        bestFor: "Containerized applications, microservices, CI/CD",
        supportedArchitectures: ["microservices", "container-orchestration"],
        category: "container",
        pricing: "Pay for worker nodes, control plane is free",
        features: ["Integrated monitoring", "Azure AD integration", "Auto scaling", "Virtual nodes", "Dev Spaces"],
        url: "https://azure.microsoft.com/en-us/services/kubernetes-service/",
        popularityRank: 1,
        subcategory: "orchestration"
      },
      {
        id: "container-instances",
        name: "Container Instances",
        emoji: "📦",
        description: "Run containers without managing servers or orchestrators.",
        bestFor: "Simple containerized workloads, batch jobs, CI/CD",
        supportedArchitectures: ["container-orchestration", "batch-etl"],
        category: "container",
        pricing: "Pay per second for CPU and memory",
        features: ["Fast startup", "Public IP connectivity", "Custom sizes", "Persistent storage", "Virtual network deployment"],
        url: "https://azure.microsoft.com/en-us/services/container-instances/",
        popularityRank: 2,
        subcategory: "containers"
      }
    ]
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
    complianceCertifications: ["SOC 1/2/3", "ISO 27001", "HIPAA", "PCI DSS", "GDPR"],
    products: [
      {
        id: "compute-engine",
        name: "Compute Engine",
        emoji: "🖥️",
        description: "Scalable virtual machines running in Google's data centers.",
        bestFor: "General-purpose computing, high-performance workloads",
        supportedArchitectures: ["client-server", "microservices", "monolith", "hybrid-cloud"],
        category: "compute",
        pricing: "Sustained use discounts, preemptible instances",
        features: ["Custom machine types", "Live migration", "Per-second billing", "Committed use discounts", "GPU support"],
        url: "https://cloud.google.com/compute",
        popularityRank: 1,
        subcategory: "virtual-machines"
      },
      {
        id: "cloud-run",
        name: "Cloud Run",
        emoji: "🏃",
        description: "Fully managed serverless platform for containerized applications.",
        bestFor: "Containerized web services, APIs, microservices",
        supportedArchitectures: ["serverless-web", "microservices", "container-orchestration"],
        category: "compute",
        pricing: "Pay for requests and compute time",
        features: ["Automatic scaling", "Built-in load balancing", "Custom domains", "Traffic splitting", "Integrated CI/CD"],
        url: "https://cloud.google.com/run",
        popularityRank: 2,
        subcategory: "serverless-containers"
      },
      {
        id: "cloud-functions",
        name: "Cloud Functions",
        emoji: "⚡",
        description: "Serverless execution environment for building and connecting cloud services.",
        bestFor: "Event-driven applications, microservices, data processing",
        supportedArchitectures: ["serverless-backend", "event-driven", "microservices"],
        category: "serverless",
        pricing: "Pay per invocation and compute time",
        features: ["Event triggers", "Automatic scaling", "Source-based deployment", "Environment variables", "VPC connectivity"],
        url: "https://cloud.google.com/functions",
        popularityRank: 1,
        subcategory: "functions"
      },
      {
        id: "cloud-sql",
        name: "Cloud SQL",
        emoji: "🗃️",
        description: "Fully managed relational database service for MySQL, PostgreSQL, and SQL Server.",
        bestFor: "Web applications, business applications, analytics",
        supportedArchitectures: ["client-server", "microservices", "hybrid-cloud"],
        category: "database",
        pricing: "Per hour for instances and storage",
        features: ["Automatic backups", "High availability", "Read replicas", "Point-in-time recovery", "Private IP"],
        url: "https://cloud.google.com/sql",
        popularityRank: 1,
        subcategory: "relational"
      },
      {
        id: "firestore",
        name: "Firestore",
        emoji: "🔥",
        description: "Flexible, scalable NoSQL cloud database for mobile, web, and server development.",
        bestFor: "Real-time applications, mobile apps, web apps",
        supportedArchitectures: ["serverless-backend", "microservices", "event-driven"],
        category: "database",
        pricing: "Pay for reads, writes, and storage",
        features: ["Real-time updates", "Offline support", "Multi-region", "ACID transactions", "Security rules"],
        url: "https://cloud.google.com/firestore",
        popularityRank: 2,
        subcategory: "nosql"
      },
      {
        id: "cloud-storage",
        name: "Cloud Storage",
        emoji: "📦",
        description: "Unified object storage for developers and enterprises.",
        bestFor: "Content serving, data archiving, disaster recovery",
        supportedArchitectures: ["jamstack", "client-server", "microservices", "batch-etl"],
        category: "storage",
        pricing: "Pay for storage and network usage",
        features: ["Multiple storage classes", "Lifecycle management", "Object versioning", "Global edge caching", "Strong consistency"],
        url: "https://cloud.google.com/storage",
        popularityRank: 1,
        subcategory: "object-storage"
      },
      {
        id: "gke",
        name: "GKE (Google Kubernetes Engine)",
        emoji: "🐳",
        description: "Managed Kubernetes service for containerized applications.",
        bestFor: "Containerized applications, microservices, hybrid deployments",
        supportedArchitectures: ["microservices", "container-orchestration"],
        category: "container",
        pricing: "Pay for worker nodes, management fee for standard clusters",
        features: ["Autopilot mode", "Workload Identity", "Binary Authorization", "Multi-cluster management", "Istio integration"],
        url: "https://cloud.google.com/kubernetes-engine",
        popularityRank: 1,
        subcategory: "orchestration"
      },
      {
        id: "bigquery",
        name: "BigQuery",
        emoji: "📊",
        description: "Serverless, highly scalable data warehouse for analytics and machine learning.",
        bestFor: "Data analytics, business intelligence, machine learning",
        supportedArchitectures: ["olap-focused", "batch-etl", "streaming-realtime"],
        category: "analytics",
        pricing: "Pay for queries and storage",
        features: ["Standard SQL", "Real-time analytics", "Machine learning", "Data transfer", "Federated queries"],
        url: "https://cloud.google.com/bigquery",
        popularityRank: 1,
        subcategory: "data-warehouse"
      }
    ]
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

export function getCloudPlatformProducts(platformId: string, architecture?: string): Record<string, CloudPlatformProduct[]> {
  const platform = getCloudPlatformById(platformId);
  if (!platform?.products) {
    return {};
  }

  let products = [...platform.products];

  // Filter by architecture if specified
  if (architecture) {
    products = products.filter(product =>
      product.supportedArchitectures.includes(architecture)
    );
  }

  // Sort by popularity rank (lower number = more popular)
  products.sort((a, b) => a.popularityRank - b.popularityRank);

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, CloudPlatformProduct[]>);

  return groupedProducts;
}

export function getCloudPlatformProductsBySubcategory(platformId: string, architecture?: string): Record<string, Record<string, CloudPlatformProduct[]>> {
  const platform = getCloudPlatformById(platformId);
  if (!platform?.products) {
    return {};
  }

  let products = [...platform.products];

  // Filter by architecture if specified
  if (architecture) {
    products = products.filter(product =>
      product.supportedArchitectures.includes(architecture)
    );
  }

  // Sort by popularity rank (lower number = more popular)
  products.sort((a, b) => a.popularityRank - b.popularityRank);

  // Group products by category and then by subcategory
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category;
    const subcategory = product.subcategory || 'other';
    
    if (!acc[category]) {
      acc[category] = {};
    }
    if (!acc[category][subcategory]) {
      acc[category][subcategory] = [];
    }
    acc[category][subcategory].push(product);
    return acc;
  }, {} as Record<string, Record<string, CloudPlatformProduct[]>>);

  return groupedProducts;
}

export function hasMultipleProducts(platformId: string): boolean {
  const platform = getCloudPlatformById(platformId);
  return !!(platform?.products && platform.products.length > 0);
}
