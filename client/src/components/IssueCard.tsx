import { Issue } from "@/contexts/IssuesContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThumbsUp, MapPin, Calendar, DollarSign, AlertTriangle, AlertCircle, Leaf } from "lucide-react";
import { analyzePriority } from "@/contexts/IssuesContext";

interface IssueCardProps {
  issue: Issue;
  onSupport: (issueId: string) => void;
  onViewDetails?: (issue: Issue) => void;
}

const CATEGORY_CONFIG = {
  critical: { color: "#EF4444", icon: AlertTriangle, label: "Критическое" },
  warning: { color: "#F59E0B", icon: AlertCircle, label: "Предупреждение" },
  community: { color: "#22C55E", icon: Leaf, label: "Общественное" },
};

export default function IssueCard({ issue, onSupport, onViewDetails }: IssueCardProps) {
  const config = CATEGORY_CONFIG[issue.category];
  const Icon = config.icon;
  const priorityScore = analyzePriority(issue);
  const priorityPercent = Math.min((priorityScore / 300) * 100, 100);

  return (
    <Card
      className="p-4 border-l-4 hover:shadow-md transition-all cursor-pointer"
      style={{ borderLeftColor: config.color }}
      onClick={() => onViewDetails?.(issue)}
    >
      <div className="space-y-3">
        {/* Header with category and priority */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4" style={{ color: config.color }} />
              <span className="text-xs font-semibold text-slate-600">{config.label}</span>
            </div>
            <h3 className="font-bold text-slate-900 line-clamp-2">{issue.title}</h3>
          </div>
          {/* Priority Ring */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke={config.color}
                strokeWidth="2"
                strokeDasharray={`${(priorityPercent / 100) * 100} 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-700">{Math.round(priorityScore)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2">{issue.description}</p>

        {/* Metadata */}
        <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{issue.residential_complex}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{issue.issueAge}д назад</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span>{(issue.budgetCost / 1000).toFixed(0)}k</span>
          </div>
        </div>

        {/* Support Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onSupport(issue.id);
          }}
          variant={issue.userSupported ? "default" : "outline"}
          size="sm"
          className="w-full"
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          <span>{issue.supportCount}</span>
        </Button>
      </div>
    </Card>
  );
}
