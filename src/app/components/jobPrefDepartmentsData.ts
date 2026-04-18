/**
 * Canonical job department catalog (labels + role presets + progressive disclosure).
 * Icons are assigned in JobPreferencesScreen.tsx by `id`.
 */

export type JobPrefDepartmentRow = {
  id: string;
  label: string;
  /** When true, shown before the user expands "Show all departments". */
  showInitially: boolean;
  roles: string[];
};

/** Maps legacy onboarding category ids to the new department ids. */
export const LEGACY_DEPARTMENT_ID_MAP: Record<string, string> = {
  swe: "engineering_software_qa",
  design: "ux_design_architecture",
  data: "data_science_analytics",
  product: "product_management",
  marketing: "marketing_communication",
  finance: "finance_accounting",
  sales: "sales_business_development",
  hr: "human_resources",
  consulting: "consulting",
  ops: "project_program_management",
  cs: "customer_success_service_operations",
  legal: "legal_regulatory",
  security: "it_information_security",
  health: "healthcare_life_sciences",
  misc: "production_manufacturing_engineering",
  other: "other",
};

/**
 * Full list: high-intent departments first (showInitially), then alphabetical remainder.
 * Matches the reference taxonomy; "Other" stays in the first cohort for free-text entry.
 */
export const JOB_PREF_DEPARTMENTS: JobPrefDepartmentRow[] = [
  {
    id: "engineering_software_qa",
    label: "Engineering – Software & QA",
    showInitially: true,
    roles: [
      "Frontend Engineer",
      "Backend Engineer",
      "Full Stack Engineer",
      "Mobile Developer",
      "DevOps / SRE",
      "QA Engineer",
      "Platform Engineer",
    ],
  },
  {
    id: "ux_design_architecture",
    label: "UX, Design & Architecture",
    showInitially: true,
    roles: [
      "Product Designer",
      "UX Designer",
      "UI Designer",
      "UX Researcher",
      "Design Lead",
      "Design Systems",
    ],
  },
  {
    id: "data_science_analytics",
    label: "Data Science & Analytics",
    showInitially: true,
    roles: ["Data Analyst", "Data Scientist", "ML Engineer", "Data Engineer", "BI Analyst", "Analytics Lead"],
  },
  {
    id: "product_management",
    label: "Product Management",
    showInitially: true,
    roles: ["Product Manager", "Associate PM", "Growth PM", "Technical PM", "Senior PM", "Group PM"],
  },
  {
    id: "it_information_security",
    label: "IT & Information Security",
    showInitially: true,
    roles: ["Security Engineer", "AppSec Engineer", "SOC Analyst", "GRC Analyst", "IT Administrator", "Cloud Engineer"],
  },
  {
    id: "marketing_communication",
    label: "Marketing & Communication",
    showInitially: true,
    roles: ["Growth Marketer", "Content Marketer", "Brand Marketer", "Performance Marketer", "SEO Specialist", "Comms Manager"],
  },
  {
    id: "sales_business_development",
    label: "Sales & Business Development",
    showInitially: true,
    roles: ["Account Executive", "SDR / BDR", "Enterprise Sales", "Inside Sales", "Sales Manager", "Partnerships"],
  },
  {
    id: "finance_accounting",
    label: "Finance & Accounting",
    showInitially: true,
    roles: ["Financial Analyst", "Accountant", "FP&A", "Controller", "Treasury", "Audit"],
  },
  {
    id: "human_resources",
    label: "Human Resources",
    showInitially: true,
    roles: ["HR Generalist", "HRBP", "Recruiter", "Talent Acquisition", "L&D Specialist", "People Ops"],
  },
  {
    id: "consulting",
    label: "Consulting",
    showInitially: true,
    roles: ["Strategy Consultant", "Management Consultant", "Associate Consultant", "Business Analyst", "Implementation Consultant"],
  },
  {
    id: "customer_success_service_operations",
    label: "Customer Success, Service & Operations",
    showInitially: true,
    roles: ["Customer Success Manager", "Account Manager", "Support Lead", "Operations Analyst", "Onboarding Specialist", "Service Delivery"],
  },
  {
    id: "bfsi_investments_trading",
    label: "BFSI, Investments & Trading",
    showInitially: true,
    roles: ["Investment Analyst", "Relationship Manager", "Credit Analyst", "Risk Analyst", "Wealth Associate", "Treasury Ops"],
  },
  {
    id: "project_program_management",
    label: "Project & Program Management",
    showInitially: true,
    roles: ["Program Manager", "Project Manager", "Scrum Master", "PMO Analyst", "Delivery Manager", "Technical PM"],
  },
  {
    id: "healthcare_life_sciences",
    label: "Healthcare & Life Sciences",
    showInitially: true,
    roles: ["Clinical Research Associate", "Medical Affairs", "Healthcare Analyst", "Regulatory Affairs", "Lab Technician", "Pharmacist"],
  },
  {
    id: "legal_regulatory",
    label: "Legal & Regulatory",
    showInitially: true,
    roles: ["Corporate Counsel", "Paralegal", "Compliance Officer", "Contract Manager", "Legal Operations", "IP Specialist"],
  },
  {
    id: "teaching_training",
    label: "Teaching & Training",
    showInitially: true,
    roles: ["Trainer", "Instructional Designer", "Faculty", "Curriculum Developer", "L&D Coordinator", "Corporate Trainer"],
  },
  {
    id: "content_editorial_journalism",
    label: "Content, Editorial & Journalism",
    showInitially: true,
    roles: ["Content Writer", "Editor", "Copywriter", "Content Strategist", "Technical Writer", "Journalist"],
  },
  {
    id: "other",
    label: "Other",
    showInitially: true,
    roles: [],
  },

  /* ── Remaining departments (progressive disclosure) ───────────────────── */
  {
    id: "administration_facilities",
    label: "Administration and Facilities",
    showInitially: false,
    roles: ["Office Manager", "Admin Assistant", "Executive Assistant", "Facilities Coordinator", "Front Desk Lead"],
  },
  {
    id: "automobile_auto_ancillary",
    label: "Automobile & Auto Ancillary",
    showInitially: false,
    roles: ["Production Engineer", "Quality Engineer", "Sales Engineer", "Service Manager", "Supply Chain (Auto)"],
  },
  {
    id: "aviation_aerospace",
    label: "Aviation & Aerospace",
    showInitially: false,
    roles: ["Maintenance Engineer", "Ground Operations", "Safety Officer", "Aerospace Design", "Airworthiness"],
  },
  {
    id: "csr_social_service",
    label: "CSR & Social Service",
    showInitially: false,
    roles: ["Program Coordinator", "Grants Manager", "Community Lead", "Impact Analyst", "Volunteer Manager"],
  },
  {
    id: "construction_site_engineering",
    label: "Construction & Site Engineering",
    showInitially: false,
    roles: ["Site Engineer", "Planning Engineer", "Quantity Surveyor", "Project Coordinator", "Structural Engineer"],
  },
  {
    id: "energy_mining",
    label: "Energy & Mining",
    showInitially: false,
    roles: ["Field Engineer", "Operations Technician", "Geologist", "Maintenance Planner", "HSE (Energy)"],
  },
  {
    id: "engineering_hardware_networks",
    label: "Engineering – Hardware & Networks",
    showInitially: false,
    roles: ["Hardware Engineer", "Firmware Engineer", "Network Engineer", "RF Engineer", "Embedded Engineer"],
  },
  {
    id: "environment_health_safety",
    label: "Environment Health & Safety",
    showInitially: false,
    roles: ["EHS Officer", "Industrial Hygienist", "Environment Officer", "Safety Trainer", "Incident Investigator"],
  },
  {
    id: "food_beverage_hospitality",
    label: "Food, Beverage & Hospitality",
    showInitially: false,
    roles: ["Restaurant Manager", "Chef", "F&B Operations", "Hotel Operations", "Banquet Sales"],
  },
  {
    id: "media_production_entertainment",
    label: "Media Production & Entertainment",
    showInitially: false,
    roles: ["Producer", "Video Editor", "Motion Designer", "Sound Engineer", "Production Assistant"],
  },
  {
    id: "merchandising_retail_ecommerce",
    label: "Merchandising, Retail & eCommerce",
    showInitially: false,
    roles: ["Store Manager", "Merchandiser", "E-commerce Manager", "Category Manager", "Retail Ops"],
  },
  {
    id: "procurement_supply_chain",
    label: "Procurement & Supply Chain",
    showInitially: false,
    roles: ["Buyer", "Sourcing Analyst", "Category Manager", "Logistics Coordinator", "Demand Planner"],
  },
  {
    id: "production_manufacturing_engineering",
    label: "Production, Manufacturing & Engineering",
    showInitially: false,
    roles: ["Manufacturing Engineer", "Plant Manager", "Process Engineer", "Production Supervisor", "Industrial Engineer"],
  },
  {
    id: "quality_assurance",
    label: "Quality Assurance",
    showInitially: false,
    roles: ["QA Manager", "Quality Inspector", "ISO Auditor", "Supplier Quality", "Quality Systems"],
  },
  {
    id: "research_development",
    label: "Research & Development",
    showInitially: false,
    roles: ["Research Scientist", "R&D Engineer", "Innovation Lead", "Materials Scientist", "Lab Manager"],
  },
  {
    id: "risk_management_compliance",
    label: "Risk Management & Compliance",
    showInitially: false,
    roles: ["Risk Analyst", "Internal Audit", "Compliance Manager", "Policy Analyst", "Operational Risk"],
  },
  {
    id: "security_services",
    label: "Security Services",
    showInitially: false,
    roles: ["Security Supervisor", "CCTV Operations", "Guard Force Manager", "Loss Prevention", "Security Trainer"],
  },
  {
    id: "shipping_maritime",
    label: "Shipping & Maritime",
    showInitially: false,
    roles: ["Marine Engineer", "Port Operations", "Freight Coordinator", "Chartering Executive", "Vessel Operations"],
  },
  {
    id: "sports_fitness_personal_care",
    label: "Sports, Fitness & Personal Care",
    showInitially: false,
    roles: ["Coach", "Fitness Trainer", "Sports Ops", "Wellness Coordinator", "Program Manager (Sports)"],
  },
  {
    id: "strategic_top_management",
    label: "Strategic & Top Management",
    showInitially: false,
    roles: ["Chief of Staff", "Strategy Director", "GM / Business Head", "COO Office", "Corporate Strategy"],
  },
];

export const JOB_DEPARTMENT_LABEL_BY_ID: Record<string, string> = Object.fromEntries(
  JOB_PREF_DEPARTMENTS.map((d) => [d.id, d.label]),
) as Record<string, string>;

for (const [legacyId, newId] of Object.entries(LEGACY_DEPARTMENT_ID_MAP)) {
  const label = JOB_DEPARTMENT_LABEL_BY_ID[newId];
  if (label) JOB_DEPARTMENT_LABEL_BY_ID[legacyId] = label;
}

export const JOB_PREF_DEPARTMENTS_FOR_EDIT = JOB_PREF_DEPARTMENTS.map(({ id, label, roles }) => ({
  id,
  label,
  roles,
}));
