import type { Route } from "./+types/home";
import Dashboard from "../components/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - CreateStack" },
    { name: "description", content: "Modern dashboard built with shadcn/ui" },
  ];
}

export default function Home() {
  return <Dashboard />;
}
