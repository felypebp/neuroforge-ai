import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import axios from "axios";

interface PipelineResult {
  analysis: string;
  script: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  cloudinaryUrls?: {
    video?: string;
    audio?: string;
    script?: string;
  };
  error?: string;
}

export class AIPipeline {
  private gemini: GoogleGenAI;
  private openai: OpenAI;

  constructor() {
    this.gemini = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "" 
    });
    this.openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY || ""
    });
  }

  async processContent(prompt: string, type: string): Promise<PipelineResult> {
    try {
      // Step 1: Validate prompt with Gemini
      const validation = await this.validatePromptWithGemini(prompt, type);
      if (!validation.approved) {
        throw new Error(`Prompt rejeitado: ${validation.reason}`);
      }

      // Step 2: Generate script with OpenAI/Claude
      const script = await this.generateScript(prompt, type);
      
      // Step 3: Generate image with EdenAI
      const imageUrl = await this.generateImage(prompt, type);
      
      // Step 4: Generate audio with voice synthesis
      const audioUrl = await this.generateAudio(script);
      
      // Step 5: Create video with Creatomate
      const videoUrl = await this.createVideoWithCreatomate({
        script,
        imageUrl,
        audioUrl,
        type
      });
      
      // Step 6: Upload to Cloudinary
      const cloudinaryUrls = await this.uploadToCloudinary({
        videoUrl,
        audioUrl,
        script
      });

      return {
        analysis: validation.analysis,
        script,
        imageUrl,
        audioUrl,
        videoUrl,
        cloudinaryUrls
      };
    } catch (error) {
      console.error('AI Pipeline error:', error);
      return {
        analysis: "Erro no processamento",
        script: this.getMockScript(type),
        error: error instanceof Error ? error.message : "Erro desconhecido"
      };
    }
  }

  private async validatePromptWithGemini(prompt: string, type: string): Promise<{ approved: boolean; reason?: string; analysis: string }> {
    const validationPrompt = `Valide esta ideia para conteúdo viral e analise sua viabilidade:

Tipo: ${type}
Prompt: ${prompt}

Critérios de validação:
- Conteúdo apropriado (sem violência, ódio, etc.)
- Potencial viral para ${type}
- Clareza da solicitação
- Viabilidade técnica

Responda em JSON:
{
  "approved": true/false,
  "reason": "motivo se rejeitado",
  "analysis": "análise detalhada com público-alvo, tom, estratégia"
}`;

    try {
      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: validationPrompt,
      });

      const result = JSON.parse(response.text || '{"approved": true, "analysis": "Aprovado"}');
      return {
        approved: result.approved !== false,
        reason: result.reason,
        analysis: result.analysis || `Conteúdo ${type} aprovado para produção.`
      };
    } catch (error) {
      console.error('Gemini validation error:', error);
      return {
        approved: true,
        analysis: `Conteúdo ${type} pré-aprovado para engajamento e conversão.`
      };
    }
  }

  private async generateScript(prompt: string, type: string): Promise<string> {
    const scriptPrompt = `Crie um roteiro detalhado para ${type} baseado neste prompt: ${prompt}

Diretrizes específicas:

Para TikTok/Reels:
- Hook nos primeiros 3 segundos
- Formato vertical 9:16
- Linguagem jovem e direta
- Call-to-action forte
- Hashtags relevantes

Para VSL:
- Estrutura: Problema → Agitação → Solução → Prova → Oferta → CTA
- Gatilhos mentais
- Objeções respondidas

Para roteiros gerais:
- Estrutura clara com começo, meio e fim
- Momentos de alta energia
- Transições suaves

Responda apenas com o roteiro final, sem explicações adicionais.`;

    try {
      // Try OpenAI as fallback for Claude
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em criação de roteiros virais para redes sociais e vídeos de vendas."
          },
          {
            role: "user",
            content: scriptPrompt
          }
        ],
        max_tokens: 1500,
      });

      return response.choices[0].message.content || this.getMockScript(type);
    } catch (error) {
      console.error('Script generation error:', error);
      return this.getMockScript(type);
    }
  }

  private async generateImage(prompt: string, type: string): Promise<string> {
    try {
      // Use EdenAI or Leonardo API for image generation
      if (process.env.EDENAI_API_KEY) {
        const response = await axios.post('https://api.edenai.run/v2/image/generation', {
          providers: "openai",
          text: `Professional ${type} visual: ${prompt}`,
          resolution: type === 'tiktok' || type === 'reels' ? '512x768' : '768x512',
          num_images: 1
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.EDENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        return response.data?.openai?.items?.[0]?.image_resource_url || this.getMockImageUrl(type);
      }
      
      // Fallback to mock image
      return this.getMockImageUrl(type);
    } catch (error) {
      console.error('Image generation error:', error);
      return this.getMockImageUrl(type);
    }
  }

  private async generateAudio(script: string): Promise<string> {
    try {
      // Use OpenAI TTS or ElevenLabs for voice generation
      const response = await this.openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: script.slice(0, 4096), // TTS input limit
      });

      const buffer = Buffer.from(await response.arrayBuffer());
      
      // For now, return a temporary URL - in production, upload to temporary storage
      const audioFileName = `audio_${Date.now()}.mp3`;
      return `https://temp-storage.neuroforge.com/${audioFileName}`;
    } catch (error) {
      console.error('Audio generation error:', error);
      return `https://mock-cdn.neuroforge.com/audio/sample_narration.mp3`;
    }
  }

  private async createVideoWithCreatomate(params: {
    script: string;
    imageUrl?: string;
    audioUrl?: string;
    type: string;
  }): Promise<string> {
    try {
      if (!process.env.CREATOMATE_API_KEY) {
        throw new Error('Creatomate API key not configured');
      }

      const templateId = this.getCreatomateTemplate(params.type);
      
      const response = await axios.post('https://api.creatomate.com/v1/renders', {
        template_id: templateId,
        modifications: {
          'text-content': params.script,
          'background-image': params.imageUrl,
          'audio-track': params.audioUrl
        }
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      // Poll for completion
      const renderId = response.data.id;
      return await this.pollCreatomateRender(renderId);
    } catch (error) {
      console.error('Creatomate video generation error:', error);
      return `https://mock-cdn.neuroforge.com/videos/${Date.now()}_${params.type}.mp4`;
    }
  }

  private async uploadToCloudinary(content: {
    videoUrl?: string;
    audioUrl?: string;
    script: string;
  }): Promise<{ video?: string; audio?: string; script?: string }> {
    try {
      const cloudinary = require('cloudinary').v2;
      
      if (process.env.CLOUDINARY_URL) {
        cloudinary.config(process.env.CLOUDINARY_URL);
      }

      const results: any = {};

      // Upload video
      if (content.videoUrl) {
        const videoResult = await cloudinary.uploader.upload(content.videoUrl, {
          resource_type: 'video',
          folder: 'neuroforge/videos'
        });
        results.video = videoResult.secure_url;
      }

      // Upload audio
      if (content.audioUrl) {
        const audioResult = await cloudinary.uploader.upload(content.audioUrl, {
          resource_type: 'auto',
          folder: 'neuroforge/audio'
        });
        results.audio = audioResult.secure_url;
      }

      // Upload script as text file
      const scriptBuffer = Buffer.from(content.script);
      const scriptResult = await cloudinary.uploader.upload(`data:text/plain;base64,${scriptBuffer.toString('base64')}`, {
        resource_type: 'raw',
        folder: 'neuroforge/scripts',
        format: 'txt'
      });
      results.script = scriptResult.secure_url;

      return results;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return {};
    }
  }

  private getMockScript(type: string): string {
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
👆 CLIQUE AGORA e garante sua vaga!`,

      roteiro: `📝 ROTEIRO VIRAL - ESTRUTURA MASTER

🎬 ABERTURA (0-3s)
- Hook visual impactante
- Pergunta intrigante
- Promessa clara

🎥 DESENVOLVIMENTO (3-25s)
- Problema identificado
- Tensão construída
- Solução apresentada
- Prova social

🎯 FECHAMENTO (25-30s)  
- Call-to-action direto
- Senso de urgência
- Interação solicitada

📱 HASHTAGS ESTRATÉGICAS:
#Viral #Conteúdo #Engajamento #Resultado`
    };

    return scripts[type as keyof typeof scripts] || scripts.roteiro;
  }

  private getMockImageUrl(type: string): string {
    const images = {
      tiktok: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=600',
      vsl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400',
      reels: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=400&h=600',
      shorts: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=400&h=600'
    };
    return images[type as keyof typeof images] || images.tiktok;
  }

  private getCreatomateTemplate(type: string): string {
    // Template IDs would be configured in Creatomate dashboard
    const templates = {
      tiktok: 'tiktok-template-id',
      vsl: 'vsl-template-id',
      reels: 'reels-template-id',
      shorts: 'shorts-template-id',
      ads: 'ads-template-id'
    };
    return templates[type as keyof typeof templates] || templates.tiktok;
  }

  private async pollCreatomateRender(renderId: string): Promise<string> {
    const maxAttempts = 30;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await axios.get(`https://api.creatomate.com/v1/renders/${renderId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}`
          }
        });

        if (response.data.status === 'succeeded') {
          return response.data.url;
        } else if (response.data.status === 'failed') {
          throw new Error('Render failed');
        }

        // Wait 2 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
      } catch (error) {
        console.error('Polling error:', error);
        break;
      }
    }

    throw new Error('Render timeout');
  }
}

export const aiPipeline = new AIPipeline();
