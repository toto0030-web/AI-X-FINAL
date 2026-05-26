import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Lazy-initialize Gemini Client
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      return null;
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // API Check Status Endpoint
  app.get("/api/status", (req, res) => {
    const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
    res.json({
      status: "ready",
      hasGeminiKey: hasKey,
      environment: process.env.NODE_ENV || "development"
    });
  });

  // Chat completions endpoint
  app.post("/api/chat", async (req, res) => {
    const { messages, systemInstruction, model, temperature } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Key is missing: Executing smart local responsive backup
      console.log("GEMINI_API_KEY is not configured. Falling back to local responder.");
      const reply = generateLocalReply(messages, systemInstruction, model);
      return res.json({
        content: reply,
        modelUsed: `${model} (Simulated Demo Mode)`,
        isSimulated: true
      });
    }

    try {
      // Convert UI messages into Google GenAI format.
      // Roles are expected to be 'user' and 'model'
      const formattedContents = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));

      const modelToUse = model || "gemini-3.5-flash";

      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction || "You are a helpful assistant.",
          temperature: typeof temperature === "number" ? temperature : 0.7,
        }
      });

      const replyText = response.text || "No response received from the Gemini model.";

      res.json({
        content: replyText,
        modelUsed: modelToUse,
        isSimulated: false
      });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        error: error.message || "An error occurred with Gemini connectivity.",
        isSimulated: true,
        content: `⚠️ **API Error:** ${error.message || "Unable to reach Gemini."}\n\nFalling back to simulated response:\n\n${generateLocalReply(messages, systemInstruction, model)}`
      });
    }
  });

  // Simple local dialog fallback generator to make the demo immediately playable
  function generateLocalReply(messages: any[], systemInstruction: string, model: string): string {
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const lowerInput = lastUserMessage.toLowerCase();

    // Check custom system instructions to tweak the simulated vibe
    const isKorean = /[\uac00-\ud7a3]/.test(lastUserMessage) || (systemInstruction && /[\uac00-\ud7a3]/.test(systemInstruction));

    if (isKorean) {
      if (lowerInput.includes("이전") && lowerInput.includes("대화")) {
        return `네, 세션 기록을 기반으로 확인해 본 결과, 'PLAY GROUND' 영역에서의 이전 대화 목록은 다음과 같습니다:

1. **JSON 스키마 분석 질문:** OpenAPI 스펙 구조 및 데이터 모델 매핑 토론.
2. **Tailwind 그리드 최적화:** 12열 그리드 및 반응형 모바일 브레이크포인트 코딩 스타일.
3. **API 통합 로직 검토:** 비동기 Thunk 및 에러 경계 레이어 처리.

원하시는 대화가 있다면 왼쪽 사이드바에서 세션을 즉시 선택하여 전체 내용을 불러올 수 있습니다.`;
      }
      if (lowerInput.includes("안녕") || lowerInput.includes("반가워")) {
        return `안녕하세요! PLAY GROUND에 오신 것을 환영합니다.
주어진 시스템 인스트럭션 \`"${systemInstruction}"\`에 맞추어 시뮬레이션 대화를 시작합니다. 어떤 것을 도와드릴까요?`;
      }
      return `현재 Google AI Studio의 시뮬레이션 모드로 응답 중입니다.

**설정된 지침:** "${systemInstruction || '일반 도우미'}"
**선택된 모델:** ${model}

전달해주신 메세지: *"${lastUserMessage}"*

실제 실시간 Gemini 답변을 받아보시려면 오른쪽 위나 Settings의 **Secrets** 탭에 \`GEMINI_API_KEY\`를 입력해주시면 자동으로 연동됩니다! 더 확인하고 싶으신 다른 점이 있으신가요?`;
    } else {
      if (lowerInput.includes("previous") || lowerInput.includes("history") || lowerInput.includes("talk")) {
        return `Yes, based on your active PLAY GROUND session archiving, you have previous interactions including:
- **JSON Schema Structure:** In-depth model-mapping session.
- **Tailwind Grid Tuning:** Breakpoints and mobile layout discussion.
- **API Integration Review:** State handlers and request-response pipeline.

You can select any of these historic topics from the left menu panel.`;
      }
      return `Welcome to the PLAY GROUND. I am operating in Demo/Simulation mode since your API key is currently unset or initializing.

**Active System Directive:** "${systemInstruction || 'Default Assistant'}"
**Selected Core Brain:** ${model}

Your input: "${lastUserMessage}"

To unlock full interactive power with live reasoning, please configure your **GEMINI_API_KEY** inside the Secrets UI. What topic would you like to model today?`;
    }
  }

  // Vite integration
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
