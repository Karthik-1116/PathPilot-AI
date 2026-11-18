import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Compass,
  FolderOpen,
  ListChecks,
  MessageCircle,
  RefreshCw,
  Route,
  TrendingUp,
  UserRound,
  Waypoints,
  Zap,
} from "lucide-react";

export const siteConfig = {
  name: "PathPilot AI",
  description:
    "PathPilot AI turns your current skills, career goal, and available time into a personalized, project-based learning roadmap.",
  nav: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Sample roadmap", href: "#roadmap" },
    { label: "Benefits", href: "#benefits" },
  ],
  footerNav: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Sample roadmap", href: "#roadmap" },
    { label: "Benefits", href: "#benefits" },
  ],
  builtWith: [
    { label: "Next.js", href: "https://nextjs.org/docs" },
    { label: "Supabase", href: "https://supabase.com/docs" },
    { label: "Gemini API", href: "https://ai.google.dev/gemini-api/docs" },
  ],
} as const;

export interface LandingStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const howItWorksSteps: LandingStep[] = [
  {
    icon: UserRound,
    title: "Build your learner profile",
    description:
      "Share your education, current skills, career goal, and the hours you can realistically commit each day.",
  },
  {
    icon: Waypoints,
    title: "Let AI chart the route",
    description:
      "Gemini maps the gap between where you are and where you want to be, then sequences stages, topics, and projects.",
  },
  {
    icon: TrendingUp,
    title: "Learn, track, and adapt",
    description:
      "Mark topics complete, follow the next milestone, and regenerate your roadmap whenever your goals change.",
  },
];

export type FeatureLayout = "wide" | "narrow" | "third" | "full";

export interface LandingFeature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  layout: FeatureLayout;
}

export const features: LandingFeature[] = [
  {
    id: "roadmap",
    icon: Route,
    title: "A roadmap built around you",
    description:
      "No generic curriculum. Your current skills, target role, and weekly time budget shape every stage and project.",
    layout: "wide",
  },
  {
    id: "assistant",
    icon: MessageCircle,
    title: "An assistant that knows your plan",
    description:
      "Ask what to learn next or request a simpler explanation. The AI uses your goal and roadmap as context.",
    layout: "narrow",
  },
  {
    id: "assessment",
    icon: ListChecks,
    title: "Find the gaps that matter",
    description:
      "Short subject assessments estimate your proficiency so the roadmap starts in the right place.",
    layout: "third",
  },
  {
    id: "resources",
    icon: BookOpen,
    title: "Resources worth your time",
    description:
      "Tutorials, documentation, courses, and practice platforms attached to the topics you are actually learning.",
    layout: "third",
  },
  {
    id: "projects",
    icon: FolderOpen,
    title: "Projects that prove progress",
    description:
      "Every stage includes something practical to build, giving you portfolio evidence instead of just certificates.",
    layout: "third",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Progress you can see",
    description:
      "Track completed topics, weekly activity, project milestones, and overall roadmap completion in one place.",
    layout: "full",
  },
];

export interface LandingBenefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const benefits: LandingBenefit[] = [
  {
    icon: Compass,
    title: "Clarity over collection",
    description:
      "Stop saving tutorials you never start. Every learning session begins with one clear next step.",
  },
  {
    icon: Zap,
    title: "Momentum that fits your week",
    description:
      "Plans are sized around your available hours, so progress stays realistic on busy weeks.",
  },
  {
    icon: FolderOpen,
    title: "Proof, not just notes",
    description:
      "Each stage ends with a project you can show on GitHub, in interviews, or in your capstone review.",
  },
  {
    icon: RefreshCw,
    title: "A plan that can change",
    description:
      "New skill, new goal, new schedule? Regenerate the roadmap without losing what you have already completed.",
  },
];
