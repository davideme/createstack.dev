import type { Route } from "./+types/home";
import Dashboard from "../components/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Technology Planning & Decisions - CreateStack" },
    { name: "description", content: "Cross-functional platform for technology decisions. Communicate technical choices to product, finance, and compliance teams with clear business justification." },
  ];
}

export default function Home() {
  return <Dashboard />;
}
