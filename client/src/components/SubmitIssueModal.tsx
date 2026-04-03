import { useState } from "react";
import { useIssues } from "@/contexts/IssuesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, AlertTriangle, AlertCircle, Leaf, Upload, Loader2, Zap } from "lucide-react";

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

type SubmitStep = "upload" | "description" | "review";

export default function SubmitIssueModal({ onClose, userLocation }: SubmitIssueModalProps) {
  const { addIssue } = useIssues();
  const [step, setStep] = useState<SubmitStep>("upload");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [userDescription, setUserDescription] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"critical" | "warning" | "community">("warning");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzePhoto = async () => {
    if (!photoFile || !userDescription) return;
    
    setAnalyzing(true);
    try {
      // Simulate AI analysis delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock AI-generated title and description based on user input
      const mockTitles: Record<string, string> = {
        яма: "Большая яма на проезжей части",
        фонарь: "Сломанный уличный фонарь",
        вода: "Проблема с водоснабжением",
        электричество: "Отключение электричества",
        краска: "Требуется покраска",
        озеленение: "Необходимо озеленение",
      };

      const mockDescriptions: Record<string, string> = {
        яма: "Опасная яма на проезжей части требует срочного ремонта. Может привести к повреждению транспортных средств и травмам пешеходов.",
        фонарь: "Уличный фонарь не функционирует, что создает опасность для пешеходов в ночное время. Требуется замена или ремонт.",
        вода: "Обнаружена проблема с давлением или качеством водоснабжения. Необходима проверка и ремонт системы.",
        электричество: "Зафиксировано отключение электроэнергии. Требуется срочное восстановление подачи электричества.",
        краска: "Поверхность требует обновления покрытия. Рекомендуется профессиональная покраска для улучшения внешнего вида.",
        озеленение: "Территория нуждается в озеленении для улучшения экологической ситуации и эстетики района.",
      };

      let detectedTitle = "Проблема инфраструктуры";
      let detectedDescription = "Обнаружена проблема, требующая внимания городских служб.";
      let detectedCategory: "critical" | "warning" | "community" = "warning";

      // Simple keyword matching for demo
      const lowerDesc = userDescription.toLowerCase();
      for (const [keyword, title] of Object.entries(mockTitles)) {
        if (lowerDesc.includes(keyword)) {
          detectedTitle = title;
          detectedDescription = mockDescriptions[keyword];
          
          if (keyword === "яма" || keyword === "фонарь") {
            detectedCategory = "warning";
          } else if (keyword === "вода" || keyword === "электричество") {
            detectedCategory = "critical";
          } else {
            detectedCategory = "community";
          }
          break;
        }
      }

      setTitle(detectedTitle);
      setDescription(detectedDescription);
      setCategory(detectedCategory);
      setStep("review");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
        photoUrl: photoPreview,
        userDescription,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            Подать новую заявку
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Загрузите фото проблемы и ИИ автоматически создаст описание
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <form onSubmit={(e) => { e.preventDefault(); setStep("description"); }} className="space-y-6">
            {/* Photo Upload */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-cyan-400">Загрузить фото проблемы</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="photo-input"
                  required
                />
                <label
                  htmlFor="photo-input"
                  className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-cyan-400 transition-colors bg-slate-800/50"
                >
                  {photoPreview ? (
                    <div className="relative w-full">
                      <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPhotoFile(null);
                          setPhotoPreview("");
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-600 rounded-full hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                      <p className="text-slate-300 font-medium">Нажмите для загрузки фото</p>
                      <p className="text-xs text-slate-500 mt-1">или перетащите файл сюда</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={onClose} className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
                Отмена
              </Button>
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white" disabled={!photoFile}>
                Далее
              </Button>
            </div>
          </form>
        )}

        {step === "description" && (
          <form onSubmit={(e) => { e.preventDefault(); handleAnalyzePhoto(); }} className="space-y-6">
            {/* Photo Preview */}
            {photoPreview && (
              <div className="rounded-lg overflow-hidden">
                <img src={photoPreview} alt="Preview" className="w-full h-32 object-cover" />
              </div>
            )}

            {/* User Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-400">Кратко опишите проблему</label>
              <textarea
                placeholder="Например: На дороге большая яма, опасно для машин..."
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-500 resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("upload")}
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                Назад
              </Button>
              <Button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
                disabled={analyzing || !userDescription}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Анализирую...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    ИИ Анализ
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {step === "review" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Preview */}
            {photoPreview && (
              <div className="rounded-lg overflow-hidden">
                <img src={photoPreview} alt="Preview" className="w-full h-32 object-cover" />
              </div>
            )}

            {/* AI Generated Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-400">Название (ИИ-сгенерировано)</label>
              <div className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white">
                {title}
              </div>
            </div>

            {/* AI Generated Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-400">Описание (ИИ-сгенерировано)</label>
              <div className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm leading-relaxed">
                {description}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-400">Категория (ИИ-определено)</label>
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-white">
                      <div className="flex items-center gap-2">
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Info */}
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-300">
                <span className="font-medium text-cyan-400">Локация:</span> {userLocation.residentialComplex}, {userLocation.street} {userLocation.house}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("description")}
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                Назад
              </Button>
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white" disabled={loading}>
                {loading ? "Отправка..." : "Подать заявку"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
