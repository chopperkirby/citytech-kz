import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowRight, Zap } from "lucide-react";

type AuthMode = "login" | "signup" | "profile";

export default function Auth() {
  const { login, signup, completeProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [residentialComplex, setResidentialComplex] = useState("");
  const [street, setStreet] = useState("");
  const [house, setHouse] = useState("");
  const [entrance, setEntrance] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      setMode("profile");
    } catch (err) {
      setError("Ошибка входа. Проверьте учетные данные.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(email, password);
      setMode("profile");
    } catch (err) {
      setError("Ошибка регистрации. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await completeProfile({
        email,
        fullName,
        residentialComplex,
        street,
        house,
        entrance,
      });
      setLocation("/feed");
    } catch (err) {
      setError("Ошибка сохранения профиля. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Hero Section */}
        <div className="hidden md:flex flex-col justify-center space-y-6 p-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-8 h-8 text-cyan-400" />
              <h1 className="text-4xl font-bold text-white">CityTech KZ</h1>
            </div>
            <p className="text-xl text-cyan-300">Городские проблемы</p>
            <p className="text-slate-300 text-lg leading-relaxed">
              Сообщайте о проблемах инфраструктуры в вашем районе с помощью ИИ-анализа фото и помогайте городу становиться лучше.
            </p>
            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">Локальные проблемы вашего ЖК</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">Городские проблемы по приоритетам</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">ИИ-анализ фото проблем</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">Интерактивная карта с кластерами</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <Card className="p-8 shadow-2xl border border-slate-700 bg-slate-900/80 backdrop-blur">
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Вход</h2>
                <p className="text-slate-400">Войдите в свой аккаунт</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-300">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-300">Пароль</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold" disabled={loading}>
                {loading ? "Загрузка..." : "Войти"}
              </Button>

              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Нет аккаунта?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Зарегистрируйтесь
                  </button>
                </p>
              </div>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Регистрация</h2>
                <p className="text-slate-400">Создайте новый аккаунт</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-300">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-300">Пароль</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold" disabled={loading}>
                {loading ? "Загрузка..." : "Зарегистрироваться"}
              </Button>

              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Уже есть аккаунт?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Войдите
                  </button>
                </p>
              </div>
            </form>
          )}

          {mode === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Завершить профиль</h2>
                <p className="text-slate-400">Укажите адрес вашего проживания</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-300">ФИО</label>
                <Input
                  type="text"
                  placeholder="Иван Иванов"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-300">ЖК / Жилой комплекс</label>
                <Input
                  type="text"
                  placeholder="ЖК Абай Парк"
                  value={residentialComplex}
                  onChange={(e) => setResidentialComplex(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-300">Улица</label>
                  <Input
                    type="text"
                    placeholder="ул. Абая"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-300">Дом</label>
                  <Input
                    type="text"
                    placeholder="45"
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-300">Подъезд</label>
                <Input
                  type="text"
                  placeholder="А"
                  value={entrance}
                  onChange={(e) => setEntrance(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold" disabled={loading}>
                {loading ? "Загрузка..." : (
                  <span className="flex items-center justify-center gap-2">
                    Продолжить <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
