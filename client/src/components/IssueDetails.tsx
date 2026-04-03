import { Issue, IssueScoringCriteria } from "@/contexts/IssuesContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, AlertCircle, Leaf, MapPin, Calendar, Star, X, CheckCircle, Clock, FileText } from "lucide-react";
import { useState } from "react";

interface IssueDetailsProps {
  issue: Issue;
  onClose: () => void;
  onUpdateStatus?: (status: Issue["status"], note?: string) => void;
  onRateCompletion?: (rating: number, notes: string) => void;
}

const CATEGORY_CONFIG = {
  critical: { color: "#EF4444", icon: AlertTriangle, label: "Критическое" },
  warning: { color: "#F59E0B", icon: AlertCircle, label: "Предупреждение" },
  community: { color: "#22C55E", icon: Leaf, label: "Общественное" },
};

const STATUS_CONFIG = {
  new: { label: "Новое", color: "#3B82F6", icon: FileText },
  pending_approval: { label: "На утверждении", color: "#F59E0B", icon: Clock },
  in_progress: { label: "На выполнении", color: "#8B5CF6", icon: Clock },
  completed: { label: "Выполнено", color: "#22C55E", icon: CheckCircle },
};

const ROUTING_CONFIG = {
  zhkh: "ЖКХ (Жилищно-коммунальное хозяйство)",
  akimat: "Акимат (Городская администрация)",
};

export default function IssueDetails({ issue, onClose, onUpdateStatus, onRateCompletion }: IssueDetailsProps) {
  const categoryConfig = CATEGORY_CONFIG[issue.category];
  const statusConfig = STATUS_CONFIG[issue.status];
  const CategoryIcon = categoryConfig.icon;
  const StatusIcon = statusConfig.icon;

  const [ratingMode, setRatingMode] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [completionNotes, setCompletionNotes] = useState("");

  const handleSubmitRating = () => {
    if (selectedRating > 0 && onRateCompletion) {
      onRateCompletion(selectedRating, completionNotes);
      setRatingMode(false);
    }
  };

  const calculateOverallScore = (scoring: IssueScoringCriteria): number => {
    return Math.round((scoring.danger + scoring.location + scoring.relevance + scoring.scope + scoring.timeElapsed + scoring.convenience) / 6);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white text-xl">
            <CategoryIcon className="w-6 h-6" style={{ color: categoryConfig.color }} />
            {issue.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo */}
          {issue.photoUrl && (
            <div className="rounded-lg overflow-hidden h-48 bg-slate-800">
              <img src={issue.photoUrl} alt="Issue" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Status and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Статус</p>
              <div className="flex items-center gap-2">
                <StatusIcon className="w-5 h-5" style={{ color: statusConfig.color }} />
                <span className="font-semibold">{statusConfig.label}</span>
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Категория</p>
              <div className="flex items-center gap-2">
                <CategoryIcon className="w-5 h-5" style={{ color: categoryConfig.color }} />
                <span className="font-semibold">{categoryConfig.label}</span>
              </div>
            </div>
          </div>

          {/* Routing and Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Отправлено</p>
              <p className="font-semibold text-cyan-400">{ROUTING_CONFIG[issue.routedTo]}</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Местоположение</p>
              <p className="font-semibold text-sm">{issue.residential_complex}</p>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Описание</p>
            <p className="text-slate-200">{issue.description}</p>
          </div>

          {/* Scoring Criteria */}
          <div className="space-y-2">
            <p className="text-xs text-slate-400 font-semibold">Критерии оценки</p>
            <div className="grid grid-cols-2 gap-2">
              <ScoreBar label="Опасность" value={issue.scoring.danger} />
              <ScoreBar label="Местность" value={issue.scoring.location} />
              <ScoreBar label="Актуальность" value={issue.scoring.relevance} />
              <ScoreBar label="Общирность" value={issue.scoring.scope} />
              <ScoreBar label="Время" value={issue.scoring.timeElapsed} />
              <ScoreBar label="Удобство" value={issue.scoring.convenience} />
            </div>
            <div className="mt-3 p-3 bg-cyan-900/30 rounded-lg border border-cyan-700">
              <p className="text-sm font-semibold text-cyan-300">
                Общая оценка: <span className="text-lg">{calculateOverallScore(issue.scoring)}/10</span>
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400">Голосов</p>
              <p className="font-bold text-cyan-400">{issue.supportCount}</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400">Возраст</p>
              <p className="font-bold text-slate-200">{issue.issueAge} дней</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400">Дата</p>
              <p className="font-bold text-slate-200">{new Date(issue.createdAt).toLocaleDateString("ru-RU")}</p>
            </div>
          </div>

          {/* Completion Rating (if completed) */}
          {issue.status === "completed" && (
            <div className="p-4 bg-green-900/20 rounded-lg border border-green-700">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="font-semibold text-green-300">Проблема решена</p>
              </div>
              {issue.completionRating && (
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm text-slate-300">Оценка выполнения:</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= issue.completionRating! ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {issue.completionNotes && (
                <p className="text-sm text-slate-300 mt-2">{issue.completionNotes}</p>
              )}
            </div>
          )}

          {/* Rating Mode */}
          {ratingMode && issue.status === "completed" && (
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3">
              <p className="font-semibold">Оцените качество выполнения</p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= selectedRating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Комментарий (опционально)"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm resize-none"
                rows={2}
              />
              <Button
                onClick={handleSubmitRating}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                disabled={selectedRating === 0}
              >
                Отправить оценку
              </Button>
            </div>
          )}

          {/* Status History */}
          {issue.statusHistory.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-semibold">История статусов</p>
              <div className="space-y-2">
                {issue.statusHistory.map((entry, idx) => (
                  <div key={idx} className="p-2 bg-slate-800/50 rounded-lg border border-slate-700 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-cyan-400">{STATUS_CONFIG[entry.status].label}</span>
                      <span className="text-xs text-slate-500">{new Date(entry.timestamp).toLocaleString("ru-RU")}</span>
                    </div>
                    {entry.note && <p className="text-slate-400 text-xs mt-1">{entry.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const percentage = (value / 10) * 100;
  return (
    <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-bold text-cyan-400">{value}/10</span>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
