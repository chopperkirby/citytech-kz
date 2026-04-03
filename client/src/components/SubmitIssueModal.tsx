import { useState } from "react";
import { useIssues } from "@/contexts/IssuesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, AlertTriangle, AlertCircle, Leaf, Upload, Loader2, Zap, MapPin } from "lucide-react";
import L from "leaflet";

interface SubmitIssueModalProps {
  onClose: () => void;
  city?: string;
}

const CATEGORIES = [
  { id: "critical", label: "🔴 Критическое", icon: AlertTriangle, routing: "akimat" },
  { id: "warning", label: "🟡 Предупреждение", icon: AlertCircle, routing: "akimat" },
  { id: "community", label: "🟢 Общественное", icon: Leaf, routing: "zhkh" },
];

const ROUTING_CONFIG = {
  zhkh: { label: "ЖКХ (Жилищно-коммунальное хозяйство)", color: "#3B82F6" },
  akimat: { label: "Акимат (Городская администрация)", color: "#8B5CF6" },
};

type SubmitStep = "upload" | "description" | "location" | "review";

const ALMATY_CENTER = [43.2381, 76.9453] as [number, number];

export default function SubmitIssueModal({ onClose, city = "Алматы" }: SubmitIssueModalProps) {
  const { addIssue } = useIssues();
  const [step, setStep] = useState<SubmitStep>("upload");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [userDescription, setUserDescription] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"critical" | "warning" | "community">("warning");

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [mapReady, setMapReady] = useState(false);

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
      await new Promise((resolve) => setTimeout(resolve, 1500));

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

      setDescription(detectedDescription);
      setTitle(detectedTitle);
      setCategory(detectedCategory);
      setStep("location");
    } finally {
      setAnalyzing(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate mock coordinates based on city
      const finalLocation = {
        lat: ALMATY_CENTER[0] + (Math.random() - 0.5) * 0.1,
        lng: ALMATY_CENTER[1] + (Math.random() - 0.5) * 0.1,
      };

      const routedTo = (CATEGORIES.find((c) => c.id === category)?.routing || "akimat") as "zhkh" | "akimat";

      addIssue({
        title,
        description,
        category,
        location: finalLocation,
        address: address.trim(),
        residential_complex: city,
        street: "Не указана",
        house: "Не указана",
        entrance: "Не указана",
        city,
        issueAge: 0,
        photoUrl: photoPreview,
        userDescription,
        routedTo,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Zap className="w-5 h-5 text-cyan-400" />
            Подать заявку
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Photo Upload */}
        {step === "upload" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Загрузите фото проблемы</h3>

            <div
              onClick={() => document.getElementById("photo-input")?.click()}
              className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-500 transition-colors"
            >
              {photoPreview ? (
                <div className="space-y-2">
                  <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <p className="text-sm text-cyan-400">Нажмите, чтобы выбрать другое фото</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-slate-500" />
                  <p className="text-slate-300">Нажмите или перетащите фото</p>
                  <p className="text-xs text-slate-500">PNG, JPG, WebP (макс. 5MB)</p>
                </div>
              )}
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>

            <Button
              onClick={() => setStep("description")}
              disabled={!photoFile}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              Далее
            </Button>
          </div>
        )}

        {/* Step 2: Description & Category */}
        {step === "description" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Опишите проблему</h3>

            <textarea
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
              placeholder="Опишите, что вы видите на фото..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white resize-none"
              rows={4}
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Категория проблемы</label>
              <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-white">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleAnalyzePhoto}
              disabled={analyzing || !userDescription}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ИИ анализирует...
                </>
              ) : (
                "Анализировать фото"
              )}
            </Button>
          </div>
        )}

        {/* Step 3: Location Selection */}
        {step === "location" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Введите адрес проблемы</h3>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Адрес</label>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="ул. Абая, 123, кв. 45, Алматы"
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
              />
              <p className="text-xs text-slate-400 mt-2">Укажите улицу, номер дома, квартиру и город</p>
            </div>

            <div className="p-3 bg-cyan-900/20 border border-cyan-700 rounded-lg text-cyan-300 text-sm">
              <p>✓ Адрес будет использован для маршрутизации в ЖКХ или Акимат</p>
            </div>

            <Button
              onClick={() => setStep("review")}
              disabled={!address.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              Далее
            </Button>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === "review" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold text-lg">Проверьте информацию</h3>

            {photoPreview && (
              <img src={photoPreview} alt="Issue" className="w-full h-32 object-cover rounded-lg" />
            )}

            <div className="space-y-3">
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-600">
                <p className="text-xs text-slate-400">Название</p>
                <p className="text-white font-semibold">{title}</p>
              </div>

              <div className="p-3 bg-slate-800 rounded-lg border border-slate-600">
                <p className="text-xs text-slate-400">Описание</p>
                <p className="text-white text-sm line-clamp-2">{description}</p>
              </div>

              <div className="p-3 bg-slate-800 rounded-lg border border-slate-600">
                <p className="text-xs text-slate-400">Адрес</p>
                <p className="text-white font-semibold">{address}</p>
              </div>

              {/* Routing Category */}
              {(() => {
                const routing = CATEGORIES.find(c => c.id === category)?.routing || "akimat";
                const routingInfo = ROUTING_CONFIG[routing as keyof typeof ROUTING_CONFIG];
                return (
                  <div className="p-4 rounded-lg border-2" style={{ borderColor: routingInfo.color }}>
                    <p className="text-xs text-slate-400 mb-1">Будет отправлено в:</p>
                    <p className="text-white font-bold text-lg">{routingInfo.label}</p>
                  </div>
                );
              })()}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 h-auto py-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                "Подать заявку"
              )}
            </Button>
          </form>
        )}

        {/* Step Navigation */}
        <div className="flex gap-2 mt-4 text-xs text-slate-500">
          <div className={`flex-1 h-1 rounded-full ${step === "upload" || step === "description" || step === "location" || step === "review" ? "bg-cyan-500" : "bg-slate-700"}`}></div>
          <div className={`flex-1 h-1 rounded-full ${step === "description" || step === "location" || step === "review" ? "bg-cyan-500" : "bg-slate-700"}`}></div>
          <div className={`flex-1 h-1 rounded-full ${step === "location" || step === "review" ? "bg-cyan-500" : "bg-slate-700"}`}></div>
          <div className={`flex-1 h-1 rounded-full ${step === "review" ? "bg-cyan-500" : "bg-slate-700"}`}></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
