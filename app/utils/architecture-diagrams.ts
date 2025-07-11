import type { Architecture } from "~/data/project-types";

export interface ArchitectureDiagram {
  id: string;
  mermaidCode: string;
  description: string;
}

export const generateArchitectureDiagram = (architecture: Architecture): ArchitectureDiagram => {
  const diagramGenerators: Record<string, () => string> = {
    // Web Application Architectures
    "client-server": () => `
architecture-beta
    group client(internet)[Client Layer]
    group api(cloud)[API Layer]
    group data(database)[Data Layer]
    
    service browser(browser)[Web Browser] in client
    service mobile(phone)[Mobile App] in client
    service frontend(server)[Frontend Server] in api
    service backend(server)[Backend API] in api
    service database(database)[Database] in data
    service cache(server)[Cache] in data
    
    browser:R --> L:frontend
    mobile:R --> L:frontend
    frontend:R --> L:backend
    backend:R --> L:database
    backend:R --> L:cache
`,

    "monolith": () => `
architecture-beta
    group users(internet)[Users]
    group app(cloud)[Monolithic Application]
    group storage(database)[Storage]
    
    service browser(browser)[Web Browser] in users
    service mobile(phone)[Mobile Client] in users
    service monolith(server)[Monolithic Server] in app
    service database(database)[Database] in storage
    service files(disk)[File Storage] in storage
    
    browser:R --> L:monolith
    mobile:R --> L:monolith
    monolith:R --> L:database
    monolith:R --> L:files
`,

    "jamstack": () => `
architecture-beta
    group edge(internet)[Edge Network]
    group static(cloud)[Static Assets]
    group api(server)[API Services]
    group cms(database)[Content Management]
    
    service cdn(server)[CDN] in edge
    service spa(browser)[SPA] in static
    service functions(server)[Serverless Functions] in api
    service headless(database)[Headless CMS] in cms
    service db(database)[Database] in cms
    
    cdn:R --> L:spa
    spa:R --> L:functions
    functions:R --> L:headless
    headless:R --> L:db
`,

    "serverless-web": () => `
architecture-beta
    group users(internet)[Users]
    group edge(cloud)[Edge Computing]
    group functions(server)[Serverless Functions]
    group storage(database)[Storage Services]
    
    service browser(browser)[Browser] in users
    service cdn(server)[CDN] in edge
    service lambda(server)[Lambda Functions] in functions
    service api(server)[API Gateway] in functions
    service db(database)[Database] in storage
    service object(disk)[Object Storage] in storage
    
    browser:R --> L:cdn
    cdn:R --> L:api
    api:R --> L:lambda
    lambda:R --> L:db
    lambda:R --> L:object
`,

    // Mobile Application Architectures
    "client-server-mobile": () => `
architecture-beta
    group mobile(phone)[Mobile Clients]
    group api(cloud)[Backend Services]
    group data(database)[Data Layer]
    
    service ios(phone)[iOS App] in mobile
    service android(phone)[Android App] in mobile
    service backend(server)[Backend API] in api
    service auth(server)[Auth Service] in api
    service database(database)[Database] in data
    service cache(server)[Cache] in data
    
    ios:R --> L:backend
    android:R --> L:backend
    backend:R --> L:auth
    backend:R --> L:database
    backend:R --> L:cache
`,

    "baas": () => `
architecture-beta
    group mobile(phone)[Mobile Apps]
    group baas(cloud)[Backend-as-a-Service]
    group storage(database)[Cloud Storage]
    
    service ios(phone)[iOS App] in mobile
    service android(phone)[Android App] in mobile
    service auth(server)[Authentication] in baas
    service realtime(server)[Real-time DB] in baas
    service functions(server)[Cloud Functions] in baas
    service storage(disk)[File Storage] in storage
    service analytics(server)[Analytics] in storage
    
    ios:R --> L:auth
    android:R --> L:auth
    ios:R --> L:realtime
    android:R --> L:realtime
    realtime:R --> L:functions
    functions:R --> L:storage
    functions:R --> L:analytics
`,

    "serverless-backend": () => `
architecture-beta
    group mobile(phone)[Mobile Layer]
    group gateway(cloud)[API Gateway]
    group compute(server)[Serverless Compute]
    group storage(database)[Storage Layer]
    
    service app(phone)[Mobile App] in mobile
    service api(server)[API Gateway] in gateway
    service lambda(server)[Lambda Functions] in compute
    service dynamodb(database)[NoSQL DB] in storage
    service s3(disk)[Object Storage] in storage
    
    app:R --> L:api
    api:R --> L:lambda
    lambda:R --> L:dynamodb
    lambda:R --> L:s3
`,

    "edge-cdn": () => `
architecture-beta
    group users(internet)[Global Users]
    group edge(cloud)[Edge Network]
    group origin(server)[Origin Services]
    
    service mobile(phone)[Mobile Apps] in users
    service cdn(server)[Edge CDN] in edge
    service cache(server)[Edge Cache] in edge
    service api(server)[Origin API] in origin
    service storage(disk)[Asset Storage] in origin
    
    mobile:R --> L:cdn
    cdn:R --> L:cache
    cache:R --> L:api
    api:R --> L:storage
`,

    // API Product Architectures
    "monolithic-api": () => `
architecture-beta
    group clients(internet)[API Clients]
    group api(cloud)[API Service]
    group data(database)[Data Layer]
    
    service web(browser)[Web Client] in clients
    service mobile(phone)[Mobile Client] in clients
    service partner(server)[Partner API] in clients
    service monolith(server)[Monolithic API] in api
    service database(database)[Database] in data
    service cache(server)[Cache] in data
    
    web:R --> L:monolith
    mobile:R --> L:monolith
    partner:R --> L:monolith
    monolith:R --> L:database
    monolith:R --> L:cache
`,

    "gateway-microservices": () => `
architecture-beta
    group clients(internet)[API Clients]
    group gateway(cloud)[API Gateway]
    group services(server)[Microservices]
    group data(database)[Data Stores]
    
    service client(browser)[API Client] in clients
    service gateway(server)[API Gateway] in gateway
    service auth(server)[Auth Service] in services
    service users(server)[User Service] in services
    service orders(server)[Order Service] in services
    service userdb(database)[User DB] in data
    service orderdb(database)[Order DB] in data
    
    client:R --> L:gateway
    gateway:R --> L:auth
    gateway:R --> L:users
    gateway:R --> L:orders
    users:R --> L:userdb
    orders:R --> L:orderdb
`,

    "serverless-api": () => `
architecture-beta
    group clients(internet)[API Clients]
    group gateway(cloud)[API Gateway]
    group functions(server)[Cloud Functions]
    group storage(database)[Storage Services]
    
    service client(browser)[API Client] in clients
    service api(server)[API Gateway] in gateway
    service func1(server)[Function 1] in functions
    service func2(server)[Function 2] in functions
    service func3(server)[Function 3] in functions
    service db(database)[Database] in storage
    service queue(server)[Message Queue] in storage
    
    client:R --> L:api
    api:R --> L:func1
    api:R --> L:func2
    api:R --> L:func3
    func1:R --> L:db
    func2:R --> L:queue
    func3:R --> L:db
`,

    "federated-graphql": () => `
architecture-beta
    group clients(internet)[GraphQL Clients]
    group gateway(cloud)[GraphQL Gateway]
    group subgraphs(server)[Subgraph Services]
    group data(database)[Data Sources]
    
    service client(browser)[GraphQL Client] in clients
    service federation(server)[Apollo Federation] in gateway
    service users(server)[Users Subgraph] in subgraphs
    service products(server)[Products Subgraph] in subgraphs
    service orders(server)[Orders Subgraph] in subgraphs
    service userdb(database)[User DB] in data
    service productdb(database)[Product DB] in data
    service orderdb(database)[Order DB] in data
    
    client:R --> L:federation
    federation:R --> L:users
    federation:R --> L:products
    federation:R --> L:orders
    users:R --> L:userdb
    products:R --> L:productdb
    orders:R --> L:orderdb
`,

    // Microservice Architectures
    "microservices-rest": () => `
architecture-beta
    group clients(internet)[Clients]
    group gateway(cloud)[API Gateway]
    group services(server)[Microservices]
    group data(database)[Data Stores]
    
    service client(browser)[Client App] in clients
    service gateway(server)[API Gateway] in gateway
    service service1(server)[Service A] in services
    service service2(server)[Service B] in services
    service service3(server)[Service C] in services
    service db1(database)[DB A] in data
    service db2(database)[DB B] in data
    service db3(database)[DB C] in data
    
    client:R --> L:gateway
    gateway:R --> L:service1
    gateway:R --> L:service2
    gateway:R --> L:service3
    service1:R --> L:db1
    service2:R --> L:db2
    service3:R --> L:db3
`,

    "microservices-messaging": () => `
architecture-beta
    group clients(internet)[Clients]
    group gateway(cloud)[API Gateway]
    group services(server)[Microservices]
    group messaging(server)[Message Queue]
    group data(database)[Data Stores]
    
    service client(browser)[Client App] in clients
    service gateway(server)[API Gateway] in gateway
    service service1(server)[Service A] in services
    service service2(server)[Service B] in services
    service service3(server)[Service C] in services
    service queue(server)[Message Queue] in messaging
    service db1(database)[DB A] in data
    service db2(database)[DB B] in data
    
    client:R --> L:gateway
    gateway:R --> L:service1
    service1:R --> L:queue
    queue:R --> L:service2
    queue:R --> L:service3
    service1:R --> L:db1
    service2:R --> L:db2
`,

    "containerized-microservices": () => `
architecture-beta
    group clients(internet)[Clients]
    group k8s(cloud)[Kubernetes Cluster]
    group services(server)[Containerized Services]
    group data(database)[Data Layer]
    
    service client(browser)[Client App] in clients
    service ingress(server)[Ingress Controller] in k8s
    service service1(server)[Service A Pod] in services
    service service2(server)[Service B Pod] in services
    service service3(server)[Service C Pod] in services
    service db1(database)[DB A] in data
    service db2(database)[DB B] in data
    
    client:R --> L:ingress
    ingress:R --> L:service1
    ingress:R --> L:service2
    ingress:R --> L:service3
    service1:R --> L:db1
    service2:R --> L:db2
`,

    "service-mesh": () => `
architecture-beta
    group clients(internet)[Clients]
    group mesh(cloud)[Service Mesh]
    group services(server)[Microservices]
    group data(database)[Data Layer]
    
    service client(browser)[Client App] in clients
    service gateway(server)[Mesh Gateway] in mesh
    service proxy1(server)[Service A + Proxy] in services
    service proxy2(server)[Service B + Proxy] in services
    service proxy3(server)[Service C + Proxy] in services
    service db1(database)[DB A] in data
    service db2(database)[DB B] in data
    
    client:R --> L:gateway
    gateway:R --> L:proxy1
    proxy1:R --> L:proxy2
    proxy2:R --> L:proxy3
    proxy1:R --> L:db1
    proxy2:R --> L:db2
`,

    // Desktop Application Architectures
    "electron-webview": () => `
architecture-beta
    group desktop(computer)[Desktop Environment]
    group app(cloud)[Electron App]
    group services(server)[External Services]
    
    service os(computer)[Operating System] in desktop
    service electron(browser)[Electron Main] in app
    service renderer(browser)[Renderer Process] in app
    service webview(browser)[Web Technologies] in app
    service api(server)[External API] in services
    service files(disk)[Local Files] in services
    
    os:R --> L:electron
    electron:R --> L:renderer
    renderer:R --> L:webview
    webview:R --> L:api
    electron:R --> L:files
`,

    "native-local-api": () => `
architecture-beta
    group desktop(computer)[Desktop Environment]
    group app(cloud)[Native Application]
    group local(server)[Local Services]
    
    service os(computer)[Operating System] in desktop
    service ui(computer)[Native UI] in app
    service business(server)[Business Logic] in app
    service localapi(server)[Local API] in local
    service sqlite(database)[SQLite] in local
    
    os:R --> L:ui
    ui:R --> L:business
    business:R --> L:localapi
    localapi:R --> L:sqlite
`,

    "tauri-lightweight": () => `
architecture-beta
    group desktop(computer)[Desktop Environment]
    group app(cloud)[Tauri Application]
    group services(server)[Services]
    
    service os(computer)[Operating System] in desktop
    service tauri(server)[Tauri Backend] in app
    service webview(browser)[Web Frontend] in app
    service api(server)[External API] in services
    service files(disk)[Local Storage] in services
    
    os:R --> L:tauri
    tauri:R --> L:webview
    webview:R --> L:api
    tauri:R --> L:files
`,

    "cloud-powered-desktop": () => `
architecture-beta
    group desktop(computer)[Desktop Environment]
    group app(cloud)[Desktop Client]
    group cloud(server)[Cloud Services]
    
    service os(computer)[Operating System] in desktop
    service client(browser)[Thin Client] in app
    service sync(server)[Sync Engine] in app
    service cloudapi(server)[Cloud API] in cloud
    service storage(disk)[Cloud Storage] in cloud
    service compute(server)[Cloud Compute] in cloud
    
    os:R --> L:client
    client:R --> L:sync
    sync:R --> L:cloudapi
    cloudapi:R --> L:storage
    cloudapi:R --> L:compute
`,

    // Analytics & Reporting Architectures
    "batch-etl": () => `
architecture-beta
    group sources(database)[Data Sources]
    group etl(server)[ETL Pipeline]
    group warehouse(database)[Data Warehouse]
    group viz(browser)[Visualization]
    
    service source1(database)[Source DB 1] in sources
    service source2(database)[Source DB 2] in sources
    service extract(server)[Extract] in etl
    service transform(server)[Transform] in etl
    service load(server)[Load] in etl
    service dw(database)[Data Warehouse] in warehouse
    service bi(browser)[BI Dashboard] in viz
    
    source1:R --> L:extract
    source2:R --> L:extract
    extract:R --> L:transform
    transform:R --> L:load
    load:R --> L:dw
    dw:R --> L:bi
`,

    "streaming-realtime": () => `
architecture-beta
    group sources(database)[Data Sources]
    group stream(server)[Stream Processing]
    group storage(database)[Real-time Storage]
    group viz(browser)[Real-time Viz]
    
    service events(server)[Event Sources] in sources
    service kafka(server)[Kafka] in stream
    service flink(server)[Stream Processor] in stream
    service clickhouse(database)[ClickHouse] in storage
    service redis(server)[Redis Cache] in storage
    service dashboard(browser)[Real-time Dashboard] in viz
    
    events:R --> L:kafka
    kafka:R --> L:flink
    flink:R --> L:clickhouse
    flink:R --> L:redis
    clickhouse:R --> L:dashboard
    redis:R --> L:dashboard
`,

    "olap-focused": () => `
architecture-beta
    group sources(database)[Data Sources]
    group warehouse(database)[Data Warehouse]
    group olap(server)[OLAP Engine]
    group bi(browser)[BI Tools]
    
    service transactional(database)[Transactional DB] in sources
    service files(disk)[Data Files] in sources
    service dw(database)[Data Warehouse] in warehouse
    service cubes(server)[OLAP Cubes] in olap
    service cache(server)[Query Cache] in olap
    service reports(browser)[Reports] in bi
    service dashboards(browser)[Dashboards] in bi
    
    transactional:R --> L:dw
    files:R --> L:dw
    dw:R --> L:cubes
    cubes:R --> L:cache
    cache:R --> L:reports
    cache:R --> L:dashboards
`,

    "embedded-analytics": () => `
architecture-beta
    group app(browser)[Main Application]
    group analytics(cloud)[Analytics Platform]
    group data(database)[Data Layer]
    
    service webapp(browser)[Web Application] in app
    service iframe(browser)[Embedded Dashboard] in app
    service platform(server)[Analytics Platform] in analytics
    service api(server)[Analytics API] in analytics
    service warehouse(database)[Data Warehouse] in data
    service metrics(server)[Metrics Store] in data
    
    webapp:R --> L:iframe
    iframe:R --> L:platform
    platform:R --> L:api
    api:R --> L:warehouse
    api:R --> L:metrics
`
  };

  const generator = diagramGenerators[architecture.id];
  if (!generator) {
    return {
      id: architecture.id,
      mermaidCode: `
architecture-beta
    group system(cloud)[${architecture.name}]
    
    service component(server)[Main Component] in system
    service data(database)[Data Store] in system
    
    component:R --> L:data
`,
      description: `Generic architecture diagram for ${architecture.name}. This is a placeholder diagram as no specific diagram has been defined for this architecture pattern yet.`
    };
  }

  return {
    id: architecture.id,
    mermaidCode: generator().trim(),
    description: `Architecture diagram showing the ${architecture.name} pattern: ${architecture.description}`
  };
};

export const getAllArchitectureDiagrams = (): ArchitectureDiagram[] => {
  // This would be populated with all architectures from project-types.ts
  // For now, we'll return an empty array as this function would be called
  // when we need to generate diagrams for all architectures
  return [];
};
