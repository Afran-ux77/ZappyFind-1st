import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import {
  Bookmark,
  Briefcase,
  Check,
  ChevronRight,
  Eye,
  ExternalLink,
  ChevronDown,
  Bell,
  Search,
  ArrowUpDown,
  X,
  MapPin,
  Sparkles,
  Globe,
  CalendarClock,
  Send,
  ThumbsDown,
} from "lucide-react";

export type Job = {
  id: string;
  title: string;
  company: string;
  postedAgo: string;
  location: string;
  locationType: string;
  salary: string;
  logoLetter: string;
  logoColor: string;
  matchScore?: number;
  /** Total years of relevant experience typically required for the role (shown when match score is below the experience chip threshold). */
  experienceYearsMin: number;
  experienceYearsMax: number;
  headlines: string;
  whyFit: string;
  watchOut: string;
  jobDescription: string;
  externalUrl?: string;
};

export const JOBS: Job[] = [
  {
    id: "1",
    title: "Senior UX Designer",
    company: "Arctic Wolf",
    postedAgo: "2w ago",
    location: "Bengaluru",
    locationType: "Onsite",
    salary: "est. 10 LPA – 15 LPA",
    logoLetter: "A",
    logoColor: "#1E40AF",
    matchScore: 92,
    experienceYearsMin: 4,
    experienceYearsMax: 7,
    headlines:
      "Arctic Wolf protects organizations with its Aurora Platform. You'd be a Senior UX Designer on the XDR team.",
    whyFit:
      "Your ~3 years in B2B SaaS product design and AI UX align well with this Senior UX Designer role.",
    watchOut:
      "Compensation and specific team growth opportunities need to be clarified.",
    jobDescription:
      "At Arctic Wolf, you won't just watch the cybersecurity industry evolve — you'll help lead the change. Our global Pack is made up of people who thrive on pushing boundaries, solving problems, and building things that matter. As a Senior UX Designer, you'll own the end-to-end design of key product surfaces, collaborate cross-functionally with product managers and engineers, and shape the experience of security practitioners worldwide.",
    externalUrl: "https://arcticwolf.com/company/careers/",
  },
  {
    id: "2",
    title: "Product Designer · Growth",
    company: "Northwind Tech",
    postedAgo: "5d ago",
    location: "Remote",
    locationType: "India",
    salary: "est. 20 LPA – 28 LPA",
    logoLetter: "N",
    logoColor: "#0891B2",
    matchScore: 88,
    experienceYearsMin: 3,
    experienceYearsMax: 5,
    headlines:
      "Northwind Tech builds fintech tools for emerging markets. You'd join as a Product Designer focusing on growth funnels and activation.",
    whyFit:
      "Your experience with experimentation, A/B testing frameworks, and funnel optimization makes you a strong match for this growth-focused role.",
    watchOut:
      "The role requires comfort with high-velocity shipping cycles and frequent context switching across squads.",
    jobDescription:
      "We're looking for a Product Designer to own our growth surfaces — from onboarding to activation to referral loops. You'll work closely with data science and marketing to design experiments, interpret results, and iterate quickly. The ideal candidate thrives in ambiguity, loves working with data, and can ship polished work under tight timelines.",
  },
  {
    id: "3",
    title: "Senior Product Designer · AI",
    company: "Signalpath",
    postedAgo: "1w ago",
    location: "Mumbai",
    locationType: "Onsite",
    salary: "est. 24 LPA – 32 LPA",
    logoLetter: "S",
    logoColor: "#DC2626",
    matchScore: 90,
    experienceYearsMin: 5,
    experienceYearsMax: 8,
    headlines:
      "Signalpath builds decision-support tools for enterprise teams. You'd design calm, assistive AI workflows for complex data environments.",
    whyFit:
      "Your background in information architecture and complex systems design aligns well with designing AI-assisted enterprise workflows.",
    watchOut:
      "The onsite requirement in Mumbai and a fast-scaling team may mean evolving responsibilities and less process stability initially.",
    jobDescription:
      "As a Senior Product Designer focused on AI, you'll shape how enterprise users interact with machine learning models, automated workflows, and predictive insights. You'll partner closely with researchers, PMs, and engineers to translate complex data into clear, actionable interfaces. We value strong writing, systems thinking, and a deep respect for the user's cognitive load.",
    externalUrl: "https://example.com/jobs/signalpath/senior-product-designer-ai",
  },
  {
    id: "4",
    title: "Design Lead · Platform",
    company: "Canopy",
    postedAgo: "3d ago",
    location: "Hyderabad",
    locationType: "Hybrid",
    salary: "est. 28 LPA – 38 LPA",
    logoLetter: "C",
    logoColor: "#059669",
    matchScore: 85,
    experienceYearsMin: 8,
    experienceYearsMax: 12,
    headlines:
      "Canopy powers internal tools for fast-growing teams. You'd lead platform design and mentor a small, senior design team.",
    whyFit:
      "Your design systems experience and leadership background make you a natural fit for scaling Canopy's internal tooling design practice.",
    watchOut:
      "As a platform role, direct user contact may be limited — most stakeholders are internal engineering teams.",
    jobDescription:
      "We're hiring a Design Lead to build and scale our design system, establish standards across 30+ internal tools, and mentor a team of 3 senior designers. You'll work at the intersection of design and engineering, ensuring consistency, quality, and speed across the entire product surface.",
  },
  {
    id: "5",
    title: "UX Researcher · Enterprise",
    company: "Tessera",
    postedAgo: "1d ago",
    location: "Remote",
    locationType: "India",
    salary: "est. 16 LPA – 22 LPA",
    logoLetter: "T",
    logoColor: "#D97706",
    matchScore: 82,
    experienceYearsMin: 3,
    experienceYearsMax: 6,
    headlines:
      "Tessera builds workflow automation for mid-market B2B teams. You'd drive mixed-methods research across their core product.",
    whyFit:
      "Your quant and qual research skills combined with B2B experience align well with Tessera's need for actionable, cross-functional insights.",
    watchOut:
      "The research function is still maturing — you'd need to build processes and evangelise research within the org.",
    jobDescription:
      "We're looking for a UX Researcher to drive discovery and evaluative research across our B2B product suite. You'll design studies, conduct interviews, run usability tests, and translate findings into actionable recommendations. You'll work embedded within cross-functional squads and help build a culture of evidence-based design decisions.",
  },
  {
    id: "6",
    title: "Staff Product Designer",
    company: "Meridian",
    postedAgo: "4d ago",
    location: "Chennai",
    locationType: "Hybrid",
    salary: "est. 32 LPA – 42 LPA",
    logoLetter: "M",
    logoColor: "#6366F1",
    matchScore: 87,
    experienceYearsMin: 10,
    experienceYearsMax: 14,
    headlines:
      "Meridian is redefining enterprise collaboration. You'd be a Staff Designer owning the core workspace experience.",
    whyFit:
      "Your depth in complex product design and systems thinking aligns with Meridian's need for a staff-level design owner.",
    watchOut:
      "The role is hybrid in Chennai with occasional travel to US and EU offices.",
    jobDescription:
      "We're hiring a Staff Product Designer to own the core workspace and collaboration experience. You'll set design direction, partner with research and product, and raise the bar for quality across the org. We value clarity, craft, and the ability to drive alignment across many stakeholders.",
    externalUrl: "https://example.com/jobs/meridian/staff-product-designer",
  },
  {
    id: "7",
    title: "Product Designer · Mobile",
    company: "Lumina",
    postedAgo: "6d ago",
    location: "Remote",
    locationType: "India",
    salary: "est. 18 LPA – 24 LPA",
    logoLetter: "L",
    logoColor: "#0EA5E9",
    matchScore: 84,
    experienceYearsMin: 2,
    experienceYearsMax: 4,
    headlines:
      "Lumina builds consumer-facing mobile apps for health and wellness. You'd own end-to-end mobile UX and visual design.",
    whyFit:
      "Your mobile-first portfolio and experience with iOS/Android patterns make you a strong fit for this role.",
    watchOut:
      "The team is small; you'd wear multiple hats including some visual and motion design.",
    jobDescription:
      "We're looking for a Product Designer to own mobile UX for our flagship app. You'll design flows, components, and interactions that feel native and delightful. Experience with Figma, prototyping, and working closely with mobile engineers is essential.",
  },
  {
    id: "8",
    title: "Senior UX Designer · Commerce",
    company: "Bazaar",
    postedAgo: "1w ago",
    location: "Bangalore",
    locationType: "Onsite",
    salary: "est. 22 LPA – 30 LPA",
    logoLetter: "B",
    logoColor: "#E11D48",
    matchScore: 89,
    experienceYearsMin: 5,
    experienceYearsMax: 8,
    headlines:
      "Bazaar powers checkout and payments for D2C brands. You'd design flows that convert and scale across regions.",
    whyFit:
      "Your e‑commerce or payments experience and focus on conversion align well with Bazaar's mission.",
    watchOut:
      "Fast-paced; you'll need to balance speed with quality and work across multiple product squads.",
    jobDescription:
      "As a Senior UX Designer you'll own checkout, cart, and payment experiences. You'll run experiments, iterate on flows, and work with data and product to improve conversion. We value a bias for action and a strong grasp of e‑commerce UX patterns.",
    externalUrl: "https://example.com/jobs/bazaar/senior-ux-designer-commerce",
  },
  {
    id: "9",
    title: "Design Systems Lead",
    company: "Atlas",
    postedAgo: "2d ago",
    location: "Remote",
    locationType: "India",
    salary: "est. 26 LPA – 34 LPA",
    logoLetter: "A",
    logoColor: "#10B981",
    matchScore: 86,
    experienceYearsMin: 6,
    experienceYearsMax: 10,
    headlines:
      "Atlas provides a design system used by 50+ product teams. You'd lead the system roadmap and component library.",
    whyFit:
      "Your design systems and component architecture experience make you a natural fit to lead Atlas's system.",
    watchOut:
      "Heavy collaboration with engineers and consuming teams; less direct user-facing feature work.",
    jobDescription:
      "We're hiring a Design Systems Lead to own our component library, documentation, and adoption. You'll define patterns, work with React and Figma, and help product teams ship consistent, accessible UIs. Strong communication and documentation skills are key.",
  },
  {
    id: "10",
    title: "UX Designer · Developer Experience",
    company: "DevFlow",
    postedAgo: "3d ago",
    location: "Pune",
    locationType: "Hybrid",
    salary: "est. 20 LPA – 28 LPA",
    logoLetter: "D",
    logoColor: "#8B5CF6",
    matchScore: 83,
    experienceYearsMin: 2,
    experienceYearsMax: 5,
    headlines:
      "DevFlow builds tools for developers. You'd design dashboards, CLIs, and docs that developers love.",
    whyFit:
      "Your interest in developer tools and technical empathy align well with designing for a technical audience.",
    watchOut:
      "You'll need to learn technical concepts and work closely with engineers; less focus on broad consumer UX.",
    jobDescription:
      "We're looking for a UX Designer to own the developer experience of our platform. You'll design dashboards, onboarding flows, and documentation experiences. Familiarity with developer workflows and willingness to learn technical concepts is important.",
  },
  {
    id: "11",
    title: "Senior Product Designer · Trust & Safety",
    company: "Guardian",
    postedAgo: "5d ago",
    location: "Remote",
    locationType: "India",
    salary: "est. 24 LPA – 32 LPA",
    logoLetter: "G",
    logoColor: "#F59E0B",
    matchScore: 85,
    experienceYearsMin: 5,
    experienceYearsMax: 9,
    headlines:
      "Guardian helps platforms manage trust and safety. You'd design moderation tools and policy surfaces.",
    whyFit:
      "Your experience with complex, sensitive workflows and edge cases aligns with trust and safety design challenges.",
    watchOut:
      "The domain can be intense; you'll work with sensitive content and policy constraints.",
    jobDescription:
      "As a Senior Product Designer you'll own moderation tools, reporting flows, and policy configuration. You'll work with operations, policy, and product to design experiences that scale and protect users. We value systems thinking and comfort with ambiguity.",
  },
  {
    id: "12",
    title: "Product Designer · Onboarding",
    company: "Launchpad",
    postedAgo: "1d ago",
    location: "Gurgaon",
    locationType: "Hybrid",
    salary: "est. 18 LPA – 25 LPA",
    logoLetter: "L",
    logoColor: "#EC4899",
    matchScore: 81,
    experienceYearsMin: 2,
    experienceYearsMax: 4,
    headlines:
      "Launchpad helps SaaS products activate users faster. You'd own onboarding and activation experiences.",
    whyFit:
      "Your focus on activation, onboarding, and experimentation fits Launchpad's product-led growth focus.",
    watchOut:
      "Early-stage team; you'd help define processes and design culture.",
    jobDescription:
      "We're looking for a Product Designer to own onboarding and activation. You'll design first-run experiences, empty states, and in-app guidance. You'll work with growth and product to improve activation and retention. Experience with product-led growth is a plus.",
  },
  {
    id: "13",
    title: "Senior UX Designer · Data Viz",
    company: "Chartwise",
    postedAgo: "4d ago",
    location: "Remote",
    locationType: "India",
    salary: "est. 22 LPA – 30 LPA",
    logoLetter: "C",
    logoColor: "#14B8A6",
    matchScore: 88,
    experienceYearsMin: 5,
    experienceYearsMax: 8,
    headlines:
      "Chartwise builds analytics and reporting for enterprises. You'd design data-heavy dashboards and visualizations.",
    whyFit:
      "Your experience with data viz, dashboards, and complex information display aligns well with this role.",
    watchOut:
      "You'll need to balance clarity with flexibility for power users and many data types.",
    jobDescription:
      "As a Senior UX Designer you'll own dashboards, charts, and reporting experiences. You'll work with data and engineering to make complex data understandable and actionable. Strong information design and familiarity with analytics tools are important.",
  },
  {
    id: "14",
    title: "Product Designer · Marketplace",
    company: "Bazaar",
    postedAgo: "1w ago",
    location: "Mumbai",
    locationType: "Onsite",
    salary: "est. 20 LPA – 28 LPA",
    logoLetter: "B",
    logoColor: "#EA580C",
    matchScore: 82,
    experienceYearsMin: 3,
    experienceYearsMax: 5,
    headlines:
      "Bazaar's marketplace connects buyers and sellers. You'd design discovery, search, and transaction flows.",
    whyFit:
      "Your marketplace or two-sided platform experience fits our focus on discovery and transactions.",
    watchOut:
      "You'll work across buyer and seller experiences; context switching between user types is common.",
    jobDescription:
      "We're looking for a Product Designer to own marketplace discovery, search, and listing experiences. You'll design for both buyers and sellers and work with recommendation and search teams. Experience with marketplaces or two-sided platforms is a plus.",
    externalUrl: "https://example.com/jobs/bazaar/product-designer-marketplace",
  },
  {
    id: "15",
    title: "Lead Designer · Brand & Product",
    company: "Narrative",
    postedAgo: "2d ago",
    location: "Remote",
    locationType: "India",
    salary: "est. 30 LPA – 40 LPA",
    logoLetter: "N",
    logoColor: "#64748B",
    matchScore: 84,
    experienceYearsMin: 8,
    experienceYearsMax: 12,
    headlines:
      "Narrative is a content platform for teams. You'd lead design across brand, marketing, and product.",
    whyFit:
      "Your combination of brand and product design and leadership experience fits this cross-functional lead role.",
    watchOut:
      "Scope is broad; you'll need to prioritise and delegate as the team grows.",
    jobDescription:
      "We're hiring a Lead Designer to own brand, marketing site, and core product experience. You'll set direction, work with leadership, and grow the design function. We value strong craft, storytelling, and the ability to work across brand and product.",
  },
];

const REQUIRED_SKILLS_BY_JOB: Record<string, string[]> = {
  "1": ["Figma", "Design Systems", "B2B SaaS UX", "Stakeholder Management", "Interaction Design", "Accessibility"],
  "2": ["Experimentation", "A/B Testing", "Funnel Analysis", "Growth UX", "Product Analytics"],
  "3": ["AI UX", "Information Architecture", "Enterprise Workflows", "Prototyping", "Data-heavy UI"],
  "4": ["Design Leadership", "Design Systems", "Cross-team Collaboration", "Mentoring", "Platform UX"],
  "5": ["User Interviews", "Usability Testing", "Survey Design", "Research Synthesis", "Insight Communication"],
  "6": ["Systems Thinking", "Product Strategy", "Design Critique", "Stakeholder Alignment", "Design Quality"],
  "7": ["Mobile UX", "iOS/Android Patterns", "Interaction Design", "Visual Design", "Prototyping"],
  "8": ["Checkout UX", "Conversion Optimization", "Payments UX", "Experiment Design", "Data-informed Design"],
  "9": ["Component Architecture", "Token Systems", "Documentation", "Accessibility", "Design-Engineering Collaboration"],
  "10": ["Developer Tools UX", "Information Design", "Technical Communication", "Dashboard UX", "Docs UX"],
  "11": ["Complex Workflow UX", "Policy-aware Design", "Systems Design", "Risk Thinking", "Edge-case Handling"],
  "12": ["Onboarding UX", "Activation Design", "Journey Mapping", "Experimentation", "Funnel UX"],
};

type SearchJob = {
  id: string;
  title: string;
  company: string;
  logoLetter: string;
  logoColor: string;
  location: string;
  locationType: string;
  salary: string;
  postedAgo: string;
  source: "zappyfind" | "external";
  sourceName?: string;
  matchScore?: number;
  summary: string;
  tags: string[];
  externalUrl?: string;
};

const SEARCH_JOBS: SearchJob[] = [
  {
    id: "s1",
    title: "Product Designer",
    company: "ZappyCart",
    logoLetter: "F",
    logoColor: "#2874F0",
    location: "Bangalore",
    locationType: "Hybrid",
    salary: "₹22L – ₹30L",
    postedAgo: "3d ago",
    source: "zappyfind",
    matchScore: 78,
    summary: "Design checkout and payment flows for India's largest e-commerce platform. Work on high-impact surfaces across mobile and web.",
    tags: ["E-commerce", "Mobile", "Payments"],
  },
  {
    id: "s2",
    title: "Senior UX Designer",
    company: "ZappyDocs",
    logoLetter: "N",
    logoColor: "#000000",
    location: "Remote",
    locationType: "Global",
    salary: "$140K – $180K",
    postedAgo: "1w ago",
    source: "external",
    sourceName: "careers.zappydocs.dev",
    summary: "Shape the future of collaborative workspaces. Work across desktop, mobile, and API surfaces for millions of users.",
    tags: ["Productivity", "SaaS", "Remote"],
    externalUrl: "https://careers.zappydocs.dev",
  },
  {
    id: "s3",
    title: "Design Lead · AI Products",
    company: "ZappyMind Labs",
    logoLetter: "G",
    logoColor: "#4285F4",
    location: "Bangalore",
    locationType: "Hybrid",
    salary: "₹45L – ₹65L",
    postedAgo: "5d ago",
    source: "external",
    sourceName: "careers.zappymind.dev",
    summary: "Lead design for AI-powered products that reach billions. Partner with researchers and engineers to translate complex ML into clear interfaces.",
    tags: ["AI", "Leadership", "Enterprise"],
    externalUrl: "https://careers.zappymind.dev",
  },
  {
    id: "s4",
    title: "UX Researcher",
    company: "Zappyhire",
    logoLetter: "R",
    logoColor: "#2D6AFF",
    location: "Bangalore",
    locationType: "Remote",
    salary: "₹18L – ₹26L",
    postedAgo: "2d ago",
    source: "zappyfind",
    matchScore: 72,
    summary: "Drive mixed-methods research for India's leading fintech platform. Shape payments, lending, and banking experiences.",
    tags: ["Fintech", "Research", "Remote"],
  },
  {
    id: "s5",
    title: "Staff Product Designer",
    company: "ZappyStudio",
    logoLetter: "F",
    logoColor: "#A259FF",
    location: "Remote",
    locationType: "US/India",
    salary: "$180K – $240K",
    postedAgo: "4d ago",
    source: "external",
    sourceName: "careers.zappystudio.dev",
    summary: "Own core editor and collaboration experiences used by millions of designers worldwide. Define design direction for the platform.",
    tags: ["Design Tools", "SaaS", "Remote"],
    externalUrl: "https://careers.zappystudio.dev",
  },
  {
    id: "s6",
    title: "Product Designer · Growth",
    company: "ZappyTrade",
    logoLetter: "Z",
    logoColor: "#387ED1",
    location: "Bangalore",
    locationType: "Onsite",
    salary: "₹20L – ₹28L",
    postedAgo: "1d ago",
    source: "zappyfind",
    matchScore: 81,
    summary: "Design activation, onboarding, and retention flows for India's largest stock broker. Data-driven, high-velocity work.",
    tags: ["Fintech", "Growth", "Mobile"],
  },
  {
    id: "s7",
    title: "Senior Designer · Design Systems",
    company: "ZappyAtlas",
    logoLetter: "A",
    logoColor: "#0052CC",
    location: "Remote",
    locationType: "India",
    salary: "₹35L – ₹48L",
    postedAgo: "6d ago",
    source: "external",
    sourceName: "careers.zappyatlas.dev",
    summary: "Scale and evolve the design system used across Jira, Confluence, and 10+ products. Define patterns, tokens, and accessibility standards.",
    tags: ["Design Systems", "Accessibility", "Remote"],
    externalUrl: "https://careers.zappyatlas.dev",
  },
  {
    id: "s8",
    title: "Product Designer · AI Assistant",
    company: "ZappyDesk",
    logoLetter: "F",
    logoColor: "#FF5722",
    location: "Chennai",
    locationType: "Hybrid",
    salary: "₹20L – ₹30L",
    postedAgo: "3d ago",
    source: "zappyfind",
    matchScore: 75,
    summary: "Design conversational AI experiences for customer support. Work on assistant experiences across the full ZappyDesk product suite.",
    tags: ["AI", "Conversational", "SaaS"],
  },
  {
    id: "s9",
    title: "UX Designer · Developer Experience",
    company: "ZappyDeploy",
    logoLetter: "V",
    logoColor: "#000000",
    location: "Remote",
    locationType: "Global",
    salary: "$130K – $170K",
    postedAgo: "2w ago",
    source: "external",
    sourceName: "careers.zappydeploy.dev",
    summary: "Design developer-facing tools, dashboards, and documentation for the platform behind Next.js.",
    tags: ["DevTools", "Remote", "Startup"],
    externalUrl: "https://careers.zappydeploy.dev",
  },
  {
    id: "s10",
    title: "Product Designer · Marketplace",
    company: "ZappyMart",
    logoLetter: "M",
    logoColor: "#E4197C",
    location: "Bangalore",
    locationType: "Hybrid",
    salary: "₹18L – ₹25L",
    postedAgo: "1w ago",
    source: "zappyfind",
    matchScore: 70,
    summary: "Design discovery, search, and transaction experiences for India's largest social commerce platform.",
    tags: ["E-commerce", "Mobile", "Consumer"],
  },
  {
    id: "s11",
    title: "Lead Designer · Brand & Product",
    company: "ZappyOrbit",
    logoLetter: "C",
    logoColor: "#1A1A1A",
    location: "Bangalore",
    locationType: "Onsite",
    salary: "₹40L – ₹55L",
    postedAgo: "4d ago",
    source: "external",
    sourceName: "careers.zappyorbit.dev",
    summary: "Own brand expression and product craft for one of India's most design-forward fintech companies.",
    tags: ["Fintech", "Brand", "Leadership"],
    externalUrl: "https://careers.zappyorbit.dev",
  },
  {
    id: "s12",
    title: "Product Designer · Payments",
    company: "ZappyPay",
    logoLetter: "P",
    logoColor: "#5F259F",
    location: "Bangalore",
    locationType: "Hybrid",
    salary: "₹24L – ₹32L",
    postedAgo: "2d ago",
    source: "zappyfind",
    matchScore: 83,
    summary: "Design payment flows, merchant experiences, and financial products used by 500M+ Indians.",
    tags: ["Fintech", "Payments", "Mobile"],
  },
];

const SEARCH_SUGGESTIONS = [
  "Product Designer",
  "UX Researcher",
  "Design Lead",
  "Remote",
  "AI Design",
  "Startup",
  "Fintech",
  "Design Systems",
];

const STACK_VISIBLE = 3;
const SWIPE_THRESHOLD = 100;
const CARD_OFFSET_Y = 7;
const CARD_SCALE_STEP = 0.06;

type ApplicationStatus =
  | "submitted"
  | "viewed"
  | "shortlisted"
  | "interview"
  | "offer"
  | "rejected";

type AppliedMeta = {
  appliedAtISO: string;
  status: ApplicationStatus;
  via: "Zappy Apply";
  resume: "Zappy profile";
  followUpInDays: number;
  notes?: string;
};

const SKIP_REASON_OPTIONS = [
  "Salary doesn't match my expectations",
  "Location doesn't work for me",
  "Not the right seniority level",
  "Wrong industry or domain",
  "Not the type of role I'm looking for",
  "Not interested in this company",
  "Already applied or interviewing here",
] as const;

interface JobReviewScreenProps {
  firstName: string;
  initialTab?: "new" | "saved";
  onNavigateHome: () => void;
  onNavigateJobs: () => void;
  onNavigateProfile: () => void;
}

export function JobReviewScreen({
  firstName,
  initialTab = "new",
  onNavigateHome,
  onNavigateJobs,
  onNavigateProfile,
}: JobReviewScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [appliedIds, setAppliedIds] = useState<Set<string>>(() => new Set());
  const [appliedMetaById, setAppliedMetaById] = useState<Record<string, AppliedMeta>>({});
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const [activeTab, setActiveTab] = useState<"new" | "saved" | "applied">(initialTab);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSavedIds, setSearchSavedIds] = useState<Set<string>>(new Set());
  const [sortMode, setSortMode] = useState<"most_recent" | "highest_score">("most_recent");
  const [quickApplyToast, setQuickApplyToast] = useState<{ id: string; title: string } | null>(null);
  const [appliedSheetJob, setAppliedSheetJob] = useState<Job | null>(null);
  const [skipSheetOpen, setSkipSheetOpen] = useState(false);
  const [selectedSkipReasons, setSelectedSkipReasons] = useState<Set<string>>(new Set());
  const [skipNotes, setSkipNotes] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isAnimating = useRef(false);
  const switcherRef = useRef<HTMLDivElement | null>(null);

  const sortedJobs = useMemo(() => {
    const rankByRecency = (postedAgo: string) => {
      const raw = postedAgo.trim().toLowerCase();
      const m = raw.match(/^(\d+)\s*([dw])\s*ago$/);
      if (!m) return Number.MAX_SAFE_INTEGER;
      const value = Number(m[1]);
      const unit = m[2];
      return unit === "w" ? value * 7 : value;
    };

    return [...JOBS].sort((a, b) => {
      if (sortMode === "highest_score") {
        return (b.matchScore ?? 0) - (a.matchScore ?? 0);
      }
      return rankByRecency(a.postedAgo) - rankByRecency(b.postedAgo);
    });
  }, [sortMode]);

  const remaining = sortedJobs.length - currentIndex;
  const visibleJobs = useMemo(
    () => sortedJobs.slice(currentIndex, currentIndex + STACK_VISIBLE),
    [currentIndex, sortedJobs],
  );
  const savedCount = savedIds.size;
  const appliedCount = appliedIds.size;

  const appliedJobs = useMemo(
    () => sortedJobs.filter((job) => appliedIds.has(job.id)),
    [appliedIds, sortedJobs],
  );

  const filteredSearchJobs = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return SEARCH_JOBS.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.tags.some((t) => t.toLowerCase().includes(q)) ||
        job.location.toLowerCase().includes(q) ||
        job.locationType.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggleSearchSave = useCallback((id: string) => {
    setSearchSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSkipReason = useCallback((reason: string) => {
    setSelectedSkipReasons((prev) => {
      const next = new Set(prev);
      if (next.has(reason)) next.delete(reason);
      else next.add(reason);
      return next;
    });
  }, []);

  const closeSkipSheet = useCallback(() => {
    setSkipSheetOpen(false);
    setSelectedSkipReasons(new Set());
    setSkipNotes("");
  }, []);

  const exitSearch = useCallback(() => {
    setSearchMode(false);
    setSearchQuery("");
  }, []);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const saveHintOpacity = useTransform(x, [0, 100], [0, 1]);
  const ignoreHintOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleAdvance = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const job = sortedJobs[currentIndex];
      if (job && direction === "right") {
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.add(job.id);
          return next;
        });
        setAppliedIds((prev) => {
          const next = new Set(prev);
          next.add(job.id);
          return next;
        });
        setAppliedMetaById((prev) => {
          if (prev[job.id]) return prev;
          return {
            ...prev,
            [job.id]: {
              appliedAtISO: new Date().toISOString(),
              status: "submitted",
              via: "Zappy Apply",
              resume: "Zappy profile",
              followUpInDays: 3,
            },
          };
        });
      }

      setExitDirection(direction);

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setExitDirection(null);
        x.set(0);
        isAnimating.current = false;
      }, 300);
    },
    [currentIndex, x, sortedJobs],
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
      if (Math.abs(info.offset.x) > SWIPE_THRESHOLD || Math.abs(info.velocity.x) > 600) {
        handleAdvance(info.offset.x > 0 ? "right" : "left");
      }
    },
    [handleAdvance],
  );

  const hasMoreJobs = currentIndex < sortedJobs.length;

  const PENDING_DOTS_COUNT = 5;
  const currentJob = sortedJobs[currentIndex];
  const isCurrentExternal = Boolean(currentJob?.externalUrl);

  const submitSkip = useCallback(() => {
    // Reason capture is optional today; keep this for analytics wiring later.
    closeSkipSheet();
    handleAdvance("left");
  }, [closeSkipSheet, handleAdvance]);

  useEffect(() => {
    if (!switcherOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!switcherRef.current) return;
      if (!switcherRef.current.contains(event.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [switcherOpen]);

  useEffect(() => {
    if (!quickApplyToast) return;
    const t = window.setTimeout(() => setQuickApplyToast(null), 1200);
    return () => window.clearTimeout(t);
  }, [quickApplyToast]);

  useEffect(() => {
    if (!appliedSheetJob) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAppliedSheetJob(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [appliedSheetJob]);

  useEffect(() => {
    if (!skipSheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSkipSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skipSheetOpen, closeSkipSheet]);

  useEffect(() => {
    if (!appliedSheetJob) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [appliedSheetJob]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#FAFAF9",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          height: 56,
          background: "rgba(250,250,249,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div ref={switcherRef} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setSwitcherOpen((v) => !v)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 22,
                fontWeight: 400,
                color: "#1A1613",
                letterSpacing: "-0.02em",
              }}
            >
              Jobs
              <ChevronDown
                size={18}
                color="rgba(107,101,96,1)"
                strokeWidth={2}
                style={{
                  transform: switcherOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.18s ease",
                }}
              />
            </button>

            {switcherOpen && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  top: 40,
                  left: 0,
                  minWidth: 180,
                  borderRadius: 14,
                  padding: 6,
                  background: "#FFFFFF",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(28,25,23,0.08)",
                  boxShadow:
                    "0 10px 30px rgba(28,25,23,0.10), 0 2px 6px rgba(28,25,23,0.06)",
                }}
              >
                {[
                  {
                    key: "home",
                    text: "Home",
                    onClick: onNavigateHome,
                  },
                  {
                    key: "jobs",
                    text: "Jobs",
                    onClick: onNavigateJobs,
                  },
                  {
                    key: "profile",
                    text: "Profile",
                    onClick: onNavigateProfile,
                  },
                ].map((item) => {
                  const active = item.key === "jobs";
                  return (
                    <button
                      key={item.key}
                      type="button"
                      role="menuitem"
                      disabled={active}
                      onClick={() => {
                        setSwitcherOpen(false);
                        item.onClick();
                      }}
                      style={{
                        width: "100%",
                        border: "none",
                        background: active ? "rgba(28,25,23,0.04)" : "transparent",
                        cursor: active ? "default" : "pointer",
                        padding: "10px 10px",
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: active ? "#1A1613" : "rgba(107,101,96,1)",
                        letterSpacing: "-0.01em",
                        opacity: active ? 1 : 0.95,
                      }}
                    >
                      <span>{item.text}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            style={{
              position: "relative",
              width: 34,
              height: 34,
              borderRadius: 999,
              background: "rgba(28,25,23,0.04)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Bell size={16} color="rgba(107,101,96,1)" strokeWidth={1.8} />
            <span
              style={{
                position: "absolute",
                top: 7,
                right: 8,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#EA580C",
                border: "2px solid #FAFAF9",
              }}
            />
          </button>

          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              background:
                "linear-gradient(135deg, rgba(255,140,90,0.15) 0%, rgba(255,106,43,0.28) 100%)",
              border: "1.5px solid rgba(234,88,12,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              color: "#EA580C",
              letterSpacing: "-0.02em",
            }}
          >
            {(firstName || "A").charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {quickApplyToast && (
          <motion.div
            initial={{ y: -42, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -28, opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: "calc(62px + env(safe-area-inset-top))",
              left: 0,
              right: 0,
              marginInline: "auto",
              width: "min(92vw, 360px)",
              zIndex: 80,
              pointerEvents: "none",
              borderRadius: 14,
              border: "1px solid rgba(4,120,87,0.55)",
              background: "linear-gradient(135deg, #16A34A 0%, #059669 55%, #047857 100%)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "0 16px 36px rgba(5,150,105,0.34), 0 4px 12px rgba(0,0,0,0.16)",
              padding: "11px 13px",
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}
          >
            <div
              style={{
                width: 19,
                height: 19,
                borderRadius: 999,
                background: "rgba(255,255,255,0.22)",
                color: "#FFFFFF",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Check size={12} strokeWidth={3} />
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 12.5,
                fontWeight: 600,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
                lineHeight: 1.35,
              }}
            >
              Quick Applied to <span style={{ color: "rgba(255,255,255,0.96)", fontWeight: 700 }}>{quickApplyToast.title}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + sort */}
      <div style={{ padding: "10px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            onClick={() => {
              if (!searchMode) {
                setSearchMode(true);
                setTimeout(() => searchInputRef.current?.focus(), 50);
              }
            }}
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 14,
              background: searchMode ? "#FFFFFF" : "rgba(0,0,0,0.03)",
              border: searchMode
                ? "1.5px solid rgba(234,88,12,0.22)"
                : "1.5px solid transparent",
              boxShadow: searchMode
                ? "0 2px 12px rgba(234,88,12,0.06)"
                : "none",
              transition: "all 0.2s ease",
              cursor: searchMode ? "default" : "pointer",
            }}
          >
            <Search
              size={16}
              color="#9CA3AF"
              strokeWidth={2}
              style={{ flexShrink: 0 }}
            />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchMode(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") exitSearch();
              }}
              placeholder="Search roles, companies, skills…"
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 14,
                color: "#111827",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  padding: 0,
                  border: "none",
                  background: "rgba(0,0,0,0.06)",
                  borderRadius: 999,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <X size={11} color="#6B7280" strokeWidth={3} />
              </button>
            )}
            {searchMode && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  exitSearch();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  padding: 0,
                  border: "none",
                  background: "rgba(0,0,0,0.05)",
                  borderRadius: 8,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <X size={13} color="#6B7280" strokeWidth={2.5} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() =>
              setSortMode((prev) =>
                prev === "most_recent" ? "highest_score" : "most_recent"
              )
            }
            style={{
              flexShrink: 0,
              height: 42,
              padding: "0 10px",
              borderRadius: 14,
              border:
                sortMode === "highest_score"
                  ? "1.5px solid rgba(234,88,12,0.22)"
                  : "1.5px solid transparent",
              background:
                sortMode === "highest_score"
                  ? "#FFFFFF"
                  : "rgba(0,0,0,0.03)",
              color: sortMode === "highest_score" ? "#111827" : "#6B7280",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow:
                sortMode === "highest_score"
                  ? "0 2px 12px rgba(234,88,12,0.06)"
                  : "none",
              transition: "all 0.2s ease",
            }}
            title={`Sort: ${
              sortMode === "most_recent" ? "Most recent" : "Highest score"
            }`}
          >
            <ArrowUpDown size={13} strokeWidth={2.1} />
            {sortMode === "most_recent" ? "Most recent" : "Top score"}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      {!searchMode && (
        <div
          style={{
            padding: "12px 16px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <TabPill
            icon={<Briefcase size={14} strokeWidth={2} />}
            label="Recommended"
            count={remaining}
            flexWeight={1.25}
            active={activeTab === "new"}
            onClick={() => setActiveTab("new")}
          />
          <TabPill
            icon={<Eye size={14} strokeWidth={2} />}
            label="Saved"
            count={savedCount}
            flexWeight={0.9}
            active={activeTab === "saved"}
            onClick={() => setActiveTab("saved")}
          />
          <TabPill
            icon={<Check size={14} strokeWidth={2} />}
            label="Applied"
            count={appliedCount}
            flexWeight={0.9}
            active={activeTab === "applied"}
            onClick={() => setActiveTab("applied")}
          />
        </div>
      )}

      {/* Main content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "4px 12px 16px",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {searchMode ? (
          <SearchContent
            query={searchQuery}
            results={filteredSearchJobs}
            savedIds={searchSavedIds}
            onToggleSave={toggleSearchSave}
            onSelectSuggestion={setSearchQuery}
          />
        ) : (
        <>
        {activeTab === "applied" ? (
          <div
            style={{
              width: "100%",
              maxWidth: 380,
              flex: 1,
              minHeight: 620,
              paddingTop: 4,
            }}
          >
            {appliedCount === 0 ? (
              <div
                style={{
                  width: "100%",
                  borderRadius: 20,
                  padding: 24,
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: 6,
                  }}
                >
                  No applied jobs yet
                </div>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: "20px",
                    color: "#6B7280",
                    margin: 0,
                  }}
                >
                  Use Quick Apply (or Open & Apply) on any role in the New tab to see it here.
                </p>
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 11,
                }}
              >
                {appliedJobs.map((job) => (
                  <AppliedJobCard
                    key={job.id}
                    job={job}
                    meta={appliedMetaById[job.id]}
                    onViewDetails={() => setAppliedSheetJob(job)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Card stack area – all cards absolute so stack is visible on first load */
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 380,
              flex: 1,
              minHeight: 620,
              paddingTop: 4,
            }}
          >
            <AnimatePresence initial={false}>
              {hasMoreJobs &&
                visibleJobs
                  .map((job, stackIndex) => {
                    const isTop = stackIndex === 0;
                    const offsetY = stackIndex * CARD_OFFSET_Y;
                    const scale = 1 - stackIndex * CARD_SCALE_STEP;

                    return (
                      <motion.div
                        key={job.id}
                        layout
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          zIndex: STACK_VISIBLE - stackIndex,
                          ...(isTop ? { x, rotate } : {}),
                          touchAction: "pan-y",
                          cursor: isTop ? "grab" : "default",
                          pointerEvents: isTop ? "auto" : "none",
                          willChange: isTop ? "transform" : undefined,
                        }}
                        initial={{
                          y: offsetY,
                          scale,
                          opacity: 1,
                        }}
                        animate={{
                          y: offsetY,
                          scale,
                          opacity: 1,
                        }}
                        exit={{
                          x: exitDirection === "right" ? 420 : -420,
                          rotate: exitDirection === "right" ? 14 : -14,
                          opacity: 0,
                          transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 30,
                          mass: 0.8,
                        }}
                        {...(isTop
                          ? {
                              drag: "x" as const,
                              dragConstraints: { left: 0, right: 0 },
                              dragElastic: 0.14,
                              onDragEnd: handleDragEnd,
                            }
                          : {})}
                      >
                        {isTop && (
                          <>
                            <motion.div
                              style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: 20,
                                backgroundColor: "rgba(22,163,74,0.08)",
                                opacity: saveHintOpacity,
                                pointerEvents: "none",
                                zIndex: 2,
                              }}
                            />
                            <motion.div
                              style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: 20,
                                backgroundColor: "rgba(220,38,38,0.06)",
                                opacity: ignoreHintOpacity,
                                pointerEvents: "none",
                                zIndex: 2,
                              }}
                            />
                          </>
                        )}

                        <JobCard job={job} isTop={isTop} />
                      </motion.div>
                    );
                  })
                  .reverse()}
            </AnimatePresence>

            {!hasMoreJobs && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: "100%",
                  borderRadius: 20,
                  padding: 28,
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 999,
                    background: "linear-gradient(135deg, #ECFDF5 0%, #DCFCE7 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    fontSize: 22,
                  }}
                >
                  ✓
                </div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: "#111827",
                    letterSpacing: "-0.02em",
                    marginBottom: 6,
                  }}
                >
                  You're all caught up, {firstName}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: "20px",
                    color: "#6B7280",
                    margin: 0,
                  }}
                >
                  {savedCount > 0
                    ? `You saved ${savedCount} role${savedCount > 1 ? "s" : ""}. They'll appear in your Saved Jobs on the dashboard.`
                    : "No roles saved this time. New matches will appear as Zappy finds them."}
                </p>
                <button
                  type="button"
                  onClick={onNavigateHome}
                  style={{
                    marginTop: 20,
                    padding: "10px 20px",
                    borderRadius: 999,
                    border: "none",
                    background:
                      "linear-gradient(135deg, #EA580C 0%, #EA580C 45%, #EA580C 100%)",
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 10px 30px rgba(234,88,12,0.4)",
                  }}
                >
                  Back to dashboard
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Action buttons */}
        {hasMoreJobs && activeTab !== "applied" && (
          <div
            style={{
              position: "sticky",
              bottom: 0,
              zIndex: 12,
              paddingTop: 14,
              paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
              width: "100%",
              maxWidth: 380,
              display: "flex",
              alignItems: "center",
              gap: 10,
              background:
                "linear-gradient(to top, rgba(250,250,249,0.98) 62%, rgba(250,250,249,0.84) 84%, rgba(250,250,249,0))",
            }}
          >
            {/* Skip – icon-only tertiary */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              whileHover={{ backgroundColor: "#F3F4F6" }}
              onClick={() => setSkipSheetOpen(true)}
              style={{
                width: 50,
                height: 50,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.08)",
                backgroundColor: "#FFFFFF",
                color: "#9CA3AF",
                fontSize: 20,
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                padding: 0,
              }}
              title="Skip"
            >
              <ThumbsDown size={18} color="#374151" strokeWidth={2} />
            </motion.button>

            {activeTab === "new" && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -1, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}
                onClick={() => handleAdvance("right")}
                style={{
                  flex: 1,
                  height: 50,
                  borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.08)",
                  backgroundColor: "#FFFFFF",
                  color: "#374151",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: 0,
                }}
              >
                <Bookmark size={16} strokeWidth={2} /> Save Job
              </motion.button>
            )}

            {/* Apply Now – primary */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1, boxShadow: "0 14px 40px rgba(234,88,12,0.55)" }}
              onClick={() => {
                if (isCurrentExternal && currentJob?.externalUrl) {
                  try {
                    window.open(currentJob.externalUrl, "_blank", "noopener,noreferrer");
                  } catch {
                    // ignore
                  }
                } else if (currentJob) {
                  setQuickApplyToast({ id: currentJob.id, title: currentJob.title });
                }
                handleAdvance("right");
              }}
              style={{
                flex: activeTab === "saved" ? 1 : 1.3,
                height: 50,
                borderRadius: 16,
                border: "none",
                background:
                  "linear-gradient(135deg, #EA580C 0%, #EA580C 45%, #EA580C 100%)",
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                cursor: "pointer",
                boxShadow: "0 10px 32px rgba(234,88,12,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: 0,
              }}
            >
              {isCurrentExternal ? (
                <>
                  Open &amp; Apply <ExternalLink size={16} strokeWidth={2.2} />
                </>
              ) : (
                <>Quick Apply →</>
              )}
            </motion.button>
          </div>
        )}
        </>
        )}
      </main>

      <AnimatePresence>
        {appliedSheetJob ? (
          <AppliedJobDetailSheet
            key={appliedSheetJob.id}
            job={appliedSheetJob}
            meta={appliedMetaById[appliedSheetJob.id]}
            onClose={() => setAppliedSheetJob(null)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {skipSheetOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close skip reason sheet"
              onClick={closeSkipSheet}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 70,
                border: "none",
                background: "rgba(28,25,23,0.38)",
                padding: 0,
                margin: 0,
                cursor: "pointer",
              }}
            />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label="Skip job reasons"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                top: 8,
                bottom: 0,
                zIndex: 71,
                marginInline: "auto",
                width: "min(100%, 440px)",
                maxWidth: "100vw",
                background: "#FFFEFB",
                borderTopLeftRadius: 22,
                borderTopRightRadius: 22,
                border: "1px solid rgba(28,25,23,0.08)",
                borderBottom: "none",
                boxShadow: "0 -12px 36px rgba(28,25,23,0.16)",
                padding: "10px 16px calc(14px + env(safe-area-inset-bottom))",
                maxHeight: "calc(100dvh - 8px)",
                overflowY: "auto",
                overscrollBehaviorY: "contain",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 999,
                  background: "rgba(28,25,23,0.16)",
                  margin: "0 auto 12px",
                }}
              />

              <h3
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  color: "#1A1613",
                  lineHeight: 1.25,
                }}
              >
                Skipping this one?
              </h3>

              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: "#6B7280",
                  letterSpacing: "-0.01em",
                }}
              >
                No problem. It will be removed from your list. You can optionally tell us why to improve future recommendations.
              </p>

              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1613", letterSpacing: "-0.01em" }}>
                  Quick reasons <span style={{ color: "#A8A29E", fontWeight: 500 }}>(optional)</span>
                </div>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                  {SKIP_REASON_OPTIONS.map((reason) => {
                    const checked = selectedSkipReasons.has(reason);
                    return (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => toggleSkipReason(reason)}
                        style={{
                          width: "100%",
                          minHeight: 44,
                          textAlign: "left",
                          border: checked
                            ? "1px solid rgba(234,88,12,0.34)"
                            : "1px solid rgba(28,25,23,0.09)",
                          background: checked
                            ? "rgba(234,88,12,0.06)"
                            : "rgba(255,255,255,0.92)",
                          borderRadius: 12,
                          padding: "7px 10px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          touchAction: "manipulation",
                          WebkitTapHighlightColor: "transparent",
                        }}
                      >
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 5,
                            border: checked
                              ? "1px solid rgba(234,88,12,0.45)"
                              : "1px solid rgba(28,25,23,0.2)",
                            background: checked ? "rgba(234,88,12,0.14)" : "#FFFFFF",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#EA580C",
                            flexShrink: 0,
                          }}
                        >
                          {checked ? <Check size={11} strokeWidth={3} /> : null}
                        </span>
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 500,
                            color: "#1F2937",
                            letterSpacing: "-0.01em",
                            lineHeight: 1.35,
                          }}
                        >
                          {reason}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1A1613", letterSpacing: "-0.01em" }}>
                  Anything else? <span style={{ color: "#A8A29E", fontWeight: 500 }}>(optional)</span>
                </div>
                <textarea
                  value={skipNotes}
                  onChange={(e) => setSkipNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any extra context (optional)..."
                  style={{
                    marginTop: 8,
                    width: "100%",
                    resize: "none",
                    borderRadius: 12,
                    border: "1px solid rgba(28,25,23,0.11)",
                    background: "#FFFEFA",
                    padding: "10px 12px",
                    fontSize: 13,
                    lineHeight: 1.4,
                    color: "#374151",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "Inter, sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                />
              </div>

              <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={closeSkipSheet}
                  style={{
                    flex: 1,
                    height: 46,
                    borderRadius: 12,
                    border: "1px solid rgba(28,25,23,0.14)",
                    background: "#FFFFFF",
                    color: "#1F2937",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitSkip}
                  style={{
                    flex: 1,
                    height: 46,
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #FF8A56 0%, #EA580C 100%)",
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "-0.01em",
                    boxShadow: "0 8px 20px rgba(234,88,12,0.28)",
                  }}
                >
                  Skip this role
                </button>
              </div>
            </motion.section>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function formatAppliedDate(iso?: string): string {
  if (!iso) return "Recently";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Recently";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function statusBadge(status: ApplicationStatus): { label: string; bg: string; text: string } {
  switch (status) {
    case "submitted":
      return { label: "Applied", bg: "rgba(2,132,199,0.10)", text: "#0369A1" };
    case "viewed":
      return { label: "Viewed", bg: "rgba(5,150,105,0.12)", text: "#047857" };
    case "shortlisted":
      return { label: "Shortlisted", bg: "rgba(99,102,241,0.12)", text: "#4338CA" };
    case "interview":
      return { label: "Interview", bg: "rgba(217,119,6,0.12)", text: "#B45309" };
    case "offer":
      return { label: "Offer", bg: "rgba(16,185,129,0.14)", text: "#047857" };
    case "rejected":
      return { label: "Closed", bg: "rgba(220,38,38,0.10)", text: "#B91C1C" };
  }
}

function StatusBadgeIcon({ status, color }: { status: ApplicationStatus; color: string }) {
  const size = 12;
  const stroke = 2.25;
  switch (status) {
    case "submitted":
      return <Send size={size} color={color} strokeWidth={stroke} aria-hidden />;
    case "viewed":
      return <Eye size={size} color={color} strokeWidth={stroke} aria-hidden />;
    case "shortlisted":
      return <Sparkles size={size} color={color} strokeWidth={stroke} aria-hidden />;
    case "interview":
      return <Bell size={size} color={color} strokeWidth={stroke} aria-hidden />;
    case "offer":
      return <Check size={size} color={color} strokeWidth={stroke} aria-hidden />;
    case "rejected":
      return <X size={size} color={color} strokeWidth={stroke} aria-hidden />;
  }
}

function AppliedJobDetailSheet({
  job,
  meta,
  onClose,
}: {
  job: Job;
  meta?: AppliedMeta;
  onClose: () => void;
}) {
  const safeMeta: AppliedMeta = meta ?? {
    appliedAtISO: new Date().toISOString(),
    status: "submitted",
    via: "Zappy Apply",
    resume: "Zappy profile",
    followUpInDays: 3,
  };
  const badge = statusBadge(safeMeta.status);
  const appliedSheetHint =
    safeMeta.status === "submitted"
      ? "You'll be notified when the recruiter views your profile."
      : safeMeta.status === "viewed"
        ? "The hiring team has viewed your application."
        : "We'll notify you as this application moves forward.";

  const sheetOffsetY = useMotionValue(0);
  const backdropOpacity = useTransform(sheetOffsetY, [0, 280], [1, 0]);
  const dragRef = useRef<{ pointerId: number; startY: number; startOffset: number } | null>(null);

  const finishSheetDrag = useCallback(() => {
    const current = sheetOffsetY.get();
    const threshold = Math.min(160, window.innerHeight * 0.22);
    if (current > threshold) {
      void animate(sheetOffsetY, window.innerHeight, {
        duration: 0.26,
        ease: [0.32, 0, 0.67, 1],
      }).then(() => onClose());
    } else {
      void animate(sheetOffsetY, 0, { type: "spring", damping: 32, stiffness: 380 });
    }
  }, [onClose, sheetOffsetY]);

  const onHandlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startY: e.clientY,
      startOffset: sheetOffsetY.get(),
    };
  };

  const onHandlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragRef.current;
    if (!state || e.pointerId !== state.pointerId) return;
    const dy = e.clientY - state.startY;
    sheetOffsetY.set(Math.max(0, state.startOffset + dy));
  };

  const onHandlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragRef.current;
    if (!state || e.pointerId !== state.pointerId) return;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore if already released
    }
    dragRef.current = null;
    finishSheetDrag();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          y: sheetOffsetY,
        }}
      >
        <motion.div
          role="presentation"
          aria-hidden
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(15, 23, 42, 0.48)",
            opacity: backdropOpacity,
          }}
        />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Job details"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 380 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 420,
            maxHeight: "92dvh",
            background: "#FFFFFF",
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            boxShadow: "0 -20px 50px rgba(0,0,0,0.22)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
        <div
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={onHandlePointerEnd}
          onPointerCancel={onHandlePointerEnd}
          style={{
            flexShrink: 0,
            height: 36,
            padding: "12px 20px 8px",
            background: "#FFFFFF",
            touchAction: "none",
            cursor: "grab",
          }}
        >
          <div
            style={{
              width: 40,
              height: 4,
              margin: "0 auto",
              borderRadius: 999,
              background: "#E7E5E4",
            }}
            aria-hidden
          />
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            padding: "12px 20px 12px",
            background: "#FFFFFF",
          }}
        >
          <div
            style={{
              marginBottom: 14,
              paddingBottom: 14,
              borderBottom: "1px solid rgba(28,25,23,0.08)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 11px 4px 7px",
                borderRadius: 999,
                background: badge.bg,
                color: badge.text,
                fontSize: 11,
                fontWeight: 650,
                letterSpacing: "-0.01em",
                lineHeight: "18px",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              <StatusBadgeIcon status={safeMeta.status} color={badge.text} />
              <span style={{ flexShrink: 0 }}>{badge.label}</span>
              <span style={{ opacity: 0.35, fontWeight: 700 }} aria-hidden>
                ·
              </span>
              <span style={{ fontWeight: 600, opacity: 0.88, overflowWrap: "anywhere", minWidth: 0 }}>
                {formatAppliedDate(safeMeta.appliedAtISO)}
              </span>
            </span>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 12,
                lineHeight: "17px",
                color: "#A8A29E",
                letterSpacing: "-0.01em",
                maxWidth: 340,
              }}
            >
              {appliedSheetHint}
            </p>
          </div>
          <JobCard job={job} isTop={false} variant="embedded" />
        </div>

        <div
          style={{
            flexShrink: 0,
            padding: "12px 20px calc(12px + env(safe-area-inset-bottom, 0px))",
            background: "#FFFFFF",
            borderTop: "1px solid rgba(28,25,23,0.08)",
          }}
        >
          <button
            type="button"
            title={job.externalUrl ? undefined : "Posting link is not available for this role yet."}
            onClick={() => {
              if (job.externalUrl) {
                try {
                  window.open(job.externalUrl, "_blank", "noopener,noreferrer");
                } catch {
                  // ignore
                }
              }
            }}
            style={{
              width: "100%",
              minHeight: 44,
              borderRadius: 12,
              border: "1px solid rgba(28,25,23,0.14)",
              background: "#FFFFFF",
              color: "#292524",
              fontSize: 13,
              fontWeight: 650,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxSizing: "border-box",
              boxShadow: "0 1px 2px rgba(28,25,23,0.04)",
            }}
          >
            <ExternalLink size={16} strokeWidth={2.2} />
            View job posting
          </button>
        </div>
      </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Shared logo tile: gradient wash + letter in brand color (matches Applied job cards). */
function jobLogoAvatarStyle(logoColor: string): React.CSSProperties {
  return {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: `linear-gradient(145deg, ${logoColor}26 0%, ${logoColor}0F 55%, #FFFFFF 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: logoColor,
    fontSize: 15,
    fontWeight: 700,
    flexShrink: 0,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
  };
}

function AppliedJobCard({
  job,
  meta,
  onViewDetails,
}: {
  job: Job;
  meta?: AppliedMeta;
  onViewDetails: () => void;
}) {
  const safeMeta: AppliedMeta = meta ?? {
    appliedAtISO: new Date().toISOString(),
    status: "submitted",
    via: "Zappy Apply",
    resume: "Zappy profile",
    followUpInDays: 3,
  };
  const badge = statusBadge(safeMeta.status);
  const metaDividerStyle: React.CSSProperties = {
    color: "#A8A29E",
    padding: "0 7px",
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1,
    position: "relative",
    top: 1,
  };

  return (
    <div
      style={{
        borderRadius: 18,
        overflow: "hidden",
        background: "#FFFFFF",
        boxShadow: "0 0 0 1px rgba(28,25,23,0.05), 0 4px 20px rgba(28,25,23,0.06)",
      }}
    >
      <div style={{ padding: "15px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={jobLogoAvatarStyle(job.logoColor)}>{job.logoLetter}</div>

          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 650,
                  color: "#0C0A09",
                  letterSpacing: "-0.035em",
                  lineHeight: "21px",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {job.title}
              </h3>
              {typeof job.matchScore === "number" && (
                <div
                  style={{
                    padding: "4px 9px",
                    borderRadius: 999,
                    border: "1px solid rgba(28,25,23,0.08)",
                    background: "linear-gradient(180deg, #FAFAF9 0%, #F5F5F4 100%)",
                    color: "#44403C",
                    fontSize: 11,
                    fontWeight: 750,
                    letterSpacing: "-0.04em",
                    flexShrink: 0,
                    lineHeight: "15px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {job.matchScore}%
                </div>
              )}
            </div>

            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#78716C",
                letterSpacing: "-0.012em",
                lineHeight: "18px",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              <span style={{ fontWeight: 600, color: "#57534E" }}>{job.company}</span>
              <span style={metaDividerStyle} aria-hidden>
                ·
              </span>
              {job.location}
              <span style={metaDividerStyle} aria-hidden>
                ·
              </span>
              {job.locationType}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "11px 14px 12px",
          background: "linear-gradient(180deg, rgba(250,250,249,0.96) 0%, #F5F5F4 100%)",
          borderTop: "1px solid rgba(28,25,23,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "6px 12px",
            minWidth: 0,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 9px 3px 7px",
              borderRadius: 999,
              background: badge.bg,
              color: badge.text,
              fontSize: 11,
              fontWeight: 650,
              letterSpacing: "-0.01em",
              lineHeight: "16px",
              flexShrink: 0,
            }}
          >
            <StatusBadgeIcon status={safeMeta.status} color={badge.text} />
            {badge.label}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 500,
              color: "#78716C",
              letterSpacing: "-0.01em",
              lineHeight: "18px",
              minWidth: 0,
            }}
          >
            <CalendarClock size={14} strokeWidth={2} style={{ flexShrink: 0, color: "#A8A29E" }} aria-hidden />
            <span style={{ overflowWrap: "anywhere" }}>{formatAppliedDate(safeMeta.appliedAtISO)}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onViewDetails}
          aria-label={`View full details for ${job.title} at ${job.company}`}
          style={{
            flexShrink: 0,
            minHeight: 44,
            minWidth: 44,
            padding: "0 10px 0 14px",
            margin: "-4px -6px -4px 0",
            border: "none",
            borderRadius: 12,
            background: "transparent",
            color: "#EA580C",
            fontSize: 13,
            fontWeight: 650,
            letterSpacing: "-0.02em",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            WebkitTapHighlightColor: "transparent",
          }}
        >
          Details
          <ChevronRight size={18} color="#EA580C" strokeWidth={2.25} aria-hidden />
        </button>
      </div>
    </div>
  );
}

function getScoreBadgeStyle(score: number): {
  bg: string;
  text: string;
} {
  if (score >= 90) {
    return {
      bg: "rgba(5,150,105,0.12)",
      text: "#047857",
    };
  }
  if (score >= 80) {
    return {
      bg: "rgba(217,119,6,0.12)",
      text: "#B45309",
    };
  }
  return {
    bg: "rgba(220,38,38,0.10)",
    text: "#B91C1C",
  };
}

function formatJobExperienceRange(min: number, max: number): string {
  if (max <= min) {
    return `${min}+ yrs required`;
  }
  return `${min}\u2013${max} yrs required`;
}

function inferDepartmentFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (
    t.includes("ux") ||
    t.includes("ui") ||
    t.includes("product designer") ||
    t.includes("design lead") ||
    t.includes("design systems") ||
    t.includes("staff product designer") ||
    t.includes("researcher")
  ) {
    return "Product";
  }
  if (t.includes("engineer") || t.includes("developer")) {
    return "Engineering";
  }
  if (t.includes("marketing") || t.includes("growth")) {
    return "Growth";
  }
  return "General";
}

function JobCard({
  job,
  isTop,
  variant = "card",
}: {
  job: Job;
  isTop: boolean;
  variant?: "card" | "embedded";
}) {
  const [expanded, setExpanded] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const requiredSkills = REQUIRED_SKILLS_BY_JOB[job.id] ?? ["Product Design", "User Research", "Visual Design", "Prototyping"];
  const visibleSkills = showAllSkills ? requiredSkills : requiredSkills.slice(0, 4);
  const hiddenSkillsCount = Math.max(requiredSkills.length - visibleSkills.length, 0);
  const experienceMatches = (job.matchScore ?? 0) >= 85;
  const embedded = variant === "embedded";
  const department = inferDepartmentFromTitle(job.title);

  return (
    <div
      style={{
        borderRadius: embedded ? 0 : 20,
        padding: embedded ? 0 : 20,
        background: embedded ? "transparent" : "#FFFFFF",
        border: embedded ? "none" : "1px solid rgba(0,0,0,0.06)",
        boxShadow: embedded
          ? "none"
          : isTop
            ? "0 20px 50px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)"
            : "0 8px 24px rgba(0,0,0,0.06)",
        position: "relative",
        overflow: embedded ? "visible" : "hidden",
      }}
    >
      {/* Header: Logo + Title + Company */}
      <div
        style={{
          display: "flex",
          alignItems: embedded ? "center" : "flex-start",
          justifyContent: embedded ? "center" : undefined,
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div style={jobLogoAvatarStyle(job.logoColor)}>{job.logoLetter}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#111827",
                lineHeight: "22px",
              }}
            >
              {job.title}
            </div>
            {typeof job.matchScore === "number" && (
              <div
                style={{
                  marginLeft: "auto",
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: getScoreBadgeStyle(job.matchScore).bg,
                  color: getScoreBadgeStyle(job.matchScore).text,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: "15px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  flexShrink: 0,
                }}
              >
                {job.matchScore}%
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#6B7280",
              marginTop: 3,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{job.company}</span>
            <span style={{ color: "#D1D5DB" }}>·</span>
            <span>Posted {job.postedAgo}</span>
          </div>
        </div>
      </div>

      {/* Location chip */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 13,
            fontWeight: 500,
            padding: "5px 12px",
            borderRadius: 999,
            backgroundColor: "#F0FDF4",
            color: "#166534",
            border: "1px solid rgba(22,163,74,0.18)",
          }}
        >
          <span style={{ fontSize: 11 }}>◉</span>
          {job.location} · {job.locationType}
        </span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 13,
            fontWeight: 500,
            padding: "5px 12px",
            borderRadius: 999,
            backgroundColor: experienceMatches ? "#F0FDF4" : "#FFFBEB",
            color: experienceMatches ? "#166534" : "#EA580C",
            border: experienceMatches
              ? "1px solid rgba(22,163,74,0.18)"
              : "1px dashed rgba(217,119,6,0.35)",
          }}
        >
          <span>{experienceMatches ? "✓" : "!"}</span>
          <span>
            {experienceMatches
              ? "Experience match"
              : formatJobExperienceRange(job.experienceYearsMin, job.experienceYearsMax)}
          </span>
        </span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 13,
            fontWeight: 500,
            padding: "5px 12px",
            borderRadius: 999,
            backgroundColor: "#F0FDF4",
            color: "#166534",
            border: "1px solid rgba(22,163,74,0.18)",
          }}
        >
          <Briefcase size={11} color="#166534" strokeWidth={2.1} />
          {department}
        </span>

        {/* Salary chip */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 13,
            fontWeight: 500,
            padding: "5px 12px",
            borderRadius: 999,
            backgroundColor: "#FFFBEB",
            color: "#EA580C",
            border: "1px dashed rgba(217,119,6,0.35)",
          }}
        >
          <span style={{ fontSize: 11 }}>💰</span>
          {job.salary}
        </span>
      </div>

      {/* The Headlines */}
      <SectionBlock
        barColor="#78909C"
        title="The Headlines"
        body={job.headlines}
      />

      {/* Why is this a fit */}
      <SectionBlock
        barColor="#66A36E"
        title="Why is this a fit"
        body={job.whyFit}
      />

      {/* Required Skills */}
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#111827",
            marginBottom: 7,
          }}
        >
          Required skills
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {visibleSkills.map((skill) => (
            <span
              key={skill}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "5px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                color: "#4B5563",
                background: "#F8FAFC",
                border: "1px solid rgba(148,163,184,0.3)",
                letterSpacing: "-0.01em",
              }}
            >
              {skill}
            </span>
          ))}
          {hiddenSkillsCount > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllSkills(true);
              }}
              style={{
                border: "none",
                background: "rgba(234,88,12,0.10)",
                color: "#C2410C",
                padding: "5px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "-0.01em",
              }}
            >
              +{hiddenSkillsCount} more
            </button>
          )}
          {showAllSkills && requiredSkills.length > 4 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllSkills(false);
              }}
              style={{
                border: "none",
                background: "transparent",
                color: "#EA580C",
                padding: "5px 4px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Show less
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          backgroundColor: "rgba(0,0,0,0.05)",
          margin: "6px 0 14px",
        }}
      />

      {/* Job Description */}
      <div style={{ marginBottom: 4 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.01em",
            marginBottom: 8,
          }}
        >
          Job Description
        </div>
        {!expanded ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(true);
            }}
            style={{
              marginTop: 2,
              padding: 0,
              border: "none",
              background: "transparent",
              color: "#EA580C",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 11 }}>▼</span>
            View job description
          </button>
        ) : (
          <>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: "21px",
                color: "#4B5563",
              }}
            >
              {job.jobDescription}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(false);
              }}
              style={{
                marginTop: 6,
                padding: 0,
                border: "none",
                background: "transparent",
                color: "#EA580C",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 11 }}>▲</span>
              Hide description
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function SectionBlock({
  barColor,
  title,
  body,
}: {
  barColor: string;
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          width: 3,
          borderRadius: 2,
          backgroundColor: barColor,
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#111827",
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: "21px",
            color: "#4B5563",
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

function TabPill({
  icon,
  label,
  count,
  flexWeight = 1,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  flexWeight?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        display: "inline-flex",
        flex: `${flexWeight} 1 0%`,
        minWidth: 0,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: "7px 8px",
        borderRadius: 999,
        border: active ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(0,0,0,0.06)",
        backgroundColor: active ? "#FFFFFF" : "transparent",
        boxShadow: active ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
        cursor: "pointer",
        transition: "all 0.15s ease",
        overflow: "hidden",
      }}
    >
      <span style={{ color: active ? "#111827" : "#9CA3AF", display: "flex" }}>
        {icon}
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: active ? 600 : 500,
          color: active ? "#111827" : "#6B7280",
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          minWidth: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: active ? "#111827" : "#9CA3AF",
          backgroundColor: active ? "#F3F4F6" : "rgba(0,0,0,0.04)",
          borderRadius: 6,
          padding: "1px 5px",
          minWidth: 18,
          textAlign: "center",
        }}
      >
        {count}
      </span>
    </motion.button>
  );
}

/* ── Search Discovery Experience ─────────────────────────────────────────── */

function SearchContent({
  query,
  results,
  savedIds,
  onToggleSave,
  onSelectSuggestion,
}: {
  query: string;
  results: SearchJob[];
  savedIds: Set<string>;
  onToggleSave: (id: string) => void;
  onSelectSuggestion: (s: string) => void;
}) {
  const BROWSE_CATEGORIES = [
    { label: "Remote in India", emoji: "🏠", query: "Remote" },
    { label: "AI & Machine Learning", emoji: "🤖", query: "AI" },
    { label: "Leadership roles", emoji: "👑", query: "Lead" },
    { label: "Fintech companies", emoji: "💳", query: "Fintech" },
    { label: "Startups", emoji: "🚀", query: "Startup" },
  ];

  if (!query.trim()) {
    return (
      <div style={{ width: "100%", maxWidth: 380, paddingTop: 4 }}>
        <div
          style={{
            padding: "10px 0 10px",
            fontSize: 12,
            fontWeight: 600,
            color: "#9CA3AF",
            letterSpacing: "0.04em",
            textTransform: "uppercase" as const,
          }}
        >
          Try searching for
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SEARCH_SUGGESTIONS.map((s) => (
            <motion.button
              key={s}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectSuggestion(s)}
              style={{
                padding: "8px 14px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.06)",
                background: "#FFFFFF",
                fontSize: 13,
                fontWeight: 500,
                color: "#374151",
                cursor: "pointer",
                letterSpacing: "-0.01em",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              {s}
            </motion.button>
          ))}
        </div>

        <div
          style={{
            padding: "22px 0 8px",
            fontSize: 12,
            fontWeight: 600,
            color: "#9CA3AF",
            letterSpacing: "0.04em",
            textTransform: "uppercase" as const,
          }}
        >
          Browse by department
        </div>
        <div
          style={{
            borderRadius: 16,
            background: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          {BROWSE_CATEGORIES.map((cat, i) => (
            <button
              key={cat.query}
              type="button"
              onClick={() => onSelectSuggestion(cat.query)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "13px 14px",
                borderBottom:
                  i < BROWSE_CATEGORIES.length - 1
                    ? "1px solid rgba(0,0,0,0.04)"
                    : "none",
                border: "none",
                borderBottomStyle: i < BROWSE_CATEGORIES.length - 1 ? "solid" : "none",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0,0,0,0.04)",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "background 0.12s",
              }}
            >
              <span style={{ fontSize: 17, lineHeight: 1 }}>{cat.emoji}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#374151",
                  letterSpacing: "-0.01em",
                }}
              >
                {cat.label}
              </span>
              <ChevronDown
                size={14}
                color="#C4C4C4"
                strokeWidth={2}
                style={{ marginLeft: "auto", transform: "rotate(-90deg)" }}
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          maxWidth: 380,
          paddingTop: 48,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 14 }}>🔍</div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#111827",
            marginBottom: 6,
            letterSpacing: "-0.02em",
          }}
        >
          No roles found
        </div>
        <p
          style={{
            fontSize: 13,
            lineHeight: "20px",
            color: "#6B7280",
            margin: "0 0 20px",
          }}
        >
          Try different keywords or browse departments above.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {SEARCH_SUGGESTIONS.slice(0, 4).map((s) => (
            <motion.button
              key={s}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectSuggestion(s)}
              style={{
                padding: "7px 13px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.06)",
                background: "#FFFFFF",
                fontSize: 12.5,
                fontWeight: 500,
                color: "#6B7280",
                cursor: "pointer",
              }}
            >
              {s}
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 380, paddingTop: 4 }}>
      <div
        style={{
          padding: "4px 0 10px",
          fontSize: 12,
          fontWeight: 600,
          color: "#9CA3AF",
          letterSpacing: "0.04em",
          textTransform: "uppercase" as const,
        }}
      >
        {results.length} role{results.length !== 1 ? "s" : ""} found
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {results.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <SearchResultCard
              job={job}
              saved={savedIds.has(job.id)}
              onToggleSave={() => onToggleSave(job.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SearchResultCard({
  job,
  saved,
  onToggleSave,
}: {
  job: SearchJob;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded((v) => !v)}
      style={{
        borderRadius: 18,
        padding: 16,
        background: "#FFFFFF",
        border: expanded
          ? "1px solid rgba(234,88,12,0.12)"
          : "1px solid rgba(0,0,0,0.06)",
        boxShadow: expanded
          ? "0 4px 16px rgba(0,0,0,0.06)"
          : "0 1px 4px rgba(0,0,0,0.03)",
        cursor: "pointer",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Collapsed header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={jobLogoAvatarStyle(job.logoColor)}>{job.logoLetter}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                fontSize: 14.5,
                fontWeight: 600,
                color: "#111827",
                letterSpacing: "-0.02em",
                lineHeight: "19px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {job.title}
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                padding: "3px 8px",
                borderRadius: 999,
                background:
                  job.source === "zappyfind"
                    ? "rgba(234,88,12,0.08)"
                    : "rgba(0,0,0,0.04)",
                flexShrink: 0,
              }}
            >
              {job.source === "zappyfind" ? (
                <Sparkles size={10} color="#EA580C" strokeWidth={2.5} />
              ) : (
                <Globe size={10} color="#6B7280" strokeWidth={2} />
              )}
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color:
                    job.source === "zappyfind" ? "#EA580C" : "#6B7280",
                  letterSpacing: "-0.01em",
                }}
              >
                {job.source === "zappyfind"
                  ? "ZappyFind"
                  : job.sourceName || "External"}
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: 3,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                fontSize: 12.5,
                color: "#6B7280",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              {job.company}
            </span>
            <span style={{ color: "#D1D5DB", fontSize: 10 }}>·</span>
            <span
              style={{
                fontSize: 12.5,
                color: "#9CA3AF",
                letterSpacing: "-0.01em",
              }}
            >
              {job.postedAgo}
            </span>
          </div>

          <div
            style={{
              marginTop: 7,
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 500,
                padding: "3px 9px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.03)",
                color: "#6B7280",
              }}
            >
              <MapPin size={10} strokeWidth={2.5} />
              {job.location} · {job.locationType}
            </span>
            {typeof job.matchScore === "number" && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 7px",
                  borderRadius: 999,
                  background:
                    job.matchScore >= 80
                      ? "rgba(5,150,105,0.1)"
                      : "rgba(217,119,6,0.1)",
                  color: job.matchScore >= 80 ? "#047857" : "#B45309",
                  letterSpacing: "-0.02em",
                }}
              >
                {job.matchScore}% match
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                paddingTop: 14,
                borderTop: "1px solid rgba(0,0,0,0.05)",
                marginTop: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 12 }}>💰</span>
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#374151",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {job.salary}
                </span>
              </div>

              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: 13,
                  lineHeight: "21px",
                  color: "#4B5563",
                }}
              >
                {job.summary}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 14,
                }}
              >
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11.5,
                      fontWeight: 500,
                      padding: "3px 10px",
                      borderRadius: 999,
                      border: "1px solid rgba(0,0,0,0.06)",
                      color: "#6B7280",
                      background: "#FAFAF9",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div
                style={{ display: "flex", gap: 8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggleSave}
                  style={{
                    height: 40,
                    padding: "0 14px",
                    borderRadius: 12,
                    border: saved
                      ? "1px solid rgba(234,88,12,0.2)"
                      : "1px solid rgba(0,0,0,0.08)",
                    background: saved ? "rgba(234,88,12,0.06)" : "#FFFFFF",
                    color: saved ? "#EA580C" : "#374151",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <Bookmark
                    size={14}
                    strokeWidth={2}
                    fill={saved ? "#EA580C" : "none"}
                  />
                  {saved ? "Saved" : "Save"}
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{
                    y: -1,
                    boxShadow: "0 10px 28px rgba(234,88,12,0.4)",
                  }}
                  onClick={() => {
                    if (job.externalUrl) {
                      try {
                        window.open(
                          job.externalUrl,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      } catch {
                        /* ignore */
                      }
                    }
                  }}
                  style={{
                    flex: 1,
                    height: 40,
                    borderRadius: 12,
                    border: "none",
                    background:
                      "linear-gradient(135deg, #EA580C 0%, #EA580C 45%, #EA580C 100%)",
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    letterSpacing: "-0.01em",
                    boxShadow: "0 6px 20px rgba(234,88,12,0.3)",
                  }}
                >
                  {job.source === "external" ? (
                    <>
                      View & Apply{" "}
                      <ExternalLink size={13} strokeWidth={2.2} />
                    </>
                  ) : (
                    "Quick Apply →"
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand indicator */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 6,
        }}
      >
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} color="#C4C4C4" strokeWidth={2} />
        </motion.div>
      </div>
    </div>
  );
}
