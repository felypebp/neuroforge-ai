import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";
import LoginModal from "@/components/auth/login-modal";
import AnimatedBackground from "@/components/ui/animated-background";
import { Button } from "@/components/ui/button";
import { Brain, History, User } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const handleGetStarted = () => {
    if (user) {
      setLocation("/dashboard");
    } else {
      setShowLogin(true);
    }
  };

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
            {user && (
              <Button 
                variant="ghost" 
                className="glass text-white hover:bg-white/20"
                onClick={() => setLocation("/dashboard")}
              >
                <History className="mr-2" size={16} />
                Dashboard
              </Button>
            )}
            <Button 
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105 transition-all duration-300"
              onClick={handleGetStarted}
            >
              <User className="mr-2" size={16} />
              {user ? 'Dashboard' : 'Entrar'}
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
          <Button 
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            onClick={handleGetStarted}
          >
            Começar Agora - É Grátis
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="glass rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
              <Brain className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">IA Avançada</h3>
            <p className="text-gray-300">Pipeline completo com Gemini, Claude, MiniMax e Whisper para resultados profissionais</p>
          </div>

          <div className="glass rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-secondary to-accent rounded-2xl flex items-center justify-center">
              <svg className="text-white" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Velocidade</h3>
            <p className="text-gray-300">Gere conteúdo em minutos, não em horas. Automatize todo seu processo criativo</p>
          </div>

          <div className="glass rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center">
              <svg className="text-white" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Qualidade Premium</h3>
            <p className="text-gray-300">Conteúdo otimizado para engajamento e conversão em todas as plataformas</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center glass rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Pronto para Revolucionar seu Conteúdo?
          </h3>
          <p className="text-gray-300 mb-8 text-lg">
            Junte-se a milhares de criadores que já transformaram suas ideias em sucesso viral
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary text-white px-12 py-4 rounded-xl text-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            onClick={handleGetStarted}
          >
            Começar Gratuitamente
          </Button>
        </div>
      </main>

      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}
