import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowRight, Zap, Loader2 } from "lucide-react";

type AuthMode = "login" | "signup" | "profile";

export default function Auth() {
  const { login, signup, completeProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
    if (!firstName.trim() || !lastName.trim()) {
      setError("Пожалуйста, заполните имя и фамилию.");
      return;
    }
    setLoading(true);
    try {
      await completeProfile({
        email,
        firstName,
        lastName,
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

      {/* Main Card */}
      <Card className="w-full max-w-md relative z-10 bg-slate-900/80 backdrop-blur border-slate-700 shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">CityTech KZ</h1>
              <p className="text-xs text-cyan-400">Городские проблемы</p>
            </div>
          </div>

          {/* Login Form */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-6">Вход</h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Пароль</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg flex gap-2 text-red-300 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 h-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    Войти
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-slate-400">или</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Зарегистрироваться
              </Button>
            </form>
          )}

          {/* Signup Form */}
          {mode === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-6">Регистрация</h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Пароль</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg flex gap-2 text-red-300 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 h-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    Зарегистрироваться
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Уже есть аккаунт? Войти
              </Button>
            </form>
          )}

          {/* Profile Completion Form */}
          {mode === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-6">Завершить профиль</h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Имя</label>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Иван"
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Фамилия</label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Петров"
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                  required
                />
              </div>

              <div className="p-3 bg-cyan-900/20 border border-cyan-700 rounded-lg text-cyan-300 text-sm">
                <p>Локацию вы сможете выбрать при подаче заявки</p>
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg flex gap-2 text-red-300 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 h-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    Продолжить
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
