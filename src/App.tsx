import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Ticket, 
  Smartphone, 
  DollarSign, 
  Lock, 
  QrCode, 
  Terminal, 
  HelpCircle, 
  TrendingDown, 
  Plus, 
  Sparkles, 
  Search, 
  RefreshCw, 
  AlertTriangle, 
  BadgeCheck,
  Award,
  BookOpen,
  MapPin,
  HeartHandshake
} from 'lucide-react';

import { KboMatch, TicketListing, UserVerification, SimulationLog } from './types';
import { KBO_MATCHES, KBO_TEAMS, INITIAL_LISTINGS } from './data';
import VerificationModal from './components/VerificationModal';
import CreateListingModal from './components/CreateListingModal';
import EscrowStepTracker from './components/EscrowStepTracker';
import AntiScalpConsultant from './components/AntiScalpConsultant';

export default function App() {
  // Global States
  const [verification, setVerification] = useState<UserVerification>({
    isVerified: false,
    name: '',
    phone: '',
    bankName: '',
    accountNumber: '',
    theCheatChecked: false,
    theCheatStatus: 'unread'
  });

  const [listings, setListings] = useState<TicketListing[]>(INITIAL_LISTINGS);
  const [selectedMatchFilter, setSelectedMatchFilter] = useState<string>('all');
  const [activeTradingId, setActiveTradingId] = useState<string | null>(null);
  const [logs, setLogs] = useState<SimulationLog[]>([]);

  // Dialog Modals
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Initial Logs
  useEffect(() => {
    addLog('클린 티켓 KBO 건강한 양도 플랫폼 상생 엔진 작동 시작', 'info');
    addLog('더치트(The Cheat) 실시간 1초 연동 API 연동 경로 확인 완료', 'info');
    addLog('탄력적 상한제 자동 백엔드 제한 수식 적재 완료 (+10% ~ +20% 구역제한)', 'success');
  }, []);

  const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'error') => {
    const newLog: SimulationLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour12: false })
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleVerifyComplete = (data: UserVerification) => {
    setVerification(data);
    addLog(`[실명인증] ${data.name} 님의 본인확인 완료 (통신사 점유 인증 통과)`, 'success');
    addLog(`[계좌 연동] ${data.bankName} 계좌가 안전하게 연동되었습니다.`, 'success');
    addLog(`[더치트 검증] 거래 이력 무사고 확인 - 클린 회원 등급 부여`, 'success');
  };

  const handleAddListing = (listingData: Omit<TicketListing, 'id' | 'sellerName' | 'sellerRating' | 'sellerPhoneVerified' | 'sellerBankVerified' | 'status' | 'listedAt' | 'qrRotationsCount'>) => {
    const newListing: TicketListing = {
      ...listingData,
      id: `list-${Date.now()}`,
      sellerName: verification.name || '인증회원',
      sellerRating: 5.0,
      sellerPhoneVerified: true,
      sellerBankVerified: true,
      status: 'available',
      listedAt: '방금 전',
      qrRotationsCount: 0
    };

    setListings((prev) => [newListing, ...prev]);
    
    addLog(`[티켓 등록] ${newListing.seatInfo} 티켓 등록 성공 (${newListing.askingPrice.toLocaleString()}원)`, 'success');
    addLog(`[상한필터 거품율 검증] 정가대비 +${newListing.capPercentage}% 합리적 보전선 이내 확인 (Safe Passed)`, 'info');
  };

  const handleBuyTicket = (ticketId: string) => {
    if (!verification.isVerified) {
      addLog('[보안 제어] 티켓 구매를 위해 통신사 및 실명인증이 필수 조건입니다.', 'warn');
      setIsVerifyOpen(true);
      return;
    }

    setListings((prev) => 
      prev.map((item) => 
        item.id === ticketId ? { ...item, status: 'escrow', purchasedBy: verification.name } : item
      )
    );
    setActiveTradingId(ticketId);

    const ticket = listings.find((t) => t.id === ticketId);
    if (ticket) {
      addLog(`[에스크로 안심 구매] ${ticket.seatInfo} 티켓 구매 요청 접수`, 'info');
      addLog(`[대금 홀딩] 가상 안심금고에 거래 대금 ${ticket.askingPrice.toLocaleString()}원 홀딩중`, 'success');
      addLog(`[재판매 제한 락업] 본 구매건 완료 후 즉시 재판매는 원천 차단됩니다. (암표 루프 차쇄)`, 'warn');
    }
  };

  const handleConfirmEntry = (ticketId: string) => {
    setListings((prev) => 
      prev.map((item) => 
        item.id === ticketId ? { ...item, status: 'completed', escrowReleased: true } : item
      )
    );
    addLog('[QR 검증] 경기장 개찰구 OTP 바코드 스캔 확인 성공', 'success');
    addLog('[소유권 종료] 티켓 소유권 최종 양도 입증', 'success');
    addLog('[정산 해제] 에스크로 안전 금고 락업 해제 -> 판매자에게 대금 송금 진행됨', 'success');
  };

  const handleCancelEscrow = () => {
    if (activeTradingId) {
      setListings((prev) => 
        prev.map((item) => 
          item.id === activeTradingId ? { ...item, status: 'available', purchasedBy: undefined } : item
        )
      );
      addLog('[에스크로 취소] 거래 취소 신청 접수 및 가동 완료', 'warn');
      addLog('[자금 복원] 가상 금고에 락업되어 있던 원금이 구매자 계좌로 100% 원상 복원되었습니다.', 'success');
      setActiveTradingId(null);
    }
  };

  const activeListing = listings.find((item) => item.id === activeTradingId);

  // Filter products
  const filteredListings = listings.filter((item) => {
    if (selectedMatchFilter === 'all') return true;
    return item.matchId === selectedMatchFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-emerald-100 pb-16 anim-fade-in">
      
      {/* Top Header Section */}
      <header className="sticky top-0 z-40 bg-white/90 border-b border-slate-200/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Title logo branding with modern tracking font */}
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-md shadow-emerald-700/10 flex items-center justify-center anim-float">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-none font-display">클린 티켓 (Clean Ticket)</h1>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">KBO 암표 근절 상생 양도 플랫폼</p>
              </div>
            </div>

            {/* Authenticated user pill at right with live neon glow indicators */}
            <div className="flex items-center gap-3">
              {verification.isVerified ? (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-full py-1.5 px-3.5 flex items-center gap-2 text-xs neon-glow transition-all duration-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-bold text-emerald-800 font-mono">{verification.name} (클린 회원)</span>
                  <BadgeCheck className="w-4 h-4 text-emerald-600" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsVerifyOpen(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold py-2 px-4 transition-all hover:scale-105 duration-300 active:scale-95 flex items-center gap-1.5 shadow-md shadow-slate-900/10"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>실명 & 본인인증하기</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Pitch Hero Intro Banner - Full Width with high-contrast stadium aesthetics */}
        <div 
          id="hero-banner" 
          className="w-full text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden hover:shadow-emerald-900/30 transition-all duration-500 flex flex-col justify-between"
          style={{ 
            background: 'linear-gradient(135deg, #052e16 0%, #064e3b 60%, #022c22 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)' 
          }}
        >
          {/* Stadium Grid Overlay */}
          <div className="absolute inset-0 stadium-grid pointer-events-none opacity-30 z-0" />

          {/* Subtle ball field vector lines approximation */}
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none translate-x-12 translate-y-12">
            <div className="w-80 h-80 rounded-full border-[18px] border-emerald-400/25" />
            <div className="w-96 h-96 rounded-full border-[10px] border-emerald-300/15 -translate-x-12 -translate-y-12" />
          </div>

          <div className="space-y-4 relative z-10 max-w-4xl">
            <span className="inline-block text-[10px] bg-emerald-500/35 text-white font-extrabold uppercase py-1.5 px-3.5 border border-emerald-400/40 rounded-full tracking-wider anim-float">
              공익 추구형 상생 플랫폼
            </span>
            <h2 className="text-2xl md:text-3.5xl font-extrabold leading-tight tracking-tight font-display text-white">
              암표 없는 야구장, <br className="hidden md:inline" />
              팬들이 만드는 새로운 문화
            </h2>
            <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed font-semibold">
              전문 암표상이 수익을 낼 수 없는 구조, <strong>우리는 기술로 야구 팬들의 권리를 안전하게 보호합니다.</strong> KBO 정가에 합리적인 상한폭(+10%~+20%)만 두어 차익 폭리를 비활성화하고, 실시간 안전 에스크로 장치로 건강한 거래의 장을 엽니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-6 text-[11px] font-extrabold relative z-10">
            <span className="bg-emerald-950/90 text-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-500/40">
              🚫 매크로·다계정 차단
            </span>
            <span className="bg-emerald-950/90 text-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-500/40">
              📈 탄력 가격 상한제 (+10%~+20%)
            </span>
            <span className="bg-emerald-950/90 text-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-500/40">
              🔒 재판매 원천 비활성화
            </span>
            <span className="bg-emerald-950/90 text-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-500/40">
              🤝 에스크로 동적 QR
            </span>
          </div>
        </div>

        {/* 4 Pillars Interactive Dashboard Cards */}
        <div id="anti-scalp-pillars-section" className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-base tracking-tight text-slate-900">암표 차단 및 야구팬 상생 4대 역학 로직 작동 원리</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Pillar 1 */}
            <div 
              className={`p-5 rounded-2xl border transition duration-300 flex flex-col justify-between ${
                verification.isVerified 
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' 
                  : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-sm shadow-inner">
                  1단계
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug">실명인증 & 계좌연동</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    다계정 및 번호 사칭을 방지하기 위해 1인 1계좌 연동 및 더치트(The Cheat) 실시간 연동을 의무화합니다.
                  </p>
                </div>
              </div>
              <div className="pt-4">
                {verification.isVerified ? (
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    인증완료: {verification.name}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsVerifyOpen(true)}
                    className="text-xs bg-slate-950 font-bold text-white px-3.5 py-2 rounded-lg transition hover:bg-slate-800"
                  >
                    1초 인증해보기
                  </button>
                )}
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-2xl border bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200 transition duration-300 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm shadow-inner">
                  2단계
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug">탄력 상한제 가격 필터</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    무조건 원가Resale 강요는 거래 매칭을 해칩니다. 정가 대비 최대 +10% ~ +20% 내외로 상한선을 두어, 등록 양도를 확보하되 폭리는 완벽 차단합니다.
                  </p>
                </div>
              </div>
              <div className="pt-4 text-slate-400 text-xs font-mono font-bold leading-none select-none">
                외야 +10% | 내야 +15% | 테이블 +20%
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-2xl border bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200 transition duration-300 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm shadow-inner">
                  3단계
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug">재판매 락업 (Resale Loop Lock)</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    양도 구매자가 또 이를 타인에게 더 비싸게 파는 다중 되팔이를 미연에 차단하기 위해, 한 번 거래된 티켓은 경기 종료 시까지 재양도 불가 락업을 겁니다.
                  </p>
                </div>
              </div>
              <div className="pt-4 text-purple-700 text-xs font-semibold leading-none flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>재유통 원천제한 기술</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 rounded-2xl border bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200 transition duration-300 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm shadow-inner">
                  4단계
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug">에스크로 & 소유권 이전</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    구매 대금은 안심 에스크로가 경기장 입장까지 보류합니다. 그 과정에서 캡처본 중복 사용 사기를 방지하는 순환 동적 QR(OTP방식)을 실시간 발급합니다.
                  </p>
                </div>
              </div>
              <div className="pt-4 text-emerald-700 text-xs font-semibold leading-none flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" />
                <span>경기장 입장 시 정산완료</span>
              </div>
            </div>

          </div>
        </div>

        {/* Section 4 Escrow Active Tracker Container */}
        {activeListing ? (
          <div id="active-escrow-sandbox" className="space-y-3">
            <h3 className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              🎫 내 진행중인 에스크로 및 양도 검증 (동적 QR OTP 체험)
            </h3>
            <EscrowStepTracker 
              activeListing={activeListing} 
              onConfirmEntry={handleConfirmEntry} 
              onCanceled={handleCancelEscrow} 
            />
          </div>
        ) : (
          <div className="bg-slate-900/5 border border-slate-200/50 rounded-2xl p-5 text-center text-xs text-slate-500 font-semibold max-w-full leading-normal">
            💡 아래 <strong>양도 마켓플레이스</strong>에서 매력을 느끼는 사기 이력 보장 티켓의 <strong className="text-emerald-700">양도교섭 & 구매</strong> 버튼을 탭하십시오. 가상 에스크로 금고 보관과 모바일 입장용 순환 발신 QR 체험이 4단계 상생 영역에 안전하게 활성화됩니다.
          </div>
        )}

        {/* Real KBO Marketplace & Ticket Listings Grid */}
        <div id="marketplace-section" className="space-y-5">
          
          {/* Marketplace Title & Add Listing Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="space-y-1">
              <h3 className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-700" />
                정가 보장 상생 양도 마켓플레이스
              </h3>
              <p className="text-xs text-slate-500 leading-none">원래 구매 가격에 탄력 상한선이 자동으로 한계 설정된 안전 거래 목록</p>
            </div>
            
            <button
              type="button"
              onClick={() => {
                if (!verification.isVerified) {
                  addLog('[보안 제어] 티켓을 판매하시려면 본인 신분증 및 실명계좌 연동 인증이 선행되어야 합니다.', 'warn');
                  setIsVerifyOpen(true);
                  return;
                }
                setIsCreateOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold py-2.5 px-4 transition flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>내 보유 티켓 등록하기</span>
            </button>
          </div>

          {/* Matches Horizontal Segmented Filter Bar */}
          <div className="flex bg-white p-1.5 border border-slate-100 rounded-xl overflow-x-auto gap-1 shadow-sm scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedMatchFilter('all')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedMatchFilter === 'all'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              전체 경기 양도 정보
            </button>
            {KBO_MATCHES.map((m) => {
              const home = KBO_TEAMS[m.homeTeam]?.name || m.homeTeam;
              const away = KBO_TEAMS[m.awayTeam]?.name || m.awayTeam;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMatchFilter(m.id)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    selectedMatchFilter === m.id
                      ? 'bg-slate-950 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {KBO_TEAMS[m.homeTeam]?.emoji}{home} VS {away}{KBO_TEAMS[m.awayTeam]?.emoji}
                </button>
              );
            })}
          </div>

          {/* Listings Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredListings.length === 0 ? (
              <div className="col-span-full py-16 bg-white border border-slate-100 text-center rounded-2xl text-xs text-slate-400 font-bold italic">
                현재 선택된 경기에 올라온 안전 상생 양도 티켓 제안이 존재하지 않습니다.
              </div>
            ) : (
              filteredListings.map((ticket) => {
                const match = KBO_MATCHES.find((m) => m.id === ticket.matchId) || KBO_MATCHES[0];
                const home = KBO_TEAMS[match.homeTeam];
                const away = KBO_TEAMS[match.awayTeam];

                return (
                  <div
                    key={ticket.id}
                    className={`bg-white rounded-2xl border transition-all duration-300 transform ${
                      ticket.status === 'escrow'
                        ? 'border-emerald-500/40 bg-emerald-50/5 hover:shadow-emerald-100/50 scale-[1.005]'
                        : ticket.status === 'completed'
                          ? 'border-slate-200 opacity-65 bg-slate-50'
                          : 'border-slate-100 hover:border-emerald-500/30 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.015]'
                    } flex flex-col justify-between overflow-hidden shadow-sm`}
                  >
                    {/* Top Panel card header */}
                    <div className="p-5 border-b border-slate-100/60 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded leading-none">
                            {match.venue}
                          </span>
                          <span className="text-[10px] block font-semibold text-slate-400">{match.dateLabel} ({match.date})</span>
                        </div>
                        {ticket.status === 'available' ? (
                          <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full">
                            양도 가능 (안심)
                          </span>
                        ) : ticket.status === 'escrow' ? (
                          <span className="text-[10px] bg-sky-50 border border-sky-100 text-sky-800 font-extrabold px-2.5 py-1 rounded-full">
                            안심 에스크로 묶임
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 font-extrabold px-2.5 py-1 rounded-full">
                            정산 양도완료
                          </span>
                        )}
                      </div>

                      {/* Game VS Match Display */}
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 pt-1">
                        <span className="font-extrabold">{home?.emoji} {home?.name}</span>
                        <span className="text-[10px] text-slate-300">VS</span>
                        <span className="font-extrabold">{away?.name} {away?.emoji}</span>
                      </div>

                      {/* Seat details */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-500">지정정보</span>
                        <span className="font-extrabold text-slate-800 text-right">{ticket.seatInfo}</span>
                      </div>
                    </div>

                    {/* Bottom layout containing financial details and button */}
                    <div className="bg-slate-50/60 p-5 flex flex-col justify-between space-y-4">
                      
                      {/* Price cap calculation display */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-500 font-medium">정가: {ticket.originalPrice.toLocaleString()}원</span>
                          </div>
                          <div className="font-bold text-slate-900 text-sm mt-0.5">
                            양도가: <span className="text-emerald-700 font-extrabold">{ticket.askingPrice.toLocaleString()}</span> 원
                          </div>
                        </div>

                        {/* Gap and verification indicators */}
                        <div className="text-right space-y-1">
                          <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded border border-emerald-200 font-mono">
                            보전상한선 +{ticket.capPercentage}% 적용
                          </span>
                          <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-slate-400">
                            {ticket.sellerPhoneVerified && <span className="text-emerald-600">📱실명인증</span>}
                            <span>•</span>
                            {ticket.sellerBankVerified && <span className="text-emerald-600">🏦제휴은행</span>}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-2 border-t border-slate-200/50 pt-3">
                        <div className="text-[10px] text-slate-500 leading-tight">
                          판매자: <strong>{ticket.sellerName}</strong><br />
                          매너 평점 ★{ticket.sellerRating.toFixed(1)}
                        </div>

                        {ticket.status === 'available' ? (
                          <button
                            type="button"
                            onClick={() => handleBuyTicket(ticket.id)}
                            className="bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold py-2 px-3.5 transition"
                          >
                            안전 양도 교섭 / 구매
                          </button>
                        ) : ticket.status === 'escrow' ? (
                          <button
                            type="button"
                            disabled
                            className="bg-slate-200 text-slate-400 rounded-xl text-xs font-bold py-2 px-3.5 cursor-not-allowed"
                          >
                            에스크로 잠금
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="bg-slate-200 text-slate-400 rounded-xl text-xs font-bold py-2 px-3.5 cursor-not-allowed text-[10px]"
                          >
                            관람완료 (입장대금정산)
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Gemini AI Consulting Anti-Scalper Sandbox */}
        <div id="ai-consultant-section" className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-base tracking-tight text-slate-900">지능형 암표 방지 안전 센터 & 통합 봇 (Gemini AI Audit)</h3>
          </div>
          <AntiScalpConsultant 
            onSimulationLog={(msg, type) => addLog(`[AI봇] ${msg}`, type)} 
          />
        </div>

        {/* Footer Policy and Info */}
        <footer className="pt-8 border-t border-slate-200 text-center space-y-2">
          <div className="flex justify-center items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>KBO 프로야구 건강하고 활기찬 양도 문화를 선도합니다.</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal max-w-lg mx-auto">
            본 프로젝트는 대한민국 프로야구(KBO) 팬들의 공익을 대변하기 위해 개시된 상생 거래 시뮬레이션 환경입니다. 가격 상한제와 에스크로 기술의 이론적 조합을 통해 투명하고 공정한 거래 환경을 선도합니다.
          </p>
        </footer>

      </main>

      {/* Verification Dialog Modal */}
      <VerificationModal 
        isOpen={isVerifyOpen} 
        onClose={() => setIsVerifyOpen(false)} 
        onVerifyComplete={handleVerifyComplete} 
        currentVerification={verification} 
      />

      {/* Create Listing Dialog Modal */}
      <CreateListingModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onAddListing={handleAddListing} 
        isUserVerified={verification.isVerified} 
        onOpenVerify={() => setIsVerifyOpen(true)} 
      />

    </div>
  );
}
