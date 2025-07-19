# CreateStack - Technology Planning & Decision Platform

A cross-functional platform that helps technology leaders communicate and justify technical decisions to product, finance, and compliance teams.

> 📋 **[Product Vision Document](PRODUCT_VISION.md)** - Comprehensive product strategy, roadmap, and market analysis  
> 🔧 **[Feature Briefs](FEATURE_BRIEFS.md)** - Detailed feature specifications, user stories, and technical requirements

## Business Value

CreateStack bridges the gap between technical decisions and business outcomes by providing:
- **Budget Transparency**: Clear vendor costs and procurement requirements for finance teams
- **Risk Communication**: Security and compliance documentation for stakeholders  
- **Process Standardization**: Repeatable technology choices that reduce training costs
- **Decision Accountability**: Documented rationale for technology investments
- **Time-to-Market**: Faster project starts with proven technology patterns

## Key Features for Engineering Leaders

- 🎯 **Strategic Architecture Patterns**: From monoliths to microservices, choose patterns that fit your team size and business objectives
- 🔒 **Security-First Tooling**: Integrated dependency management and vulnerability scanning recommendations
- � **Decision Documentation**: Auto-generated ADRs that justify technology choices to stakeholders
- 💼 **Vendor Evaluation**: Structured comparisons for procurement and compliance processes  
- 🏗️ **Infrastructure as Code**: Ready-to-deploy templates in Terraform, CDK, and CloudFormation
- � **Portfolio Management**: Track technology decisions across multiple projects

## Target Audience

- **CTOs** making strategic technology investments
- **VPs of Engineering** standardizing team practices  
- **Architecture Teams** documenting decisions and patterns
- **Engineering Managers** onboarding new teams to established patterns

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
