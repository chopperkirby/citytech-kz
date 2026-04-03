import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useIssues } from "@/contexts/IssuesContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssueCard from "@/components/IssueCard";
import IssueDetails from "@/components/IssueDetails";
import CityTechMap from "@/components/CityTechMap";
import SubmitIssueModal from "@/components/SubmitIssueModal";
import { LogOut, Plus, MapPin, Zap, Filter } from "lucide-react";
import type { Issue } from "@/contexts/IssuesContext";

export default function Feed() {
  const { user, logout } = useAuth();
  const { issues, getHyperLocalIssues, getCityWideIssues, toggleSupport, updateIssueStatus, updateIssueScoring, completeIssue } = useIssues();
  const [, setLocation] = useLocation();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<Issue[] | null>(null);
  const [activeTab, setActiveTab] = useState("active");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "pending_approval" | "in_progress" | "completed">("all");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  if (!user) {
    setLocation("/auth");
    return null;
  }

  const hyperLocalIssues = getHyperLocalIssues(user.residentialComplex, user.street);
  const cityWideIssues = getCityWideIssues();
  
  const activeIssues = issues.filter(i => i.status !== "completed");
  const resolvedIssues = issues.filter(i => i.status === "completed");
  
  const filteredIssues = statusFilter === "all" 
    ? activeIssues 
    : activeIssues.filter(i => i.status === statusFilter);

  const handleLogout = () => {
    logout();
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Futuristic background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">CityTech KZ</h1>
              <p className="text-xs text-cyan-400">Городские проблемы</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user.fullName}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {user.residentialComplex}
              </p>
            </div>

            <Button onClick={() => handleLogout()} variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <LogOut className="w-4 h-4 mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Action Hub - Massive Submit Button */}
        <div className="mb-8 flex justify-center">
          <Button
            onClick={() => setShowSubmitModal(true)}
            className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 border border-cyan-400/50"
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
              <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
                <TabsTrigger value="active" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  Активные
                </TabsTrigger>
                <TabsTrigger value="resolved" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  Решённые
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4 mt-4">
                {/* Status Filter */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={statusFilter === "all" ? "default" : "outline"}
                    onClick={() => setStatusFilter("all")}
                    className={statusFilter === "all" ? "bg-cyan-600 hover:bg-cyan-700" : "border-slate-600 text-slate-300 hover:bg-slate-800"}
                  >
                    Все
                  </Button>
                  <Button
                    size="sm"
                    variant={statusFilter === "new" ? "default" : "outline"}
                    onClick={() => setStatusFilter("new")}
                    className={statusFilter === "new" ? "bg-cyan-600 hover:bg-cyan-700" : "border-slate-600 text-slate-300 hover:bg-slate-800"}
                  >
                    Новые
                  </Button>
                  <Button
                    size="sm"
                    variant={statusFilter === "pending_approval" ? "default" : "outline"}
                    onClick={() => setStatusFilter("pending_approval")}
                    className={statusFilter === "pending_approval" ? "bg-cyan-600 hover:bg-cyan-700" : "border-slate-600 text-slate-300 hover:bg-slate-800"}
                  >
                    На утверждении
                  </Button>
                  <Button
                    size="sm"
                    variant={statusFilter === "in_progress" ? "default" : "outline"}
                    onClick={() => setStatusFilter("in_progress")}
                    className={statusFilter === "in_progress" ? "bg-cyan-600 hover:bg-cyan-700" : "border-slate-600 text-slate-300 hover:bg-slate-800"}
                  >
                    На выполнении
                  </Button>
                </div>

                {filteredIssues.length === 0 ? (
                  <Card className="p-8 text-center bg-slate-800/50 border-slate-700">
                    <p className="text-slate-400">Нет активных проблем</p>
                  </Card>
                ) : (
                  filteredIssues.map((issue) => (
                    <div
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className="cursor-pointer"
                    >
                      <IssueCard
                        issue={issue}
                        onSupport={toggleSupport}
                      />
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="resolved" className="space-y-4 mt-4">
                {resolvedIssues.length === 0 ? (
                  <Card className="p-8 text-center bg-slate-800/50 border-slate-700">
                    <p className="text-slate-400">Нет решённых проблем</p>
                  </Card>
                ) : (
                  resolvedIssues.map((issue) => (
                    <div
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className="cursor-pointer"
                    >
                      <IssueCard
                        issue={issue}
                        onSupport={toggleSupport}
                      />
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Map */}
          <div className="lg:col-span-2 h-96 lg:h-auto lg:min-h-screen sticky top-20">
            <Card className="w-full h-full overflow-hidden shadow-2xl border-slate-700">
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

      {/* Issue Details Modal */}
      {selectedIssue && (
        <IssueDetails
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onUpdateStatus={(status, note) => {
            updateIssueStatus(selectedIssue.id, status, note);
            setSelectedIssue(null);
          }}
          onRateCompletion={(rating, notes) => {
            completeIssue(selectedIssue.id, rating, notes);
            setSelectedIssue(null);
          }}
        />
      )}
    </div>
  );
}
