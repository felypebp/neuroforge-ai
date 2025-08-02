import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";

interface SearchSectionProps {
  onGenerate: (prompt: string, type: string) => void;
}

export default function SearchSection({ onGenerate }: SearchSectionProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt, 'custom');
    }
  };

  return (
    <div className="glass rounded-3xl p-8 mb-12 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <Search className="text-gray-400" size={20} />
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva o conteúdo que você quer criar... Ex: 'Vídeo para TikTok sobre receitas saudáveis'"
            className="flex-1 bg-transparent border-0 text-white placeholder-gray-400 focus:ring-0 text-lg"
          />
          <Button 
            type="submit"
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105 transition-all duration-300 px-8"
            disabled={!prompt.trim()}
          >
            <Sparkles className="mr-2" size={16} />
            Gerar
          </Button>
        </div>
      </form>
    </div>
  );
}
