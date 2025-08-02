import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { getCurrentUser } from "@/lib/auth";
import AnimatedBackground from "@/components/ui/animated-background";
import SearchSection from "@/components/dashboard/search-section";
import ActionButtons from "@/components/dashboard/action-buttons";
import VideoCreationSection from "@/components/dashboard/video-creation-section";
import ProcessingModal from "@/components/dashboard/processing-modal";
import ResultsModal from "@/components/dashboard/results-modal";
import HistorySidebar from "@/components/dashboard/history-sidebar";
import { Button } from "@/components/ui/button";
import { Brain, History, LogOut } from "lucide-react";
import { logout } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showHistory, setShowHistory] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/");
      toast({ title: "Logout realizado com sucesso" });
    } catch (error) {
      toast({ 
        title: "Erro ao fazer logout", 
        variant: "destructive" 
      });
    }
  };

  const handleStartProcessing = (prompt: string, type: string, options?: any) => {
    setCurrentProject({ prompt, type, options });
    setShowProcessing(true);
  };

  const handleProcessingComplete = (result: any) => {
    setShowProcessing(false);
    setCurrentProject(result);
    setShowResults(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-50 p-6">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <Brain className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white">NeuroForge</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Olá, {user.email}</span>
            <Button 
              variant="ghost" 
              className="glass text-white hover:bg-white/20"
              onClick={() => setShowHistory(true)}
            >
              <History className="mr-2" size={16} />
              Histórico
            </Button>
            <Button 
              variant="ghost" 
              className="glass text-white hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut className="mr-2" size={16} />
              Sair
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Crie Conteúdo Viral
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transforme suas ideias em vídeos profissionais para TikTok e campanhas virais usando o poder da Inteligência Artificial
          </p>
        </div>

        {/* Search Section */}
        <SearchSection onGenerate={handleStartProcessing} />

        {/* Action Buttons */}
        <ActionButtons onActionSelect={handleStartProcessing} />

        {/* Video Creation Section */}
        <VideoCreationSection onGenerate={handleStartProcessing} />

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
              <Brain className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">IA Avançada</h3>
            <p className="text-gray-300">Pipeline completo com Gemini, Claude, MiniMax e Whisper para resultados profissionais</p>
          </div>

          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-secondary to-accent rounded-2xl flex items-center justify-center">
              <svg className="text-white" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Velocidade</h3>
            <p className="text-gray-300">Gere conteúdo em minutos, não em horas. Automatize todo seu processo criativo</p>
          </div>

          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center">
              <svg className="text-white" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Qualidade Premium</h3>
            <p className="text-gray-300">Conteúdo otimizado para engajamento e conversão em todas as plataformas</p>
          </div>
        </div>
      </main>

      {/* Modals and Sidebars */}
      <ProcessingModal 
        open={showProcessing} 
        onOpenChange={setShowProcessing}
        onComplete={handleProcessingComplete}
        project={currentProject}
      />
      
      <ResultsModal 
        open={showResults} 
        onOpenChange={setShowResults}
        project={currentProject}
      />
      
      <HistorySidebar 
        open={showHistory} 
        onOpenChange={setShowHistory}
        userId={user.id}
      />
    </div>
  );
}
