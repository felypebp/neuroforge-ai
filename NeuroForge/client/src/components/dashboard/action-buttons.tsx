import { Button } from "@/components/ui/button";
import { 
  Video, 
  FileText, 
  Calendar, 
  Lightbulb, 
  TrendingUp,
  Instagram,
  Youtube
} from "lucide-react";

interface ActionButtonsProps {
  onActionSelect: (prompt: string, type: string) => void;
}

const actions = [
  {
    id: 'vsl',
    title: 'Criar VSL Profissional',
    description: 'Vídeos de vendas que convertem',
    icon: Video,
    prompt: 'Criar um VSL profissional para venda de produtos digitais',
    gradient: 'from-primary to-secondary',
    hoverColor: 'hover:bg-primary/20'
  },
  {
    id: 'tiktok',
    title: 'Vídeo para TikTok',
    description: 'Conteúdo viral otimizado',
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z"/>
      </svg>
    ),
    prompt: 'Gerar vídeo viral para TikTok sobre tendências atuais',
    gradient: 'from-secondary to-accent',
    hoverColor: 'hover:bg-secondary/20'
  },
  {
    id: 'roteiro',
    title: 'Roteiro Viral',
    description: 'Scripts que engajam',
    icon: FileText,
    prompt: 'Escrever roteiro viral para engajamento máximo',
    gradient: 'from-accent to-primary',
    hoverColor: 'hover:bg-accent/20'
  },
  {
    id: 'planejamento',
    title: 'Planejamento Semanal',
    description: 'Cronograma de conteúdo',
    icon: Calendar,
    prompt: 'Criar planejamento semanal de conteúdo',
    gradient: 'from-warning to-secondary',
    hoverColor: 'hover:bg-warning/20'
  },
  {
    id: 'produto',
    title: 'Ideia de Produto',
    description: 'Conceitos validados',
    icon: Lightbulb,
    prompt: 'Desenvolver ideia de produto digital validado',
    gradient: 'from-success to-accent',
    hoverColor: 'hover:bg-success/20'
  },
  {
    id: 'analise',
    title: 'Análise de Tendências',
    description: 'Insights do mercado',
    icon: TrendingUp,
    prompt: 'Analisar tendências atuais do mercado',
    gradient: 'from-error to-primary',
    hoverColor: 'hover:bg-error/20'
  },
  {
    id: 'reels',
    title: 'Instagram Reels',
    description: 'Conteúdo para Reels',
    icon: Instagram,
    prompt: 'Criar conteúdo para Instagram Reels',
    gradient: 'from-primary to-accent',
    hoverColor: 'hover:bg-primary/20'
  },
  {
    id: 'shorts',
    title: 'YouTube Shorts',
    description: 'Vídeos curtos otimizados',
    icon: Youtube,
    prompt: 'Gerar vídeo para YouTube Shorts',
    gradient: 'from-secondary to-warning',
    hoverColor: 'hover:bg-secondary/20'
  }
];

export default function ActionButtons({ onActionSelect }: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.id}
            variant="ghost"
            className={`glass-dark rounded-2xl p-6 h-auto flex flex-col items-center text-center hover:scale-105 ${action.hoverColor} transition-all duration-300 group`}
            onClick={() => onActionSelect(action.prompt, action.id)}
          >
            <div className={`w-16 h-16 mb-4 bg-gradient-to-r ${action.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="text-white" size={24} />
            </div>
            <h3 className="text-white font-semibold mb-2">{action.title}</h3>
            <p className="text-gray-400 text-sm">{action.description}</p>
          </Button>
        );
      })}
    </div>
  );
}
