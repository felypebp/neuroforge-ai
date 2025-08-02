import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiPipeline } from "./services/ai-pipeline";
import { insertUserSchema, insertProjectSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'neuroforge-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
  }));

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password } = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({ email, password: hashedPassword });
      
      // Set session
      (req.session as any).userId = user.id;
      
      res.json({ user: { id: user.id, email: user.email } });
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = insertUserSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      // Set session
      (req.session as any).userId = user.id;
      
      res.json({ user: { id: user.id, email: user.email } });
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    res.json({ user: { id: user.id, email: user.email } });
  });

  // Project routes
  app.post("/api/processar", async (req, res) => {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    try {
      const { prompt, type } = req.body;
      
      if (!prompt || !type) {
        return res.status(400).json({ message: "Prompt e tipo são obrigatórios" });
      }

      // Create project
      const project = await storage.createProject({
        userId,
        prompt,
        type
      });

      // Start AI processing (async)
      processProjectAsync(project.id, prompt, type);

      res.json({ 
        projectId: project.id,
        status: 'processing',
        message: 'Processamento iniciado'
      });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.get("/api/status/:id", async (req, res) => {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const project = await storage.getProject(req.params.id);
    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }

    res.json(project);
  });

  app.get("/api/projetos/:user_id", async (req, res) => {
    const userId = (req.session as any)?.userId;
    if (!userId || userId !== req.params.user_id) {
      return res.status(401).json({ message: "Não autorizado" });
    }

    const projects = await storage.getProjectsByUserId(userId);
    res.json(projects);
  });

  // Background processing function
  async function processProjectAsync(projectId: string, prompt: string, type: string) {
    try {
      const result = await aiPipeline.processContent(prompt, type);
      
      await storage.updateProject(projectId, {
        status: 'completed',
        linkVideo: result.videoUrl,
        linkRoteiro: result.script,
        linkAudio: result.audioUrl,
        metadata: {
          analysis: result.analysis,
          processedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      await storage.updateProject(projectId, {
        status: 'failed',
        metadata: {
          error: error instanceof Error ? error.message : 'Erro desconhecido',
          failedAt: new Date().toISOString()
        }
      });
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
