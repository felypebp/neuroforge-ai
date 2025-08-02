import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Search, FileText, Video, Mic, Cloud, Check, Clock, X } from "lucide-react";

interface ProcessingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (result: any) => void;
  project: { prompt: string; type: string } | null;
}

const steps = [
  {
    id: 1,
    title: "Validando com Gemini",
    description: "Verificando viabilidade do conteúdo...",
    icon: Search,
    duration: 2000
  },
  {
    id: 2,
    title: "Gerando Roteiro com IA",
    description: "Criando script otimizado...",
    icon: FileText,
    duration: 3000
  },
  {
    id: 3,
    title: "Criando Imagem com EdenAI",
    description: "Gerando visual profissional...",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
    ),
    duration: 4000
  },
  {
    id: 4,
    title: "Gerando Áudio com OpenAI",
    description: "Criando narração profissional...",
    icon: Mic,
    duration: 3000
  },
  {
    id: 5,
    title: "Montando Vídeo com Creatomate",
    description: "Unindo imagem, áudio e texto...",
    icon: Video,
    duration: 8000
  },
  {
    id: 6,
    title: "Salvando no Cloudinary",
    description: "Armazenando arquivos finais...",
    icon: Cloud,
    duration: 2000
  }
];

export default function ProcessingModal({ 
  open, 
  onOpenChange, 
  onComplete, 
  project 
}: ProcessingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectId, setProjectId] = useState<string | null>(null);

  const processMutation = useMutation({
    mutationFn: async ({ prompt, type }: { prompt: string; type: string }) => {
      const response = await apiRequest("POST", "/api/processar", { prompt, type });
      return response.json();
    },
    onSuccess: (data) => {
      setProjectId(data.projectId);
      startProcessing();
    },
    onError: (error) => {
      console.error('Processing error:', error);
      onOpenChange(false);
      resetModal();
    }
  });

  const startProcessing = () => {
    let step = 0;
    
    const processStep = () => {
      if (step < steps.length) {
        setCurrentStep(step + 1);
        
        setTimeout(() => {
          step++;
          processStep();
        }, steps[step].duration);
      } else {
        // Processing complete
        setTimeout(() => {
          onComplete({
            script: getMockScript(project?.type || 'tiktok')
          });
          resetModal();
        }, 1000);
      }
    };

    processStep();
  };

  const resetModal = () => {
    setCurrentStep(0);
    setProjectId(null);
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetModal();
  };

  useEffect(() => {
    if (open && project && !processMutation.isPending && currentStep === 0) {
      processMutation.mutate(project);
    }
  }, [open, project]);

  const getMockScript = (type: string) => {
    const scripts = {
      tiktok: `🔥 3 SEGREDOS QUE MUDARAM TUDO! 🔥

[CENA 1 - Hook Visual]
❓ "Por que só 1% consegue sucesso?"

[CENA 2 - Problema]
😤 Todo mundo tenta, mas falha...
❌ Sem estratégia
❌ Sem consistência  
❌ Sem método

[CENA 3 - Solução]
✅ SEGREDO #1: Foco total
✅ SEGREDO #2: Ação diária
✅ SEGREDO #3: Persistência

[CENA 4 - CTA]
💬 "Qual segredo você vai aplicar HOJE?"
📱 "Comenta aí e me segue para mais!"

#Sucesso #Motivação #TikTokBrasil #Foco`,
      vsl: `🎯 REVELADO: O Método Que Mudou Tudo

[PROBLEMA]
Você já se sentiu perdido, sem saber por onde começar?
A maioria das pessoas passa anos tentando descobrir o "segredo"...

[AGITAÇÃO]  
Enquanto isso, outros já descobriram e estão à frente!
Cada dia que passa é uma oportunidade perdida...

[SOLUÇÃO]
Apresento o Sistema [NOME]:
✅ Método comprovado
✅ Passo a passo simples
✅ Resultados em 30 dias

[PROVA]
Mais de 10.000 pessoas já transformaram suas vidas!

[OFERTA]
Por apenas R$ 97 (valor normal R$ 497)
🚨 BÔNUS EXCLUSIVO: Mentoria ao vivo

[CTA]
👆 CLIQUE AGORA e garante sua vaga!`
    };

    return scripts[type as keyof typeof scripts] || scripts.tiktok;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/20 bg-black/20 backdrop-blur-lg max-w-2xl">
        <DialogHeader className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center animate-pulse">
            <Settings className="text-white animate-spin" size={32} />
          </div>
          <DialogTitle className="text-2xl font-bold text-white mb-2">Gerando Seu Conteúdo</DialogTitle>
          <DialogDescription className="text-gray-300">Nossas IAs estão trabalhando em seu projeto...</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isPending = currentStep < step.id;

            return (
              <div 
                key={step.id}
                className={`flex items-center space-x-4 p-4 rounded-lg bg-white/5 transition-all duration-300 ${
                  isActive ? 'bg-primary/10 border border-primary/20' : ''
                } ${isPending ? 'opacity-50' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted ? 'bg-success' : isActive ? 'bg-primary' : 'bg-gray-500'
                }`}>
                  {isCompleted ? (
                    <Check className="text-white" size={16} />
                  ) : (
                    <Icon className="text-white" size={16} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
                <div className="w-6 h-6">
                  {isCompleted ? (
                    <Check className="text-success" size={20} />
                  ) : isActive ? (
                    <Settings className="text-primary animate-spin" size={20} />
                  ) : (
                    <Clock className="text-gray-400" size={20} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white"
            onClick={handleCancel}
          >
            <X className="mr-2" size={16} />
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
