import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { type Project } from "@shared/schema";
import { 
  X, 
  Search, 
  Play, 
  Download, 
  Video,
  FileText,
  Calendar,
  Lightbulb,
  TrendingUp,
  Instagram,
  Youtube
} from "lucide-react";

interface HistorySidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const getProjectIcon = (type: string) => {
  const icons = {
    vsl: Video,
    tiktok: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z"/>
      </svg>
    ),
    roteiro: FileText,
    planejamento: Calendar,
    produto: Lightbulb,
    analise: TrendingUp,
    reels: Instagram,
    shorts: Youtube
  };
  
  return icons[type as keyof typeof icons] || FileText;
};

const getStatusBadge = (status: string) => {
  const variants = {
    completed: { variant: "default" as const, color: "bg-success/20 text-success", label: "Concluído" },
    processing: { variant: "secondary" as const, color: "bg-warning/20 text-warning", label: "Processando" },
    failed: { variant: "destructive" as const, color: "bg-error/20 text-error", label: "Erro" }
  };
  
  return variants[status as keyof typeof variants] || variants.processing;
};

export default function HistorySidebar({ open, onOpenChange, userId }: HistorySidebarProps) {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: [`/api/projetos/${userId}`],
    enabled: open && !!userId,
  });

  // Mock data for demonstration
  const mockProjects: Project[] = [
    {
      id: '1',
      userId: userId,
      type: 'tiktok',
      prompt: 'Vídeo para TikTok sobre receitas saudáveis',
      status: 'completed',
      createdAt: new Date(),
      linkVideo: 'sample.mp4',
      linkRoteiro: null,
      linkAudio: null,
      metadata: null
    },
    {
      id: '2',
      userId: userId,
      type: 'vsl',
      prompt: 'VSL para curso de fitness',
      status: 'processing',
      createdAt: new Date(Date.now() - 86400000),
      linkVideo: null,
      linkRoteiro: null,
      linkAudio: null,
      metadata: null
    },
    {
      id: '3',
      userId: userId,
      type: 'reels',
      prompt: 'Reels motivacionais para Instagram',
      status: 'completed',
      createdAt: new Date(Date.now() - 172800000),
      linkVideo: 'sample2.mp4',
      linkRoteiro: null,
      linkAudio: null,
      metadata: null
    }
  ];

  const displayProjects = projects.length > 0 ? projects : mockProjects;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="glass-dark border-white/10 bg-black/20 backdrop-blur-lg w-96 overflow-y-auto"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold text-white">
            Histórico de Projetos
          </SheetTitle>
        </SheetHeader>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <Input
              placeholder="Buscar projetos..."
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 pl-10 focus:border-primary"
            />
          </div>
        </div>

        {/* Project List */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">
              Carregando projetos...
            </div>
          ) : displayProjects.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <FileText className="mx-auto mb-4" size={48} />
              <p>Nenhum projeto encontrado</p>
              <p className="text-sm">Crie seu primeiro projeto no dashboard</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayProjects.map((project: Project) => {
                const Icon = getProjectIcon(project.type);
                const statusInfo = getStatusBadge(project.status);
                
                return (
                  <div 
                    key={project.id}
                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="text-secondary" size={16} />
                        <span className="text-white font-medium line-clamp-1">
                          {project.prompt.length > 30 
                            ? `${project.prompt.substring(0, 30)}...` 
                            : project.prompt
                          }
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                      {project.prompt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={statusInfo.variant}
                        className={`text-xs ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </Badge>
                      
                      <div className="flex space-x-2">
                        {project.status === 'completed' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-gray-400 hover:text-white p-1"
                            >
                              <Play size={14} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-gray-400 hover:text-white p-1"
                            >
                              <Download size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
