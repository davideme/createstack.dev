import type { Platform } from "~/types/project";

export const platforms: Platform[] = [
  {
    id: "github",
    name: "GitHub",
    emoji: "🐙",
    description: "Most popular platform with strong community, Git-based, CI/CD via Actions. ✅ Pull Requests supported.",
    bestFor: "Open-source projects, startups, enterprise.",
    url: "https://github.com/new?name="
  },
  {
    id: "gitlab",
    name: "GitLab",
    emoji: "🦊",
    description: "All-in-one DevOps platform (Git + CI/CD + issue tracking + container registry). ✅ Merge Requests supported.",
    bestFor: "End-to-end software lifecycle management.",
    url: "https://gitlab.com/projects/new?project%5Bname%5D="
  },
  {
    id: "bitbucket",
    name: "Bitbucket",
    emoji: "🪣",
    description: "Atlassian product with Jira integration, supports Git and Mercurial (legacy). ✅ Pull Requests supported.",
    bestFor: "Teams using Jira and other Atlassian tools.",
    url: "https://bitbucket.org/repo/create?name="
  },
  {
    id: "azure",
    name: "Azure Repos",
    emoji: "☁️",
    description: "Part of Azure DevOps; supports Git and TFVC repositories. ✅ Pull Requests supported.",
    bestFor: "Microsoft stack and Azure cloud users.",
    url: "https://dev.azure.com/"
  },
  {
    id: "codecommit",
    name: "AWS CodeCommit",
    emoji: "⚡",
    description: "Fully managed Git hosting by AWS. Integrates with IAM and other AWS tools. ✅ Pull Requests supported.",
    bestFor: "Cloud-native teams using AWS infrastructure.",
    url: "https://console.aws.amazon.com/codesuite/codecommit/repositories/new"
  },
  {
    id: "sourcehut",
    name: "SourceHut",
    emoji: "🏚️",
    description: "Minimalist, open-source focused. No JavaScript frontend. ⚠️ Uses email-based patch workflows instead of web-based pull requests.",
    bestFor: "Lightweight, privacy-conscious development.",
    url: "https://git.sr.ht/create"
  },
  {
    id: "gitea",
    name: "Gitea / Gogs",
    emoji: "🍃",
    description: "Self-hosted, lightweight Git servers. ✅ Pull Requests supported.",
    bestFor: "Teams needing self-hosted, low-overhead Git.",
    url: "#" // Self-hosted, no direct URL
  }
];
