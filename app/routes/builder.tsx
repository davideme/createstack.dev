import type { Route } from "./+types/builder";
import Project from "../components/project";
import { AppLayout } from "../components/shared/app-layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Technology Stack Builder - CreateStack" },
    { name: "description", content: "Build a comprehensive technology stack from scratch with guided recommendations and architecture patterns." },
  ];
}

export default function Builder() {
  return (
    <AppLayout 
      title="Technology Stack Builder"
      description="Build a comprehensive technology stack from scratch with guided recommendations"
    >
      <Project />
    </AppLayout>
  );
}
