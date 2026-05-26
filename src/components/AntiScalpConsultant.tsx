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
      const errMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ API와 연결 과정에서 오류가 발생했습니다. 실시간 Gemini 인스턴스를 사용하시려면 Secrets UI에 GEMINI_API_KEY를 등록해 주세요. 로컬 가이드라인에 의거한 임시 답변을 출력하겠습니다.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMessage]);
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
          <span>위험 즉시 분석 의뢰</span>
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
