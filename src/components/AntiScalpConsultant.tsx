import React, { useState, useRef, useEffect } from 'react';
import { Send, Shield, Zap, Search, AlertTriangle, AlertCircle, Sparkles, MessageSquare, BadgeCheck } from 'lucide-react';
import { Message } from '../types';

interface AntiScalpConsultantProps {
  systemInstruction?: string;
  onSimulationLog?: (msg: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export default function AntiScalpConsultant({ systemInstruction = "You are an expert AI ticket security advisor specialized in combatting illegal scalping (암표 사기) in Korean Baseball (KBO). Inform and consult users kindly in Korean regarding our 1) Phone & Dutchit Bank account lock, 2) Price Cap (+10% ~ +20%), 3) Resale Limits, and 4) Escrow with rotating QR codes. Help fans audit if independent trades they found elsewhere are risky.", onSimulationLog }: AntiScalpConsultantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '⚾️ 안녕하세요! **야구팬 상생 양도 검증 AI 컨설턴트**입니다. 다른 중고나라, 당근, SNS(트위터) 등에서 발견한 티켓 정보가 암표 사기인지, 혹은 정당한 거래인지 검증을 받아보시거나, 본 플랫폼의 암표 원천 차단 4대 핵심 역학(본인인증, 가격상한제, 재판매 LOCK, 에스크로 실시간 QR)에 대한 질문에 답변해 드립니다. 어떤 제안을 검토해 드릴까요?',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Auditor Sandbox Inputs
  const [auditOriginalPrice, setAuditOriginalPrice] = useState<string>('20000');
  const [auditAskingPrice, setAuditAskingPrice] = useState<string>('65000');
  const [auditSellerVerified, setAuditSellerVerified] = useState<boolean>(false);
  const [auditSellerHistory, setAuditSellerHistory] = useState<string>('sns-direct'); // 'sns-direct' | 'verified-app'

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getClientFallbackReply = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes("매크로") || lower.includes("인증") || lower.includes("실명") || lower.includes("더치트")) {
      return `🔒 **본인인증과 더치트(The Cheat) 실시간 연동을 통한 매크로 차단 원리**

클린 티켓은 전문 암표업자의 다량 계정 생성 및 매크로 공격을 다음 **3중 방탄 인증 아키텍처**로 원천 봉쇄합니다:

1. **1인 1계정 통신사 점유 실명인증 디바이스 통합**
   - 매크로 업자들은 가상 번호나 수십 개의 선불 유심을 사용해 가짜 계정을 확보합니다. 클린 티켓은 통신사의 실명인증을 강제 통과시키며, 단 **1개의 주민등록번호 당 1개의 스마트 디바이스 계정**만을 가용 상태로 매핑합니다. 이로써 다계정을 활용한 매크로 작업이 원천 차단됩니다.

2. **실명인증 명의와 1:1 일치하는 1계정 1계좌 연동 강제**
   - 판매 등록 전, 실명인증을 완료한 소유주 명의와 **정확히 일치하는 은행 계좌 인증**이 이루어집니다. 타인의 명의나 도용 법인 계좌 사용을 원천 차단하여 가짜 계정 유입 시도를 가상 영역에서 격리합니다.

3. **더치트(The Cheat) 실시간 1초 무사고 DB 크로스체킹**
   - 계좌를 등록하는 즉시 더치트 사기 피해 방지 포털 API를 통해 1초 내에 실시간 조회됩니다. 조금이라도 유해 이력이 있거나 모니터링 중인 이상 거래자 계좌는 **즉각 블랙리스트 처리**되어 가동 권한이 무조건 영방향으로 비활성화됩니다.`;
    }
    if (lower.includes("qr") || lower.includes("에스크로") || lower.includes("정산") || lower.includes("바코드")) {
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
    if (lower.includes("상한") || lower.includes("10%") || lower.includes("원가") || lower.includes("이유") || lower.includes("수익")) {
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
    if (lower.includes("감사 요청") || lower.includes("위험 즉시 분석") || lower.includes("티켓 원래가격")) {
      let orig = 20000;
      let ask = 65000;
      const origMatch = text.match(/원래가격\(정가\):\s*([0-9,]+)/);
      const askMatch = text.match(/판매제안가:\s*([0-9,]+)/);
      if (origMatch) orig = parseInt(origMatch[1].replace(/,/g, ''), 10);
      if (askMatch) ask = parseInt(askMatch[1].replace(/,/g, ''), 10);
      const profit = ask - orig;
      const markupRate = Math.round((profit / orig) * 100);
      const riskScore = markupRate > 50 ? Math.min(95, 40 + markupRate / 2) : Math.max(10, markupRate * 2);

      return `🔍 **클린 티켓 AI 실시간 거래 안전도 분석 보고서(Audit Report)**

본 거래 제안에 대한 위험 검증 및 시뮬레이션 분석 결과를 송출합니다.

*   **티켓 정상가 (원가):** ${orig.toLocaleString()}원
*   **상대방 제안 가격:** ${ask.toLocaleString()}원
*   **가격 거품율:** **+${markupRate}%** (${profit.toLocaleString()}원 초과 마진)
*   **거래 리스크 지수:** **${riskScore} / 100점**

---

### **⚠️ 핵심 리스크 감지 내역**
1. **비정상적인 가격 프리미엄 (+${markupRate}%)**
   - 본 플랫폼에서는 정가 대비 **최대 +10% ~ +20%의 가격 상한선**을 엄격히 규정하고 있습니다. 상대방이 제시한 가격은 이 상한 기준을 크게 초과하고 있어 상생 규정을 위반한 무단 차익 거래로 간주됩니다.
2. **비인증 외부 직거래(SNS 및 개별 채팅) 위험성**
   - 실명인증과 계좌 연동이 누락된 개인 간의 SNS(트위터, 번개장터, 당근 등) 직거래는 사기단 및 전문 암표상(Scalper)들의 주 활동 무대입니다. 판매 대금 영수 후에 계정을 삭제하고 도망치는 '먹튀' 피해의 전형적인 경로를 띠고 있습니다.
3. **위조 티켓 및 다중 판매 위험**
   - 정적 캡처 이미지나 PDF 파일 등의 직거래 전달 형태는 하나의 바코드를 다수에게 중복 판매하는 사기 기법에 노출되기 대단히 쉽습니다.

---

### **🛡️ 클린 티켓 상생 안전 대응 가이드**
*   **절대 외부 직거래를 하지 마십시오:** 본 양도 거래는 즉각 중단하고, 본 플랫폼 **클린 티켓(Clean Ticket)** 안전 마켓 내부에서 공식 등록된 인증 티켓 목록을 가동하여 양도받으시길 적극 권고합니다.
*   **에스크로(Escrow) 금고 거래 권장:** 결제 대금이 가상 안심금고에 안전하게 보전되며, 입장이 최종 확인될 때 비로소 판매자에게 정산되는 시스템을 통해서만 거래의 안전이 보장됩니다.
*   **실시간 회전 OTP QR 사용:** 30초마다 갱신되는 클린 티켓 공식 동적 바코드를 매개로 하여, 위조 및 중복 사용 시도가 원천 차단된 티켓만을 활용하십시오.`;
    }

    return `⚾️ 안녕하세요! **클린 티켓 AI 통합 안전 컨설턴트**입니다.

인증 로직에 대해 무엇이든 편하게 물어보세요!

*   **"본인인증과 더치트 연동은 어떻게 매크로를 막나요?"**
*   **"에스크로 정산 후 어떻게 QR 코드가 바뀌는지 가르쳐주세요"**
*   **"상한가 제도는 왜 정가 거래가 아니라 +10~20% 인가요?"**`;
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    if (onSimulationLog) {
      onSimulationLog(`AI 컨설턴트에게 암표 사기 방지 검증 문의 발송`, 'info');
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          systemInstruction,
          model: 'gemini-3.5-flash',
          temperature: 0.6,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response non-200');
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (onSimulationLog) {
        onSimulationLog(`Gemini 모델(${data.modelUsed})로부터 안전 연동 분석 결과 수신`, 'success');
      }
    } catch (error) {
      console.error(error);
      const fallbackReplyText = getClientFallbackReply(textToSend);
      const fallbackMsg: Message = {
        id: `assistant-fallback-${Date.now()}`,
        role: 'assistant',
        content: fallbackReplyText,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: '클린 티켓 내장 규칙 엔진 (Offline Core)'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (onSimulationLog) {
        onSimulationLog(`자체 내장 규칙 분석기로부터 안전 연동 분석 결과 수신 (안전 보장 모드)`, 'success');
      }
    } finally {
      setIsSending(false);
    }
  };

  // Predefined queries helper for easy user engagement
  const handleAskPreset = (query: string) => {
    handleSendMessage(query);
  };

  // Perform instant Ticket Audit analysis using Gemini
  const handleAuditTicket = async () => {
    const orig = Number(auditOriginalPrice);
    const ask = Number(auditAskingPrice);
    const profit = ask - orig;
    const markupRate = Math.round((profit / orig) * 100);

    const promptText = `암표 분석 도구 감사 요청:
티켓 원래가격(정가): ${orig.toLocaleString()}원
티켓 판매제안가: ${ask.toLocaleString()}원
정가 대비 거품가: +${markupRate}% (${profit.toLocaleString()}원 상승)
인증 여부: ${auditSellerVerified ? "본인 실명/전화번호 연동 완료" : "미인증 판매자/개인 SNS 직거래"}
거래 출처: ${auditSellerHistory === 'sns-direct' ? "트위터/카페/당근 개별 직거래" : "안심 상생 플랫폼"}

위 조건에 대해 암표 사기 가능성과 리스크 점수(0~100점)를 매기고, 전문 암표상(Scalper) 판단 여부 및 안전을 위한 조치사항을 4대 상생로직에 근거하여 명료한 마크다운 리포트로 분석해줘.`;

    handleSendMessage(promptText);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md flex flex-col md:flex-row h-[550px] overflow-hidden">
      
      {/* Target Auditor Sandbox Left Panel */}
      <div className="md:w-72 bg-gradient-to-b from-slate-900 to-slate-950 text-white p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <h4 className="font-extrabold text-sm uppercase tracking-wide text-emerald-400">외부 암표 위험 검증기</h4>
          </div>
          
          <p className="text-[11px] text-slate-400 leading-relaxed">
            SNS나 타 중고 사이트에서 거래 제안을 받으셨나요? 아래에 기입하시면 AI 보안관이 거래 유해성을 실시간 Audit 보고서로 산출해 드립니다.
          </p>

          <div className="space-y-3.5 pt-1">
            {/* Original Face value */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">티켓 정가 (원가)</label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 focus:outline-emerald-500 font-bold text-white"
                  value={auditOriginalPrice}
                  onChange={(e) => setAuditOriginalPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Asking Price */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">상대방 제안 가격</label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 focus:outline-emerald-500 font-bold text-rose-300"
                  value={auditAskingPrice}
                  onChange={(e) => setAuditAskingPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Seller profile */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">판매 채널 정보</label>
              <select
                className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg py-2 px-2.5 focus:outline-emerald-500 text-slate-250 font-semibold"
                value={auditSellerHistory}
                onChange={(e) => setAuditSellerHistory(e.target.value)}
              >
                <option value="sns-direct">개인 트위터/카페/번개 비인증 거래</option>
                <option value="verified-app">본 타플랫폼 일반 중고거래</option>
              </select>
            </div>

            {/* Seller verification states checkbox */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 w-3.5 h-3.5"
                checked={auditSellerVerified}
                onChange={(e) => setAuditSellerVerified(e.target.checked)}
              />
              <span className="text-[11px] font-bold text-slate-300">더치트 인증완료 계좌 보유자?</span>
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAuditTicket}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition mt-4 shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-1.5"
        >
          <Search className="w-4 h-4 text-emerald-250" />
          <span>위험 분석 의뢰</span>
        </button>
      </div>

      {/* Live Chat Panel */}
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-150 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="font-bold text-xs text-slate-800">KBO 암표방지 지능형 안전센터</span>
          </div>
          <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded">
            Gemini Assistant
          </span>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1 mb-1 text-[10px] font-bold text-slate-500">
                {m.role === 'user' ? (
                  <span>나 (야구팬 야구매니아)</span>
                ) : (
                  <span className="flex items-center gap-0.5 text-emerald-700">
                    <Shield className="w-3 h-3" />
                    상생 검증 AI관 {m.modelUsed ? `(${m.modelUsed})` : ''}
                  </span>
                )}
                <span>• {m.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] text-xs rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap shadow-sm border ${
                  m.role === 'user'
                    ? 'bg-slate-900 border-slate-900 text-white rounded-tr-none font-medium'
                    : 'bg-white border-slate-100 text-slate-800 rounded-tl-none font-normal'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex gap-1.5 items-center text-xs text-slate-500 pl-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="font-semibold text-[10px]">Gemini가 원천 논리 분석 검토 중...</span>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>

        {/* Suggested Queries bar */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          <button
            type="button"
            onClick={() => handleAskPreset('상한가 제도는 왜 정가 거래가 아니라 +10~20% 인가요?')}
            className="text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold px-3 py-1.5 rounded-full transition shrink-0"
          >
            ❓ 원가가 아닌 +10% 가격 상한선인 이유?
          </button>
          <button
            type="button"
            onClick={() => handleAskPreset('본 실명인증과 더치트 연동은 어떻게 매크로를 막나요?')}
            className="text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold px-3 py-1.5 rounded-full transition shrink-0"
          >
            🔒 본인인증 & 더치트 매크로 차단 로직
          </button>
          <button
            type="button"
            onClick={() => handleAskPreset('에스크로 정산 후 어떻게 QR 코드가 바뀌는지 가르쳐주세요')}
            className="text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold px-3 py-1.5 rounded-full transition shrink-0"
          >
            🎫 에스크로 및 QR 오토 로테이션 방식
          </button>
        </div>

        {/* Input box */}
        <div className="p-3 bg-white border-t border-slate-150 flex gap-2">
          <input
            type="text"
            placeholder="상생 검증 AI에게 질문이나 검토 내용을 입력하세요..."
            className="flex-1 text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
            disabled={isSending}
          />
          <button
            type="button"
            onClick={() => handleSendMessage(inputMessage)}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition"
            disabled={!inputMessage.trim() || isSending}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
