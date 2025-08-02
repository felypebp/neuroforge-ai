import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { login, register } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data.user);
      onOpenChange(false);
      setLocation("/dashboard");
      toast({ title: "Login realizado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      register(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data.user);
      onOpenChange(false);
      setLocation("/dashboard");
      toast({ title: "Conta criada com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Erro ao criar conta",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha",
        variant: "destructive",
      });
      return;
    }

    if (isRegister) {
      registerMutation.mutate({ email, password });
    } else {
      loginMutation.mutate({ email, password });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/20 bg-black/20 backdrop-blur-lg">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
            <Brain className="text-white" size={24} />
          </div>
          <DialogTitle className="text-2xl font-bold text-white mb-2">
            {isRegister ? "Criar Conta" : "Bem-vindo ao NeuroForge"}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {isRegister 
              ? "Crie sua conta para começar a criar conteúdo viral" 
              : "Entre para começar a criar conteúdo viral"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-300">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-primary"
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-300">Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-primary"
              placeholder="••••••••"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105 transition-all duration-300"
            disabled={loginMutation.isPending || registerMutation.isPending}
          >
            {loginMutation.isPending || registerMutation.isPending 
              ? "Processando..." 
              : isRegister ? "Criar Conta" : "Entrar"
            }
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-400">
            {isRegister ? "Já tem conta?" : "Não tem conta?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary hover:text-secondary transition-colors"
            >
              {isRegister ? "Faça login" : "Cadastre-se grátis"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
