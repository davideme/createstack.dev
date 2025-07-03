import type { Route } from "./+types/home";
import Dashboard from "../components/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Project - CreateStack" },
    { name: "description", content: "Modern project creation dashboard built with shadcn/ui" },
  ];
}

export default function Home() {
  return <Dashboard />;
}
