import type { CloudPlatformProduct } from "~/types/project";

export interface ServiceProductMapping {
  serviceCategory: 'frontend' | 'backend' | 'database' | 'storage' | 'messaging' | 'auth' | 'cdn' | 'monitoring' | 'other';
  serviceName: string; // Exact match with ArchitectureService.name
  cloudPlatform: 'aws' | 'azure' | 'gcp';
  productId?: string; // Cloud product ID, undefined if no direct equivalent
  isDirectEquivalent: boolean; // false for services with no direct cloud product
  notes?: string; // Explanation when no direct equivalent
}

// AWS Mappings
export const awsServiceMappings: ServiceProductMapping[] = [
  // Frontend Services
  { serviceCategory: 'frontend', serviceName: 'Frontend Application', cloudPlatform: 'aws', productId: 's3-static-hosting', isDirectEquivalent: true },
  { serviceCategory: 'frontend', serviceName: 'Static Site Generator', cloudPlatform: 'aws', productId: 's3-static-hosting', isDirectEquivalent: true },
  { serviceCategory: 'frontend', serviceName: 'Mobile Application', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Mobile app development (React Native/Flutter + AWS backend)' },
  { serviceCategory: 'frontend', serviceName: 'Electron Framework', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Desktop application framework' },
  { serviceCategory: 'frontend', serviceName: 'Web Frontend', cloudPlatform: 'aws', productId: 's3-static-hosting', isDirectEquivalent: true },
  { serviceCategory: 'frontend', serviceName: 'Native UI Framework', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Native desktop UI toolkit' },
  { serviceCategory: 'frontend', serviceName: 'Tauri Runtime', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Rust-based desktop framework' },
  { serviceCategory: 'frontend', serviceName: 'Desktop Client', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Thin client application' },
  { serviceCategory: 'frontend', serviceName: 'Embedded Dashboard', cloudPlatform: 'aws', productId: 'quicksight', isDirectEquivalent: true },
  { serviceCategory: 'frontend', serviceName: 'Host Application', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Main application hosting embedded analytics' },
  { serviceCategory: 'frontend', serviceName: 'BI Platform', cloudPlatform: 'aws', productId: 'quicksight', isDirectEquivalent: true },
  { serviceCategory: 'frontend', serviceName: 'Real-time Dashboard', cloudPlatform: 'aws', productId: 'quicksight', isDirectEquivalent: true },
  { serviceCategory: 'frontend', serviceName: 'Visualization Tool', cloudPlatform: 'aws', productId: 'quicksight', isDirectEquivalent: true },

  // Backend Services
  { serviceCategory: 'backend', serviceName: 'Backend API', cloudPlatform: 'aws', productId: 'ec2', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'Monolithic Application', cloudPlatform: 'aws', productId: 'ec2', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'Serverless Functions', cloudPlatform: 'aws', productId: 'lambda', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'API Server', cloudPlatform: 'aws', productId: 'ec2', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'BaaS Platform', cloudPlatform: 'aws', productId: 'amplify', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'Headless CMS', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Third-party CMS hosted on AWS (Strapi, Contentful)' },
  { serviceCategory: 'backend', serviceName: 'Cloud Functions', cloudPlatform: 'aws', productId: 'lambda', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'Edge Functions', cloudPlatform: 'aws', productId: 'lambda-edge', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'Origin Server', cloudPlatform: 'aws', productId: 'ec2', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'Microservices', cloudPlatform: 'aws', productId: 'ecs', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'Subgraph Services', cloudPlatform: 'aws', productId: 'lambda', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'Containerized Services', cloudPlatform: 'aws', productId: 'ecs', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'Main Process', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Node.js backend for system access' },
  { serviceCategory: 'backend', serviceName: 'Local API Server', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Embedded HTTP/gRPC server' },
  { serviceCategory: 'backend', serviceName: 'Rust Backend', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Native backend with system access' },
  { serviceCategory: 'backend', serviceName: 'Cloud Backend', cloudPlatform: 'aws', productId: 'ec2', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'Data Processing Engine', cloudPlatform: 'aws', productId: 'glue', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'Stream Analytics', cloudPlatform: 'aws', productId: 'kinesis-analytics', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'Data Modeling', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'dbt or similar transformation layer' },
  { serviceCategory: 'backend', serviceName: 'Query Engine', cloudPlatform: 'aws', productId: 'athena', isDirectEquivalent: true },
  { serviceCategory: 'backend', serviceName: 'Analytics API', cloudPlatform: 'aws', productId: 'lambda', isDirectEquivalent: true },

  // Database Services
  { serviceCategory: 'database', serviceName: 'Database', cloudPlatform: 'aws', productId: 'rds', isDirectEquivalent: true },
  { serviceCategory: 'database', serviceName: 'Serverless Database', cloudPlatform: 'aws', productId: 'dynamodb', isDirectEquivalent: true },
  { serviceCategory: 'database', serviceName: 'Real-time Database', cloudPlatform: 'aws', productId: 'dynamodb', isDirectEquivalent: true },
  { serviceCategory: 'database', serviceName: 'NoSQL Database', cloudPlatform: 'aws', productId: 'dynamodb', isDirectEquivalent: true },
  { serviceCategory: 'database', serviceName: 'Global Database', cloudPlatform: 'aws', productId: 'aurora-global', isDirectEquivalent: true },
  { serviceCategory: 'database', serviceName: 'Databases', cloudPlatform: 'aws', productId: 'rds', isDirectEquivalent: true },
  { serviceCategory: 'database', serviceName: 'Event Store', cloudPlatform: 'aws', productId: 'dynamodb', isDirectEquivalent: true },
  { serviceCategory: 'database', serviceName: 'Local Database', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'SQLite or IndexedDB for local storage' },
  { serviceCategory: 'database', serviceName: 'Embedded Database', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'SQLite, RocksDB, or LevelDB' },
  { serviceCategory: 'database', serviceName: 'Local Storage', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'File-based or embedded database' },
  { serviceCategory: 'database', serviceName: 'Data Warehouse', cloudPlatform: 'aws', productId: 'redshift', isDirectEquivalent: true },
  { serviceCategory: 'database', serviceName: 'Real-time Database', cloudPlatform: 'aws', productId: 'timestream', isDirectEquivalent: true },
  { serviceCategory: 'database', serviceName: 'OLAP Database', cloudPlatform: 'aws', productId: 'redshift', isDirectEquivalent: true },
  { serviceCategory: 'database', serviceName: 'Data Source', cloudPlatform: 'aws', productId: 'rds', isDirectEquivalent: true },

  // Storage Services
  { serviceCategory: 'storage', serviceName: 'File Storage', cloudPlatform: 'aws', productId: 's3', isDirectEquivalent: true },
  { serviceCategory: 'storage', serviceName: 'Object Storage', cloudPlatform: 'aws', productId: 's3', isDirectEquivalent: true },
  { serviceCategory: 'storage', serviceName: 'Cloud Storage', cloudPlatform: 'aws', productId: 's3', isDirectEquivalent: true },
  { serviceCategory: 'storage', serviceName: 'Container Registry', cloudPlatform: 'aws', productId: 'ecr', isDirectEquivalent: true },
  { serviceCategory: 'storage', serviceName: 'File System Access', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Local file management' },
  { serviceCategory: 'storage', serviceName: 'Local Cache', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Offline data and asset storage' },
  { serviceCategory: 'storage', serviceName: 'Data Lake', cloudPlatform: 'aws', productId: 's3', isDirectEquivalent: true },

  // CDN Services
  { serviceCategory: 'cdn', serviceName: 'CDN', cloudPlatform: 'aws', productId: 'cloudfront', isDirectEquivalent: true },
  { serviceCategory: 'cdn', serviceName: 'CDN/Hosting', cloudPlatform: 'aws', productId: 'cloudfront', isDirectEquivalent: true },

  // Auth Services
  { serviceCategory: 'auth', serviceName: 'Authentication Service', cloudPlatform: 'aws', productId: 'cognito', isDirectEquivalent: true },
  { serviceCategory: 'auth', serviceName: 'Authentication', cloudPlatform: 'aws', productId: 'cognito', isDirectEquivalent: true },
  { serviceCategory: 'auth', serviceName: 'Certificate Authority', cloudPlatform: 'aws', productId: 'acm', isDirectEquivalent: true },
  { serviceCategory: 'auth', serviceName: 'Security Layer', cloudPlatform: 'aws', productId: 'iam', isDirectEquivalent: true },

  // Messaging Services
  { serviceCategory: 'messaging', serviceName: 'Message Queue', cloudPlatform: 'aws', productId: 'sqs', isDirectEquivalent: true },
  { serviceCategory: 'messaging', serviceName: 'Message Broker', cloudPlatform: 'aws', productId: 'msk', isDirectEquivalent: true },
  { serviceCategory: 'messaging', serviceName: 'Dead Letter Queue', cloudPlatform: 'aws', productId: 'sqs', isDirectEquivalent: true },
  { serviceCategory: 'messaging', serviceName: 'Event Streaming', cloudPlatform: 'aws', productId: 'kinesis', isDirectEquivalent: true },
  { serviceCategory: 'messaging', serviceName: 'Real-time Updates', cloudPlatform: 'aws', productId: 'sns', isDirectEquivalent: true },
  { serviceCategory: 'messaging', serviceName: 'Stream Processing', cloudPlatform: 'aws', productId: 'kinesis', isDirectEquivalent: true },

  // Monitoring Services
  { serviceCategory: 'monitoring', serviceName: 'Monitoring', cloudPlatform: 'aws', productId: 'cloudwatch', isDirectEquivalent: true },
  { serviceCategory: 'monitoring', serviceName: 'Monitoring & Tracing', cloudPlatform: 'aws', productId: 'x-ray', isDirectEquivalent: true },
  { serviceCategory: 'monitoring', serviceName: 'Monitoring Stack', cloudPlatform: 'aws', productId: 'cloudwatch', isDirectEquivalent: true },
  { serviceCategory: 'monitoring', serviceName: 'Observability Stack', cloudPlatform: 'aws', productId: 'x-ray', isDirectEquivalent: true },
  { serviceCategory: 'monitoring', serviceName: 'Alerting System', cloudPlatform: 'aws', productId: 'cloudwatch', isDirectEquivalent: true },
  { serviceCategory: 'monitoring', serviceName: 'Analytics', cloudPlatform: 'aws', productId: 'cloudwatch', isDirectEquivalent: true },

  // Other Services
  { serviceCategory: 'other', serviceName: 'Load Balancer', cloudPlatform: 'aws', productId: 'alb', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Cache Layer', cloudPlatform: 'aws', productId: 'elasticache', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Background Jobs', cloudPlatform: 'aws', productId: 'sqs', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'External APIs', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Third-party services and data sources' },
  { serviceCategory: 'other', serviceName: 'API Gateway', cloudPlatform: 'aws', productId: 'api-gateway', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Push Notifications', cloudPlatform: 'aws', productId: 'sns', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Service Registry', cloudPlatform: 'aws', productId: 'service-discovery', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Load Balancers', cloudPlatform: 'aws', productId: 'alb', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Schema Registry', cloudPlatform: 'aws', productId: 'glue-schema-registry', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'GraphQL Gateway', cloudPlatform: 'aws', productId: 'appsync', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Caching Layer', cloudPlatform: 'aws', productId: 'elasticache', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Event Triggers', cloudPlatform: 'aws', productId: 'eventbridge', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Container Orchestrator', cloudPlatform: 'aws', productId: 'eks', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Ingress Controller', cloudPlatform: 'aws', productId: 'alb', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Config Management', cloudPlatform: 'aws', productId: 'parameter-store', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Service Mesh Control Plane', cloudPlatform: 'aws', productId: 'app-mesh', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Sidecar Proxies', cloudPlatform: 'aws', productId: 'app-mesh', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Traffic Management', cloudPlatform: 'aws', productId: 'app-mesh', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Auto Updater', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Application update mechanism' },
  { serviceCategory: 'other', serviceName: 'Native Modules', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Platform-specific integrations' },
  { serviceCategory: 'other', serviceName: 'System Integration', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'OS-specific features and APIs' },
  { serviceCategory: 'other', serviceName: 'Background Services', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'System tray or daemon processes' },
  { serviceCategory: 'other', serviceName: 'Sync Engine', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Offline/online data synchronization' },
  { serviceCategory: 'other', serviceName: 'System APIs', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Native OS integration layer' },
  { serviceCategory: 'other', serviceName: 'WebView Bridge', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Communication between web and native' },
  { serviceCategory: 'other', serviceName: 'Edge Cache', cloudPlatform: 'aws', productId: 'cloudfront', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Workflow Orchestrator', cloudPlatform: 'aws', productId: 'step-functions', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'Data Catalog', cloudPlatform: 'aws', productId: 'glue-catalog', isDirectEquivalent: true },
  { serviceCategory: 'other', serviceName: 'White-labeling', cloudPlatform: 'aws', productId: undefined, isDirectEquivalent: false, notes: 'Custom theming and branding' },
];

// Function to get product mapping for a service
export function getServiceProductMapping(
  serviceName: string, 
  serviceCategory: string, 
  cloudPlatform: 'aws' | 'azure' | 'gcp'
): ServiceProductMapping | undefined {
  const mappings = cloudPlatform === 'aws' ? awsServiceMappings : 
                   cloudPlatform === 'azure' ? [] : // TODO: Add Azure mappings
                   []; // TODO: Add GCP mappings
  
  return mappings.find(mapping => 
    mapping.serviceName === serviceName && 
    mapping.serviceCategory === serviceCategory
  );
}

// Function to get all mappings for a specific cloud platform
export function getServiceMappingsForPlatform(cloudPlatform: 'aws' | 'azure' | 'gcp'): ServiceProductMapping[] {
  return cloudPlatform === 'aws' ? awsServiceMappings :
         cloudPlatform === 'azure' ? [] : // TODO: Add Azure mappings
         []; // TODO: Add GCP mappings
}
