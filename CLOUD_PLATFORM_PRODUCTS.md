# Cloud Platform Products Feature

## Overview

The Cloud Platform Products feature automatically displays relevant cloud services when a cloud platform with multiple products/services is selected and an architecture pattern is chosen.

## How it Works

1. **Platform Selection**: When a user selects a cloud platform (AWS, Azure, or GCP)
2. **Architecture Pattern**: When an architecture pattern is also selected
3. **Products Display**: A new card appears showing recommended services for that specific architecture pattern

## Supported Platforms

### AWS (Amazon Web Services)
- **EC2** - Virtual servers for client-server, microservices, monolith architectures
- **Lambda** - Serverless compute for serverless-web, serverless-backend, event-driven
- **RDS** - Managed databases for client-server, microservices, monolith
- **S3** - Object storage for jamstack, static websites, data storage
- **ECS** - Container orchestration for microservices, containerized apps
- **API Gateway** - API management for serverless and microservices

### Azure (Microsoft Azure)
- **App Service** - Web apps for client-server, serverless-web, microservices
- **Azure Functions** - Serverless for event-driven, microservices
- **SQL Database** - Managed SQL for client-server, microservices
- **Azure Storage** - Cloud storage for jamstack, static sites, data
- **AKS** - Kubernetes service for microservices, container orchestration

### GCP (Google Cloud Platform)
- **Compute Engine** - Virtual machines for client-server, microservices, monolith
- **Cloud Functions** - Serverless for event-driven, microservices
- **Cloud SQL** - Managed databases for client-server, microservices
- **Cloud Storage** - Object storage for jamstack, static sites, data
- **GKE** - Kubernetes Engine for microservices, containers
- **BigQuery** - Data warehouse for analytics, OLAP-focused architectures

## Features

### Architecture-Specific Filtering
Products are filtered based on the selected architecture pattern. Only services that support the chosen architecture are displayed.

### Categorized Display
Services are organized by category:
- 💻 Compute
- 🗃️ Database
- 📦 Storage
- 🌐 Networking
- 🤖 AI/ML
- 📊 Analytics
- ⚡ Serverless
- 🐳 Container
- 📨 Messaging
- 🔒 Security

### Rich Information
Each service displays:
- Description and best use cases
- Pricing model
- Key features
- Supported architectures
- Direct links to documentation

### Visual Indicators
- The main Cloud Platform card shows when additional services are available
- Architecture compatibility badges highlight relevant patterns
- Service cards use color coding for better organization

## Implementation Details

### Data Structure
```typescript
interface CloudPlatformProduct {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bestFor: string;
  supportedArchitectures: string[];
  category: 'compute' | 'database' | 'storage' | 'networking' | 'ai-ml' | 'analytics' | 'serverless' | 'container' | 'messaging' | 'security';
  pricing: string;
  features: string[];
  url?: string;
}
```

### Key Functions
- `hasMultipleProducts(platformId)` - Check if platform has product definitions
- `getCloudPlatformProducts(platformId, architecture)` - Get filtered products
- `CloudPlatformProductsCard` - Component for displaying products

### Conditional Rendering
The products card only appears when:
1. A platform with multiple products is selected (AWS, Azure, GCP)
2. An architecture pattern is chosen
3. There are relevant products for that architecture

This ensures the UI remains clean and relevant to the user's selections.
