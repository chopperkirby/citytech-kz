import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Zap, ArrowRight } from "lucide-react";

const CITIES = [
  { id: "almaty", name: "Алматы", icon: "🏙️", description: "Крупнейший город Казахстана" },
  { id: "astana", name: "Астана", icon: "🏛️", description: "Столица Казахстана" },
  { id: "karaganda", name: "Карганда", icon: "🏭", description: "Индустриальный центр" },
  { id: "aktobe", name: "Актобе", icon: "⚡", description: "Нефтегазовый регион" },
  { id: "shymkent", name: "Шымкент", icon: "🌆", description: "Город на юге" },
  { id: "kokshetau", name: "Кокшетау", icon: "🌲", description: "Город в степи" },
];

export default function CitySelect() {
  const [, setLocation] = useLocation();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleSelectCity = (cityId: string) => {
    localStorage.setItem("selectedCity", cityId);
    setLocation("/feed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Futuristic background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-3 relative z-10">
          <Zap className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">CityTech KZ</h1>
            <p className="text-sm text-cyan-400">Выберите город</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Выберите ваш город</h2>
          <p className="text-slate-400 text-lg">Сообщайте о проблемах инфраструктуры в вашем городе и помогайте улучшать качество жизни</p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelectCity(city.id)}
              className="group relative"
            >
              <Card
                className={`p-8 text-center transition-all duration-300 cursor-pointer border-2 ${
                  selectedCity === city.id
                    ? "border-cyan-500 bg-cyan-900/20 shadow-lg shadow-cyan-500/50"
                    : "border-slate-700 bg-slate-800/50 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30"
                }`}
              >
                <div className="text-6xl mb-4">{city.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{city.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{city.description}</p>

                <div className="flex items-center justify-center gap-2 text-cyan-400 font-semibold group-hover:gap-3 transition-all">
                  Выбрать
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Card>
            </button>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="text-3xl mb-3">📍</div>
            <h4 className="font-bold text-white mb-2">Локальные проблемы</h4>
            <p className="text-slate-400 text-sm">Видите проблемы в вашем районе и ЖК</p>
          </div>
          <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-bold text-white mb-2">ИИ-анализ</h4>
            <p className="text-slate-400 text-sm">Загружайте фото и ИИ создаёт описание</p>
          </div>
          <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="text-3xl mb-3">📊</div>
            <h4 className="font-bold text-white mb-2">Отслеживание</h4>
            <p className="text-slate-400 text-sm">Следите за статусом решения проблем</p>
          </div>
        </div>
      </main>
    </div>
  );
}
