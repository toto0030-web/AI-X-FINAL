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

  // Simple local dialog fallback generator to make the demo immediately playable with extremely helpful and expert domain knowledge
  function generateLocalReply(messages: any[], systemInstruction: string, model: string): string {
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const lowerInput = lastUserMessage.toLowerCase();

    // Check custom system instructions to tweak the simulated vibe
    const isKorean = /[\uac00-\ud7a3]/.test(lastUserMessage) || (systemInstruction && /[\uac00-\ud7a3]/.test(systemInstruction));

    if (isKorean) {
      // 1. Audit Request Detection
      if (lowerInput.includes("감사 요청") || lowerInput.includes("위험 즉시 분석") || lowerInput.includes("티켓 원래가격")) {
        // Safe parsers for ticket numbers
        let orig = 20000;
        let ask = 65000;
        
        const origMatch = lastUserMessage.match(/원래가격\(정가\):\s*([0-9,]+)/);
        const askMatch = lastUserMessage.match(/판매제안가:\s*([0-9,]+)/);
        if (origMatch) {
          orig = parseInt(origMatch[1].replace(/,/g, ''), 10);
        }
        if (askMatch) {
          ask = parseInt(askMatch[1].replace(/,/g, ''), 10);
        }
        const profit = ask - orig;
        const markupRate = Math.round((profit / orig) * 100);
        const riskScore = markupRate > 50 ? Math.min(95, 40 + markupRate / 2) : Math.max(10, markupRate * 2);
        
        const isSnsDirect = lowerInput.includes("개인 트위터") || lowerInput.includes("sns-direct");
        const isVerified = lowerInput.includes("본인 실명/전화번호 연동 완료") || lowerInput.includes("verified-app");

        return `🔍 **클린 티켓 AI 실시간 거래 안전도 분석 보고서(Audit Report)**

본 거래 제안에 대한 위험 검증 및 시뮬레이션 분석 결과를 송출합니다.

*   **티켓 정상가 (원가):** ${orig.toLocaleString()}원
*   **상대방 제안 가격:** ${ask.toLocaleString()}원
*   **가격 거품율:** **+${markupRate}%** (${profit.toLocaleString()}원 초과 마진)
*   **거래 리스크 지수:** **${riskScore} / 100점** ${riskScore > 60 ? '🔴 [매우 위험]' : riskScore > 30 ? '🟡 [주의 요망]' : '🟢 [안전 지대]'}

---

### **⚠️ 핵심 리스크 감지 내역**
1. ${markupRate > 20 ? `**비정상적인 가격 프리미엄 (+${markupRate}%)**\n   - 본 플랫폼에서는 정가 대비 **최대 +10% ~ +20%의 가격 상한선**을 엄격히 규정하고 있습니다. 상대방이 제시한 가격은 이 상한 기준을 크게 초과하고 있어 상생 규정을 위반한 무단 차익 거래로 간주됩니다.` : `**규정 범위 내 프리미엄 가격**\n   - 정가 대비 상한 기준선 이내의 가격이나, 직거래 시 추가 리스크가 존재할 수 있습니다.`}
2. ${isSnsDirect ? `**비인증 외부 직거래(SNS 및 개별 채팅) 위험성**\n   - 실명인증과 계좌 연동이 누락된 개인 간의 SNS(트위터, 번개장터, 당근 등) 직거래는 사기단 및 전문 암표상(Scalper)들의 주 활동 무대입니다. 판매 대금 영수 후에 계정을 삭제하고 도망치는 '먹튀' 피해의 전형적인 경로를 띠고 있습니다.` : `**앱 내부 인증 상태 확인**\n   - 상대방 프로필의 인증 여부를 플랫폼 공식 로고를 통해 다시 한번 정밀 확인하십시오.`}
3. **위조 티켓 및 다중 판매 위험**\n   - 정적 캡처 이미지나 PDF 파일 등의 직거래 전달 형태는 하나의 바코드를 다수에게 중복 판매하는 사기 기법에 노출되기 대단히 쉽습니다.

---

### **🛡️ 클린 티켓 상생 안전 대응 가이드**
*   **절대 외부 직거래를 하지 마십시오:** 본 양도 거래는 즉각 중단하고, 본 플랫폼 **클린 티켓(Clean Ticket)** 안전 마켓 내부에서 공식 등록된 인증 티켓 목록을 가동하여 양도받으시길 적극 권고합니다.
*   **에스크로(Escrow) 금고 거래 권장:** 결제 대금이 가상 안심금고에 안전하게 보전되며, 입장이 최종 확인될 때 비로소 판매자에게 정산되는 시스템을 통해서만 거래의 안전이 보장됩니다.
*   **실시간 회전 OTP QR 사용:** 30초마다 갱신되는 클린 티켓 공식 동적 바코드를 매개로 하여, 위조 및 중복 사용 시도가 원천 차단된 티켓만을 활용하십시오.`;
      }

      // 2. Macro Logic Detection
      if (lowerInput.includes("매크로") || lowerInput.includes("인증") || lowerInput.includes("실명") || lowerInput.includes("더치트")) {
        return `🔒 **본인인증과 더치트(The Cheat) 실시간 연동을 통한 매크로 차단 원리**

클린 티켓은 전문 암표업자의 다량 계정 생성 및 매크로 공격을 다음 **3중 방탄 인증 아키텍처**로 원천 봉쇄합니다:

1. **1인 1계정 통신사 점유 실명인증 디바이스 통합**
   - 매크로 업자들은 가상 번호나 수십 개의 선불 유심을 사용해 가짜 계정을 확보합니다. 클린 티켓은 통신사의 실명인증을 강제 통과시키며, 단 **1개의 주민등록번호 당 1개의 스마트 디바이스 계정**만을 가용 상태로 매핑합니다. 이로써 다계정을 활용한 매크로 작업이 원천 차단됩니다.

2. **실명인증 명의와 1:1 일치하는 1계정 1계좌 연동 강제**
   - 판매 등록 전, 실명인증을 완료한 소유주 명의와 **정확히 일치하는 은행 계좌 인증**이 이루어집니다. 타인의 명의나 도용 법인 계좌 사용을 원천 차단하여 가짜 계정 유입 시도를 가상 영역에서 격리합니다.

3. **더치트(The Cheat) 실시간 1초 무사고 DB 크로스체킹**
   - 계좌를 등록하는 즉시 더치트 사기 피해 방지 포털 API를 통해 1초 내에 실시간 조회됩니다. 조금이라도 유해 이력이 있거나 모니터링 중인 이상 거래자 계좌는 **즉각 블랙리스트 처리**되어 가동 권한이 무조건 영방향으로 비활성화됩니다.`;
      }

      // 3. Dynamic QR and Escrow Logic Detection
      if (lowerInput.includes("qr") || lowerInput.includes("에스크로") || lowerInput.includes("정산") || lowerInput.includes("바코드")) {
        return `🎫 **실시간 동적 OTP QR과 안전 에스크로(Escrow) 작동 역학**

클린 티켓의 동적 QR 시스템은 기존 중고 거래의 아킬레스건인 **"티켓 이미지 중복 재판매 먹튀"**를 완벽하게 기술적으로 해결합니다:

1. **가상 안심금고 대금 홀딩 (Escrow Lock)**
   - 구매자가 비용을 결제하더라도 그 즉시 판매자 호주머니로 전달되는 것이 아닙니다. 거래 대금은 에스크로 안전 금고에 **철저하게 동결(Lock-Up)** 상태로 홀딩됩니다.

2. **30초 만료 동적 OTP QR 코드 생성 (Dynamic QR Rotating)**
   - 구매자의 스마트폰 화면에는 고정된 바코드 이미지가 노출되는 대신, **30초 간격으로 완전 자동 회전 및 재생성되는 dynamic 토큰 기반 암호화 QR 코드**가 생성됩니다. 캡처본이나 출력물, 녹화 영상 등은 게이트에서 즉시 "만료된 바코드"로 검출되어 통과될 수 없습니다.

3. **경기장 개찰구 실시간 입장 인증 시점 소유권 최종 이전**
   - 경기장 게이트에서 스캐너에 바코드를 갖다 대 유효한 OTP가 최종 확인되어 관람객이 게이트 안으로 실물 입장하는 순간, 비로소 **소유권 양도 완료 입증** 처리됩니다.
   - 입장이 확인된 직후, 락업상태로 보호되어 있던 에스크로 가상 금고 자금이 판매자 명의 계좌로 **D+0 실시간 자동 정산**되어 직송 정산 완료됩니다. 판매자 또한 번거로운 정산 대기 기간 없이 초고속 수령이 가능합니다.`;
      }

      // 4. Price Cap Logic Detection
      if (lowerInput.includes("상한") || lowerInput.includes("10%") || lowerInput.includes("원가") || lowerInput.includes("이유") || lowerInput.includes("수익")) {
        return `📈 **정가 강제가 아니라 탄력적 상한폭(+10% ~ +20%)을 운용하는 이유**

보통 암표 차단을 극단화하기 위해 "반드시 원가 거래만 허용해야 한다"는 단순 주장을 펼치기도 합니다. 그러나 실제 상용 환경에서 0% 상한을 고집할 경우 오히려 치명적인 부작용을 낳습니다:

1. **지하 은성(Underground) 시장으로의 일탈 유도**
   - 티켓 예매 시 수반되는 **예매 수수료(KBO 구단별 대다수 1,000원선)**, 예매 대행 플랫폼 이용 수수료, 수수 수수료 비용 등이 실존합니다. 극단적 0% 원가 강제 시, 정직한 양도인들마저 실제 수반된 수수료를 보존하지 못해, 플랫폼을 버리고 다시 트위터나 카페 등으로 도피하여 "따로 수수료와 프리미엄을 얹어달라"며 지하 비인증 거래로 숨어버립니다.

2. **합리적 편익 보전선 허용을 통한 클린 마켓으로의 흡수**
   - 정가의 약 **+10% 내외**(최대 +20%)만을 허용하는 상한폭을 두면, 양도인들은 정당하게 수수료와 거래 소요 리소스를 합법적으로 벌 수 있기에 음성화되지 않고 안전한 플랫폼 규격 내부로 안착하게 됩니다.

3. **전문 암표상들의 경제성(차익 실현 가능성) 완전 붕쇄**
   - 전문 암표상(Scalper) 무리들은 다계정 프록시 구축비, 고가의 예매 매크로 프로그램 유지 비용, 인건비가 발생하므로 티켓당 **정가의 +200% ~ +500% 초과 마진**을 취하지 못하면 적자가 발생하는 산업적 구조를 갖고 있습니다.
   - 단 단돈 1,000~2,000원선(정가 2만 원 기준 +10%)의 미세 마진 수준으로 차단당하는 클린 티켓 환경에서는 **자동으로 비즈니스 모델이 붕괴되어 자진 이탈**하게 됩니다.`;
      }

      // 5. Default Response
      return `⚾️ 안녕하세요! **클린 티켓 AI 통합 안전 컨설턴트**입니다.

현재 실시간 인공지능 분석기로 연동하여 분석을 진행하고 있습니다. 원하시는 클린 티켓의 역학에 대해 무엇이든 질문해 주세요!

**💡 추천 탐색 키워드 정조준:**
*   **"본인인증과 더치트 연동은 어떻게 매크로를 막나요?"**
*   **"에스크로 정산 후 어떻게 QR 코드가 바뀌는지 가르쳐주세요"**
*   **"상한가 제도는 왜 정가 거래가 아니라 +10~20% 인가요?"**

궁금하신 문장이나 단어를 기입해 입력하시면 클린 티켓 4대 상생로직에 근거한 상세 분석 정보를 기동하여 친절히 정리해 드리겠습니다!`;
    } else {
      return `Welcome to the **Clean Ticket AI Safety Hub**. 

I am here to guide you through our core anti-scalping architecture:
1. **D+0 Escrow Settlement** matched with rolling OTP Dynamic QR codes.
2. **Flexible Price Caps (+10% ~ +20%)** to destroy professional margins while preserving genuine user convenience.
3. **Hardware-bound Identity Authentication & The Cheat verification** to freeze multi-device macro swarms.

Please consult me with any details of external listings or questions on how we secure the ticket market!`;
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
