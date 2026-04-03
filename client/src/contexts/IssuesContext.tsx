import React, { createContext, useState, useContext, ReactNode } from "react";

// Start with empty issues array
const MOCK_ISSUES_DATA: Issue[] = [];

export interface IssueScoringCriteria {
  danger: number; // 1-10: опасность
  location: number; // 1-10: местность (доступность)
  relevance: number; // 1-10: актуальность
  scope: number; // 1-10: общирность (масштаб проблемы)
  timeElapsed: number; // 1-10: время возникновения
  convenience: number; // 1-10: удобство человека
}

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
  city: string; // Город (Алматы, Астана и т.д.)
  supportCount: number;
  issueAge: number;
  createdAt: Date;
  userSupported: boolean;
  photoUrl?: string;
  userDescription?: string;
  status: "new" | "pending_approval" | "in_progress" | "completed";
  routedTo: "zhkh" | "akimat"; // ЖКХ или Акимат
  scoring: IssueScoringCriteria;
  completionRating?: number; // 1-5: оценка выполнения (для решённых)
  completionNotes?: string;
  statusHistory: Array<{
    status: Issue["status"];
    timestamp: Date;
    note?: string;
  }>;
}

interface IssuesContextType {
  issues: Issue[];
  addIssue: (issue: Omit<Issue, "id" | "createdAt" | "supportCount" | "userSupported" | "status" | "statusHistory" | "scoring">) => void;
  updateIssueStatus: (issueId: string, newStatus: Issue["status"], note?: string) => void;
  updateIssueScoring: (issueId: string, scoring: IssueScoringCriteria) => void;
  completeIssue: (issueId: string, rating: number, notes: string) => void;
  toggleSupport: (issueId: string) => void;
  getHyperLocalIssues: (residentialComplex: string, street: string) => Issue[];
  getCityWideIssues: (city?: string) => Issue[];
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

  const addIssue = (issue: Omit<Issue, "id" | "createdAt" | "supportCount" | "userSupported" | "status" | "statusHistory" | "scoring">) => {
    const newIssue: Issue = {
      ...issue,
      id: `issue_${Date.now()}`,
      createdAt: new Date(),
      supportCount: 0,
      userSupported: false,
      status: "new",
      statusHistory: [{ status: "new", timestamp: new Date() }],
      scoring: {
        danger: 5,
        location: 5,
        relevance: 5,
        scope: 5,
        timeElapsed: 5,
        convenience: 5,
      },
    };
    setIssues([newIssue, ...issues]);
  };

  const updateIssueStatus = (issueId: string, newStatus: Issue["status"], note?: string) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            status: newStatus,
            statusHistory: [
              ...issue.statusHistory,
              { status: newStatus, timestamp: new Date(), note },
            ],
          };
        }
        return issue;
      })
    );
  };

  const updateIssueScoring = (issueId: string, scoring: IssueScoringCriteria) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          return { ...issue, scoring };
        }
        return issue;
      })
    );
  };

  const completeIssue = (issueId: string, rating: number, notes: string) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            status: "completed",
            completionRating: rating,
            completionNotes: notes,
            statusHistory: [
              ...issue.statusHistory,
              { status: "completed", timestamp: new Date(), note: notes },
            ],
          };
        }
        return issue;
      })
    );
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
    <IssuesContext.Provider value={{ issues, addIssue, updateIssueStatus, updateIssueScoring, completeIssue, toggleSupport, getHyperLocalIssues, getCityWideIssues, getClusterIssues }}>
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
