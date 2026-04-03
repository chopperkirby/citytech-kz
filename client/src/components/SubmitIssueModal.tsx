import { useState } from "react";
import { useIssues } from "@/contexts/IssuesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, AlertTriangle, AlertCircle, Leaf } from "lucide-react";

interface SubmitIssueModalProps {
  onClose: () => void;
  userLocation: {
    residentialComplex: string;
    street: string;
    house: string;
    entrance: string;
  };
}

const CATEGORIES = [
  { id: "critical", label: "Критическое", icon: AlertTriangle },
  { id: "warning", label: "Предупреждение", icon: AlertCircle },
  { id: "community", label: "Общественное", icon: Leaf },
];

export default function SubmitIssueModal({ onClose, userLocation }: SubmitIssueModalProps) {
  const { addIssue } = useIssues();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"critical" | "warning" | "community">("warning");
  const [budgetCost, setBudgetCost] = useState("50000");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock location - in production, use geolocation API
      const mockLocation = {
        lat: 43.2381 + (Math.random() - 0.5) * 0.1,
        lng: 76.9453 + (Math.random() - 0.5) * 0.1,
      };

      addIssue({
        title,
        description,
        category,
        location: mockLocation,
        address: `${userLocation.street}, ${userLocation.house}, Алматы`,
        residential_complex: userLocation.residentialComplex,
        street: userLocation.street,
        house: userLocation.house,
        entrance: userLocation.entrance,
        issueAge: 0,
        budgetCost: parseInt(budgetCost),
      });

      // Reset and close
      setTitle("");
      setDescription("");
      setCategory("warning");
      setBudgetCost("50000");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Подать новую заявку</DialogTitle>
          <DialogDescription>
            Опишите проблему инфраструктуры в вашем районе
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Название проблемы</label>
            <Input
              placeholder="Например: Большая яма на ул. Абая"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Описание</label>
            <textarea
              placeholder="Подробно опишите проблему..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Категория</label>
            <Select value={category} onValueChange={(value: any) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <cat.icon className="w-4 h-4" />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget Cost */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Примерная стоимость (тенге)</label>
            <Input
              type="number"
              placeholder="50000"
              value={budgetCost}
              onChange={(e) => setBudgetCost(e.target.value)}
              required
            />
          </div>

          {/* Location Info */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-slate-700">
              <span className="font-medium">Локация:</span> {userLocation.residentialComplex}, {userLocation.street} {userLocation.house}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Отправка..." : "Подать заявку"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
