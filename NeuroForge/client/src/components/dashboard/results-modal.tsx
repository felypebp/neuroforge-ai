import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Video, FileText, Download, Share, Copy, Edit, X, Play } from "lucide-react";

interface ResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
}

export default function ResultsModal({ open, onOpenChange, project }: ResultsModalProps) {
  const { toast } = useToast();
  const [script, setScript] = useState(project?.script || '');

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(script);
      toast({ title: "Roteiro copiado para a área de transferência!" });
    } catch (error) {
      toast({ 
        title: "Erro ao copiar", 
        description: "Não foi possível copiar o roteiro",
        variant: "destructive" 
      });
    }
  };

  const handleDownload = () => {
    toast({ title: "Download iniciado!" });
    // In a real app, this would trigger the actual download
  };

  const handleShare = () => {
    toast({ title: "Link de compartilhamento copiado!" });
    // In a real app, this would generate a shareable link
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/20 bg-black/20 backdrop-blur-lg max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl font-bold text-white">
              Seu Conteúdo Está Pronto!
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Veja o resultado do seu projeto e faça o download dos arquivos
            </DialogDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </Button>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Video Player */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Video className="mr-2 text-primary" size={20} />
              Vídeo Gerado
            </h3>
            
            <div className="bg-black rounded-xl overflow-hidden aspect-[9/16] max-w-xs mx-auto relative">
              <img 
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=711" 
                alt="Conteúdo gerado" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Button 
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30"
                  onClick={() => toast({ title: "Reproduzindo vídeo..." })}
                >
                  <Play className="text-white ml-1" size={24} />
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-2 justify-center">
              <Button 
                variant="ghost" 
                className="glass px-4 py-2 text-white hover:bg-white/20"
                onClick={handleDownload}
              >
                <Download className="mr-2" size={16} />
                Baixar
              </Button>
              <Button 
                variant="ghost" 
                className="glass px-4 py-2 text-white hover:bg-white/20"
                onClick={handleShare}
              >
                <Share className="mr-2" size={16} />
                Compartilhar
              </Button>
            </div>
          </div>

          {/* Script */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <FileText className="mr-2 text-secondary" size={20} />
              Roteiro Gerado
            </h3>
            
            <div className="bg-black/20 rounded-xl border border-white/10">
              <Textarea 
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full h-64 bg-transparent text-white resize-none border-0 font-mono text-sm focus:ring-0"
                placeholder="Roteiro será exibido aqui..."
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                className="glass px-4 py-2 text-white hover:bg-white/20"
                onClick={handleCopyScript}
              >
                <Copy className="mr-2" size={16} />
                Copiar
              </Button>
              <Button 
                variant="ghost" 
                className="glass px-4 py-2 text-white hover:bg-white/20"
              >
                <Edit className="mr-2" size={16} />
                Editar
              </Button>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="mt-8 p-4 bg-white/5 rounded-lg">
          <div className="flex justify-between items-center text-sm text-gray-300">
            <span>
              Projeto salvo em: {" "}
              <span className="text-white font-mono">
                {new Date().toLocaleString('pt-BR')}
              </span>
            </span>
            <span>
              Tipo: {" "}
              <span className="text-accent font-semibold capitalize">
                {project.type}
              </span>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
