import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useIssues } from "@/contexts/IssuesContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssueCard from "@/components/IssueCard";
import CityTechMap from "@/components/CityTechMap";
import SubmitIssueModal from "@/components/SubmitIssueModal";
import { LogOut, Plus, MapPin } from "lucide-react";
import type { Issue } from "@/contexts/IssuesContext";

export default function Feed() {
  const { user, logout } = useAuth();
  const { getHyperLocalIssues, getCityWideIssues, toggleSupport } = useIssues();
  const [, setLocation] = useLocation();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<Issue[] | null>(null);
  const [activeTab, setActiveTab] = useState("local");

  if (!user) {
    setLocation("/auth");
    return null;
  }

  const hyperLocalIssues = getHyperLocalIssues(user.residentialComplex, user.street);
  const cityWideIssues = getCityWideIssues();

  const handleLogout = () => {
    logout();
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">CityTech KZ</h1>
            <p className="text-sm text-slate-600">Городские проблемы</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {user.residentialComplex}
              </p>
            </div>

            <Button onClick={() => handleLogout()} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Action Hub - Massive Submit Button */}
        <div className="mb-8 flex justify-center">
          <Button
            onClick={() => setShowSubmitModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 animate-pulse"
          >
            <Plus className="w-6 h-6 mr-3" />
            Подать заявку
          </Button>
        </div>

        {/* Two-Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Feed Tabs */}
          <div className="lg:col-span-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="local">Мой ЖК</TabsTrigger>
                <TabsTrigger value="city">Город</TabsTrigger>
              </TabsList>

              <TabsContent value="local" className="space-y-4 mt-4">
                {hyperLocalIssues.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-slate-600">Нет проблем в вашем ЖК</p>
                  </Card>
                ) : (
                  hyperLocalIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onSupport={toggleSupport}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="city" className="space-y-4 mt-4">
                {cityWideIssues.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-slate-600">Нет проблем в городе</p>
                  </Card>
                ) : (
                  cityWideIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onSupport={toggleSupport}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Map */}
          <div className="lg:col-span-2 h-96 lg:h-auto lg:min-h-screen sticky top-20">
            <Card className="w-full h-full overflow-hidden shadow-lg">
              <CityTechMap
                issues={cityWideIssues}
                onClusterClick={setSelectedCluster}
                selectedCluster={selectedCluster}
                onClusterClose={() => setSelectedCluster(null)}
              />
            </Card>
          </div>
        </div>
      </main>

      {/* Submit Issue Modal */}
      {showSubmitModal && (
        <SubmitIssueModal
          onClose={() => setShowSubmitModal(false)}
          userLocation={{
            residentialComplex: user.residentialComplex,
            street: user.street,
            house: user.house,
            entrance: user.entrance,
          }}
        />
      )}
    </div>
  );
}
