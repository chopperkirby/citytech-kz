import React, { createContext, useState, useContext, ReactNode } from "react";

// Mock issues data
const MOCK_ISSUES_DATA = [
  {
    id: "1",
    title: "Большая яма на ул. Абая, 45",
    description: "Опасная яма на проезжей части возле дома 45",
    category: "warning" as const,
    location: { lat: 43.238949, lng: 76.938642 },
    address: "ул. Абая, 45, Алматы",
    residential_complex: "ЖК Абай Парк",
    street: "ул. Абая",
    house: "45",
    entrance: "А",
    supportCount: 12,
    issueAge: 3,
    budgetCost: 50000,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    userSupported: false,
  },
  {
    id: "2",
    title: "Отключение электричества в ЖК Нур-Астана",
    description: "Нет электричества в подъездах 1-3 уже 2 дня",
    category: "critical" as const,
    location: { lat: 43.239, lng: 76.939 },
    address: "ЖК Нур-Астана, Алматы",
    residential_complex: "ЖК Нур-Астана",
    street: "ул. Абая",
    house: "50",
    entrance: "Б",
    supportCount: 28,
    issueAge: 2,
    budgetCost: 200000,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    userSupported: false,
  },
  {
    id: "3",
    title: "Нужна покраска детской площадки",
    description: "Краска облезает, нужно перекрасить",
    category: "community" as const,
    location: { lat: 43.237, lng: 76.94 },
    address: "Парк ЖК Абай, Алматы",
    residential_complex: "ЖК Абай Парк",
    street: "ул. Абая",
    house: "40",
    entrance: "В",
    supportCount: 5,
    issueAge: 7,
    budgetCost: 30000,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    userSupported: false,
  },
  {
    id: "4",
    title: "Сломанный фонарь на ул. Панфилова",
    description: "Уличный фонарь не работает, темно ночью",
    category: "warning" as const,
    location: { lat: 43.24, lng: 76.937 },
    address: "ул. Панфилова, 12, Алматы",
    residential_complex: "ЖК Панфилов",
    street: "ул. Панфилова",
    house: "12",
    entrance: "А",
    supportCount: 8,
    issueAge: 5,
    budgetCost: 15000,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    userSupported: false,
  },
  {
    id: "5",
    title: "Засор в системе водоснабжения",
    description: "Низкое давление воды в доме",
    category: "critical" as const,
    location: { lat: 43.236, lng: 76.941 },
    address: "ул. Абая, 35, Алматы",
    residential_complex: "ЖК Абай Парк",
    street: "ул. Абая",
    house: "35",
    entrance: "Г",
    supportCount: 15,
    issueAge: 1,
    budgetCost: 120000,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    userSupported: false,
  },
  {
    id: "6",
    title: "Озеленение парка ЖК Нур-Астана",
    description: "Нужно посадить больше деревьев и кустов",
    category: "community" as const,
    location: { lat: 43.2395, lng: 76.9385 },
    address: "Парк ЖК Нур-Астана, Алматы",
    residential_complex: "ЖК Нур-Астана",
    street: "ул. Абая",
    house: "50",
    entrance: "Б",
    supportCount: 3,
    issueAge: 10,
    budgetCost: 500000,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    userSupported: false,
  },
];

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: "critical" | "warning" | "community";
  location: { lat: number; lng: number };
  address: string;
  residential_complex: string;
  street: string;
  house: string;
  entrance: string;
  supportCount: number;
  issueAge: number;
  budgetCost: number;
  createdAt: Date;
  userSupported: boolean;
}

interface IssuesContextType {
  issues: Issue[];
  addIssue: (issue: Omit<Issue, "id" | "createdAt" | "supportCount" | "userSupported">) => void;
  toggleSupport: (issueId: string) => void;
  getHyperLocalIssues: (residentialComplex: string, street: string) => Issue[];
  getCityWideIssues: () => Issue[];
  getClusterIssues: (lat: number, lng: number, radiusKm: number) => Issue[];
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

/**
 * AI-Driven Priority Ranking Function
 * Calculates a priority score based on:
 * - SupportCount (upvotes from other users)
 * - IssueAge (days active)
 * - BudgetCost (government budget required)
 * - Category severity multiplier
 */
export function analyzePriority(issue: Issue): number {
  const categoryMultiplier = {
    critical: 3.0,
    warning: 1.5,
    community: 0.5,
  }[issue.category];

  // Normalize components to 0-100 scale
  const supportScore = Math.min(issue.supportCount * 5, 100); // Each support = 5 points
  const ageScore = Math.min(issue.issueAge * 3, 100); // Each day = 3 points
  const budgetScore = Math.min((issue.budgetCost / 10000) * 2, 100); // Every 10k budget = 2 points

  // Weighted average: support (40%), age (30%), budget (30%)
  const baseScore = supportScore * 0.4 + ageScore * 0.3 + budgetScore * 0.3;

  return baseScore * categoryMultiplier;
}

export function IssuesProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES_DATA);

  const addIssue = (issue: Omit<Issue, "id" | "createdAt" | "supportCount" | "userSupported">) => {
    const newIssue: Issue = {
      ...issue,
      id: `issue_${Date.now()}`,
      createdAt: new Date(),
      supportCount: 0,
      userSupported: false,
    };
    setIssues([newIssue, ...issues]);
  };

  const toggleSupport = (issueId: string) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            supportCount: issue.userSupported ? issue.supportCount - 1 : issue.supportCount + 1,
            userSupported: !issue.userSupported,
          };
        }
        return issue;
      })
    );
  };

  const getHyperLocalIssues = (residentialComplex: string, street: string): Issue[] => {
    return issues
      .filter((issue) => issue.residential_complex === residentialComplex && issue.street === street)
      .sort((a, b) => analyzePriority(b) - analyzePriority(a));
  };

  const getCityWideIssues = (): Issue[] => {
    return [...issues].sort((a, b) => analyzePriority(b) - analyzePriority(a));
  };

  const getClusterIssues = (lat: number, lng: number, radiusKm: number): Issue[] => {
    const R = 6371; // Earth radius in km
    return issues.filter((issue) => {
      const dLat = ((issue.location.lat - lat) * Math.PI) / 180;
      const dLng = ((issue.location.lng - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((issue.location.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance <= radiusKm;
    });
  };

  return (
    <IssuesContext.Provider value={{ issues, addIssue, toggleSupport, getHyperLocalIssues, getCityWideIssues, getClusterIssues }}>
      {children}
    </IssuesContext.Provider>
  );
}

export function useIssues() {
  const context = useContext(IssuesContext);
  if (!context) {
    throw new Error("useIssues must be used within IssuesProvider");
  }
  return context;
}
