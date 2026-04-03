import React, { createContext, useState, useContext, ReactNode } from "react";

// Start with empty issues array
const MOCK_ISSUES_DATA: Issue[] = [];

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
  createdAt: Date;
  userSupported: boolean;
  photoUrl?: string;
  userDescription?: string;
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

  // Weighted average: support (60%), age (40%)
  const baseScore = supportScore * 0.6 + ageScore * 0.4;

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
