import type { Route } from "./+types/home";
import { SmartStackAnalyzer } from "../components/smart-stack-analyzer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Stack Analysis & Builder - CreateStack" },
    { name: "description", content: "Analyze your existing technology stack for gaps or build a new stack from scratch with guided recommendations." },
  ];
}

export default function Home() {
  return <SmartStackAnalyzer />;
}
