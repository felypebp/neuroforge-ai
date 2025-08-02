import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Sparkles, 
  Instagram, 
  DollarSign,
  Youtube,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";

interface VideoCreationSectionProps {
  onGenerate: (prompt: string, type: string, options?: any) => void;
}

const videoTypes = {
  tiktok: {
    title: "TikTok Viral",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z"/>
      </svg>
    ),
    description: "Vídeos curtos e envolventes para TikTok",
    gradient: "from-pink-500 to-purple-600",
    options: ["15s", "30s", "60s"],
    features: ["Hook nos primeiros 3s", "Formato vertical 9:16", "Trending sounds", "Hashtags virais"]
  },
  reels: {
    title: "Instagram Reels",
    icon: Instagram,
    description: "Conteúdo profissional para Instagram",
    gradient: "from-purple-500 to-pink-500",
    options: ["15s", "30s", "60s", "90s"],
    features: ["Stories integration", "Shopping tags", "Music sync", "Brand awareness"]
  },
  vsl: {
    title: "VSL Profissional",
    icon: Video,
    description: "Vídeos de vendas que convertem",
    gradient: "from-blue-500 to-cyan-500",
    options: ["2min", "5min", "10min", "15min"],
    features: ["Estrutura PAS", "CTAs estratégicos", "Prova social", "Gatilhos mentais"]
  },
  ads: {
    title: "Anúncios Pagos",
    icon: DollarSign,
    description: "Ads otimizados para conversão",
    gradient: "from-green-500 to-blue-500",
    options: ["15s", "30s", "60s"],
    features: ["Alta conversão", "A/B test ready", "Multi-platform", "ROI otimizado"]
  }
};

export default function VideoCreationSection({ onGenerate }: VideoCreationSectionProps) {
  const [selectedType, setSelectedType] = useState<keyof typeof videoTypes>("tiktok");
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    const options = {
      duration,
      targetAudience,
      tone,
      features: videoTypes[selectedType].features
    };

    onGenerate(prompt, selectedType, options);
  };

  const currentType = videoTypes[selectedType];

  return (
    <div className="glass rounded-3xl p-8 mb-12 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
          <Video className="mr-3 text-primary" size={32} />
          Central de Criação de Vídeos
        </h3>
        <p className="text-gray-300 text-lg">
          Crie vídeos profissionais com IA para qualquer plataforma
        </p>
      </div>

      <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as keyof typeof videoTypes)}>
        <TabsList className="grid w-full grid-cols-4 glass-dark mb-8">
          {Object.entries(videoTypes).map(([key, type]) => {
            const Icon = type.icon;
            return (
              <TabsTrigger 
                key={key} 
                value={key}
                className="flex items-center space-x-2 data-[state=active]:bg-primary/20"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{type.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(videoTypes).map(([key, type]) => (
          <TabsContent key={key} value={key}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Configuration */}
              <div className="space-y-6">
                <Card className="glass-dark border-white/10">
                  <CardHeader>
                    <CardTitle className={`text-white flex items-center bg-gradient-to-r ${type.gradient} bg-clip-text text-transparent`}>
                      <type.icon className="mr-2 text-white" size={24} />
                      {type.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {type.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Descrição do Conteúdo
                      </label>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={`Ex: Vídeo sobre dicas de produtividade para ${type.title.toLowerCase()}...`}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-primary min-h-[100px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Duração
                        </label>
                        <Select value={duration} onValueChange={setDuration}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Escolher duração" />
                          </SelectTrigger>
                          <SelectContent>
                            {type.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Tom
                        </label>
                        <Select value={tone} onValueChange={setTone}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Escolher tom" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="profissional">Profissional</SelectItem>
                            <SelectItem value="divertido">Divertido</SelectItem>
                            <SelectItem value="motivacional">Motivacional</SelectItem>
                            <SelectItem value="educativo">Educativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Público-Alvo
                      </label>
                      <Input
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="Ex: Jovens adultos, 18-35 anos, interessados em tecnologia"
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-primary"
                      />
                    </div>

                    <Button 
                      onClick={handleGenerate}
                      className={`w-full bg-gradient-to-r ${type.gradient} hover:shadow-lg hover:scale-105 transition-all duration-300 text-white font-semibold py-3`}
                      disabled={!prompt.trim()}
                    >
                      <Sparkles className="mr-2" size={16} />
                      Gerar {type.title}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Features & Preview */}
              <div className="space-y-6">
                <Card className="glass-dark border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Target className="mr-2 text-accent" size={20} />
                      Características do {type.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {type.features.map((feature, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="bg-white/10 text-gray-300 justify-center py-2"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-dark border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="mr-2 text-success" size={20} />
                      Dicas para Viralizar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-gray-300">
                      {key === 'tiktok' && (
                        <>
                          <div className="flex items-center">
                            <Zap className="mr-2 text-yellow-400" size={16} />
                            Use trends e sons populares
                          </div>
                          <div className="flex items-center">
                            <Zap className="mr-2 text-yellow-400" size={16} />
                            Hook visual nos primeiros 3 segundos
                          </div>
                          <div className="flex items-center">
                            <Zap className="mr-2 text-yellow-400" size={16} />
                            Inclua texto na tela e captions
                          </div>
                        </>
                      )}
                      {key === 'reels' && (
                        <>
                          <div className="flex items-center">
                            <Zap className="mr-2 text-purple-400" size={16} />
                            Use hashtags estratégicas
                          </div>
                          <div className="flex items-center">
                            <Zap className="mr-2 text-purple-400" size={16} />
                            Poste no horário de pico
                          </div>
                          <div className="flex items-center">
                            <Zap className="mr-2 text-purple-400" size={16} />
                            Mantenha consistência visual
                          </div>
                        </>
                      )}
                      {key === 'vsl' && (
                        <>
                          <div className="flex items-center">
                            <Zap className="mr-2 text-blue-400" size={16} />
                            Estrutura: Problema → Solução → Prova
                          </div>
                          <div className="flex items-center">
                            <Zap className="mr-2 text-blue-400" size={16} />
                            Use gatilhos de escassez
                          </div>
                          <div className="flex items-center">
                            <Zap className="mr-2 text-blue-400" size={16} />
                            CTA claro e direto
                          </div>
                        </>
                      )}
                      {key === 'ads' && (
                        <>
                          <div className="flex items-center">
                            <Zap className="mr-2 text-green-400" size={16} />
                            Teste diferentes formatos
                          </div>
                          <div className="flex items-center">
                            <Zap className="mr-2 text-green-400" size={16} />
                            Foque no ROI e conversão
                          </div>
                          <div className="flex items-center">
                            <Zap className="mr-2 text-green-400" size={16} />
                            Use prova social e depoimentos
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}