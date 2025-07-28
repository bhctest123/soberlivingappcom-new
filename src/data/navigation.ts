import { features } from './features';

export interface NavItem {
  title: string;
  href?: string;
  description?: string;
  children?: NavItem[];
}

// Group features into logical categories
const featureGroups = {
  "Resident Management": [
    "admissions",
    "residents", 
    "alumni",
    "contacts",
    "general-info",
    "portal"
  ],
  "Housing & Operations": [
    "bed-management",
    "properties",
    "housing",
    "housing-notes",
    "operations",
    "scheduling"
  ],
  "Financial & Billing": [
    "billing",
    "invoices",
    "leads"
  ],
  "Compliance & Security": [
    "drug-test",
    "test-results",
    "security",
    "permissions",
    "file-storage"
  ],
  "Communication & Tasks": [
    "communication-logs",
    "tasks",
    "connections"
  ],
  "Organizations & External": [
    "organizations",
    "organizations-providers",
    "organizations-resources", 
    "organizations-vendors"
  ],
  "Management & Analytics": [
    "dashboard",
    "employees",
    "mobile"
  ]
};

export const navigationItems: NavItem[] = [
  {
    title: "Features",
    href: "/features",
    description: "Explore all features",
    children: [
      // Resident Management
      {
        title: "Resident Management",
        description: "Manage residents, admissions, and alumni",
        children: features
          .filter(f => featureGroups["Resident Management"].includes(f.id))
          .map(feature => ({
            title: feature.name,
            href: `/features/${feature.id}`,
            description: feature.description
          }))
      },
      // Housing & Operations
      {
        title: "Housing & Operations", 
        description: "Property and operational management",
        children: features
          .filter(f => featureGroups["Housing & Operations"].includes(f.id))
          .map(feature => ({
            title: feature.name,
            href: `/features/${feature.id}`,
            description: feature.description
          }))
      },
      // Financial & Billing
      {
        title: "Financial & Billing",
        description: "Billing, invoicing, and financial management", 
        children: features
          .filter(f => featureGroups["Financial & Billing"].includes(f.id))
          .map(feature => ({
            title: feature.name,
            href: `/features/${feature.id}`,
            description: feature.description
          }))
      },
      // Compliance & Security
      {
        title: "Compliance & Security",
        description: "Drug testing, security, and compliance",
        children: features
          .filter(f => featureGroups["Compliance & Security"].includes(f.id))
          .map(feature => ({
            title: feature.name,
            href: `/features/${feature.id}`,
            description: feature.description
          }))
      },
      // Communication & Tasks
      {
        title: "Communication & Tasks",
        description: "Communication logs and task management",
        children: features
          .filter(f => featureGroups["Communication & Tasks"].includes(f.id))
          .map(feature => ({
            title: feature.name,
            href: `/features/${feature.id}`,
            description: feature.description
          }))
      },
      // Organizations & External
      {
        title: "Organizations & External",
        description: "External organizations and partnerships",
        children: features
          .filter(f => featureGroups["Organizations & External"].includes(f.id))
          .map(feature => ({
            title: feature.name,
            href: `/features/${feature.id}`,
            description: feature.description
          }))
      },
      // Management & Analytics
      {
        title: "Management & Analytics",
        description: "Dashboard, employees, and mobile access",
        children: features
          .filter(f => featureGroups["Management & Analytics"].includes(f.id))
          .map(feature => ({
            title: feature.name,
            href: `/features/${feature.id}`,
            description: feature.description
          }))
      }
    ]
  },
  {
    title: "Pricing",
    href: "/pricing"
  },
  {
    title: "About",
    href: "/about"
  },
  {
    title: "Blog",
    href: "/blog"
  },
  {
    title: "Search",
    href: "/search"
  },
  {
    title: "Contact",
    href: "/contact"
  }
];

export const mobileNavigationItems: NavItem[] = [
  {
    title: "Home",
    href: "/"
  },
  ...navigationItems
];