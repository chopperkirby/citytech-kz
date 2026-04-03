import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div
          className="hidden md:flex flex-col justify-center space-y-6 p-8 rounded-2xl bg-cover bg-center relative"
          style={{
            backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663510398645/RcL2uaxr2YMDoKcHpd2a2s/citytech-hero-auth-L4sWSSE6A8gcSirUszRDqe.webp')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent rounded-2xl"></div>
          <div className="relative z-10 space-y-4">
            <h1 className="text-4xl font-bold text-white">CityTech KZ</h1>
            <p className="text-xl text-blue-50">Городские проблемы</p>
            <p className="text-blue-100 text-lg leading-relaxed">
              Сообщайте о проблемах инфраструктуры в вашем районе и помогайте городу становиться лучше.
            </p>
            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full mt-2"></div>
                <p className="text-blue-100">Локальные проблемы вашего ЖК</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full mt-2"></div>
                <p className="text-blue-100">Городские проблемы по приоритетам</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full mt-2"></div>
                <p className="text-blue-100">Интерактивная карта с кластерами</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <Card className="p-8 shadow-lg border-0">
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Вход</h2>
                <p className="text-slate-600">Войдите в свой аккаунт</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Пароль</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Загрузка..." : "Войти"}
              </Button>

              <div className="text-center">
                <p className="text-slate-600 text-sm">
                  Нет аккаунта?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
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
                <h2 className="text-3xl font-bold text-slate-900">Регистрация</h2>
                <p className="text-slate-600">Создайте новый аккаунт</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Пароль</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Загрузка..." : "Зарегистрироваться"}
              </Button>

              <div className="text-center">
                <p className="text-slate-600 text-sm">
                  Уже есть аккаунт?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
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
                <h2 className="text-3xl font-bold text-slate-900">Завершить профиль</h2>
                <p className="text-slate-600">Укажите адрес вашего проживания</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">ФИО</label>
                <Input
                  type="text"
                  placeholder="Иван Иванов"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">ЖК / Жилой комплекс</label>
                <Input
                  type="text"
                  placeholder="ЖК Абай Парк"
                  value={residentialComplex}
                  onChange={(e) => setResidentialComplex(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Улица</label>
                  <Input
                    type="text"
                    placeholder="ул. Абая"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Дом</label>
                  <Input
                    type="text"
                    placeholder="45"
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Подъезд</label>
                <Input
                  type="text"
                  placeholder="А"
                  value={entrance}
                  onChange={(e) => setEntrance(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
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
