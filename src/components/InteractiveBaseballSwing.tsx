import React, { useState } from 'react';
import { Sparkles, Trophy, Zap, ShieldAlert, RotateCcw } from 'lucide-react';

interface TargetItem {
  id: number;
  label: string;
  type: 'scalping' | 'macro' | 'scam';
  status: 'active' | 'destroyed';
  description: string;
}

export default function InteractiveBaseballSwing() {
  const [isSwinging, setIsSwinging] = useState(false);
  const [swingResult, setSwingResult] = useState<string>('대기 중. 배트를 휘둘러 암표상을 저격하세요!');
  const [successCount, setSuccessCount] = useState(0);
  const [missCount, setMissCount] = useState(0);

  // Ball trajectory and styling triggers
  const [ballState, setBallState] = useState<{
    x: number;
    y: number;
    scale: number;
    opacity: number;
    rotation: number;
    hasHit: boolean;
  }>({
    x: 0,
    y: 120,
    scale: 1,
    opacity: 1,
    rotation: 0,
    hasHit: false,
  });

  // Target structures
  const [targets, setTargets] = useState<TargetItem[]>([
    { id: 1, label: '매크로 암표 수집기', type: 'macro', status: 'active', description: '티켓 파이프라인 자동 수수료 차익 봇' },
    { id: 2, label: '인스타그램 중복 QR 사기', type: 'scam', status: 'active', description: '동일 캡처화면 다중 판매 사기' },
    { id: 3, label: '외야석 5배 가격 바가지', type: 'scalping', status: 'active', description: '원가 양도 가이드라인 이탈 거품가' },
    { id: 4, label: '계좌 사칭 사기꾼 거래', type: 'scam', status: 'active', description: '더치트 모니터링 이력이 있는 불법 거래자' },
  ]);

  const handleSwing = () => {
    if (isSwinging) return;
    setIsSwinging(true);
    setSwingResult('피칭 머신 가동! 볼이 들어옵니다... ⚾️');

    // 1. Move ball slightly down/zoom to home plate
    setBallState({
      x: 30,
      y: 80,
      scale: 1.3,
      opacity: 1,
      rotation: 90,
      hasHit: false,
    });

    // 2. Swing bat animation trigger & Hit collision at 400ms
    setTimeout(() => {
      // Find a target to "destroy"
      const activeTargets = targets.filter(t => t.status === 'active');
      const isHitSuccess = activeTargets.length > 0 && Math.random() > 0.15; // 85% success chance for satisfying gameplay

      if (isHitSuccess) {
        // Destroy target
        const targetToDestroy = activeTargets[Math.floor(Math.random() * activeTargets.length)];
        
        setTargets(prev => prev.map(t => t.id === targetToDestroy.id ? { ...t, status: 'destroyed' } : t));
        setSuccessCount(prev => prev + 1);

        // Fly the ball towards top left outer space (visual Home run)
        setBallState({
          x: -180,
          y: -150,
          scale: 0.3,
          opacity: 0.9,
          rotation: 720,
          hasHit: true,
        });

        const quotes = [
          `정면 돌파! [${targetToDestroy.label}] 격파! 145m 시원한 비거리의 장외 홈런!! 🎇`,
          `깡! 소리와 함께 [${targetToDestroy.label}] 통쾌하게 날아갑니다! 클린 상생 적중 완료! ⚾️`,
          `그대로 담장을 넘깁니다! [${targetToDestroy.label}] 퇴치 완료! 야구문화가 건강해집니다!`
        ];
        setSwingResult(quotes[Math.floor(Math.random() * quotes.length)]);
      } else {
        // Visual Miss / Strike
        setMissCount(prev => prev + 1);
        setBallState({
          x: 150,
          y: 200,
          scale: 0.5,
          opacity: 0,
          rotation: 180,
          hasHit: false,
        });
        setSwingResult('헛스윙 삼진 아웃! 3구 삼진으로 투수의 완벽한 변화구 투구였습니다. 다시 시도하십시오!');
      }

      // Reset swing state to click again after animation completes
      setTimeout(() => {
        setIsSwinging(false);
      }, 1000);

    }, 500);
  };

  const resetGame = () => {
    setTargets(prev => prev.map(t => ({ ...t, status: 'active' })));
    setSuccessCount(0);
    setMissCount(0);
    setBallState({
      x: 0,
      y: 120,
      scale: 1,
      opacity: 1,
      rotation: 0,
      hasHit: false,
    });
    setSwingResult('새로운 이닝이 시작되었습니다! 배트를 꼬아 전력을 다하세요!');
  };

  return (
    <div className="bg-slate-950 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 rounded-2xl p-5 border border-emerald-500/20 shadow-xl text-white relative overflow-hidden">
      {/* Stadium Grid Overlay */}
      <div className="absolute inset-0 stadium-grid pointer-events-none opacity-40 z-0" />
      
      {/* Decorative Lights overlay representing Stadium light tower */}
      <div className="absolute top-2 right-4 flex gap-1 bg-black/40 px-2 py-1.5 rounded-md border border-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse [animation-delay:0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse [animation-delay:0.6s]" />
        <span className="text-[9px] text-emerald-300 font-bold font-mono">LIVE STADIUM LIGHT</span>
      </div>

      <div className="space-y-4">
        {/* Title Badge block */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 font-mono">
              FairPlay Swing Training
            </h4>
          </div>
          <h3 className="text-sm font-extrabold text-white">
            실시간 KBO 암표 격파 스윙 존 (체험하기)
          </h3>
          <p className="text-[11px] text-emerald-100/70 leading-relaxed">
            암표 매크로와 중복 거래 사기를 과녁삼아 홈런을 터뜨려보세요. 깡! 소리 소유권 에스크로 이전과 탄력 상한율의 원리를 상기시킵니다.
          </p>
        </div>

        {/* Dynamic visual simulator screen area */}
        <div className="relative h-48 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
          
          {/* Pitching mound grid and batting plate backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.15)_1.2px,transparent_1.2px)] bg-[size:16px_16px]" />
          <div className="absolute bottom-0 w-24 h-12 bg-emerald-950/40 rounded-t-full border-t border-emerald-500/10 pointer-events-none" />
          
          {/* Target List Items floating inside simulator */}
          <div className="absolute top-3 left-3 right-3 grid grid-cols-2 gap-1.5 z-10 pointer-events-none">
            {targets.map(t => (
              <div 
                key={t.id} 
                className={`py-1 px-2 rounded-lg text-[9px] font-bold border transition-all duration-500 ${
                  t.status === 'destroyed'
                    ? 'bg-rose-950/40 border-rose-900/30 text-rose-500 line-through scale-90 opacity-40'
                    : 'bg-emerald-950/50 border-emerald-500/20 text-emerald-300 animate-pulse'
                }`}
              >
                🎯 {t.label} {t.status === 'destroyed' ? '• OUT' : ''}
              </div>
            ))}
          </div>

          {/* Interactive animated Baseball Bat */}
          <div 
            className={`absolute bottom-4 right-12 z-20 origin-bottom-right transition-transform duration-300 pointer-events-none ${
              isSwinging ? '-rotate-120 scale-110' : '-rotate-12 hover:-rotate-15'
            }`}
          >
            <div className="relative">
              {/* Bat cylinder gradient mockup */}
              <div className="w-3 h-20 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700/80 rounded-full border border-amber-500/30 shadow-md flex items-end justify-center">
                <div className="w-3.5 h-6 bg-slate-900 rounded-b-full opacity-60" /> {/* Grip tape handle */}
              </div>
              
              {/* Swing sweep dust trail */}
              {isSwinging && (
                <div className="absolute -left-10 bottom-4 w-12 h-12 rounded-full swing-trail animate-ping opacity-40" />
              )}
            </div>
          </div>

          {/* Live trajectory-linked Baseball ball shape */}
          <div 
            className="absolute z-30 transition-all duration-300 ease-out flex items-center justify-center font-bold"
            style={{
              transform: `translate(${ballState.x}px, ${ballState.y}px) scale(${ballState.scale})`,
              opacity: ballState.opacity,
            }}
          >
            {/* Spinning Seams detailed baseball model */}
            <div className="relative w-8 h-8 rounded-full bg-white border border-slate-350 shadow-lg flex items-center justify-center overflow-hidden baseball-spin">
              {/* Left Stitch curve */}
              <div className="absolute left-1 top-0 bottom-0 w-3 border-r border-dashed border-rose-500/65 rounded-full pointer-events-none" />
              {/* Right Stitch curve */}
              <div className="absolute right-1 top-0 bottom-0 w-3 border-l border-dashed border-rose-500/65 rounded-full pointer-events-none" />
              <span className="text-[8px] text-slate-800 font-mono font-bold font-sans">KBO</span>
            </div>
          </div>

          {/* Dynamic Hit Particle Sparks */}
          {ballState.hasHit && (
            <div className="absolute top-1/2 left-1/3 z-40 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <div className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-1 rounded-full animate-bounce neon-glow border border-white">
                CRACK! 💥
              </div>
            </div>
          )}

          {/* Stadium fence indicator line */}
          <div className="absolute top-1/3 left-0 right-0 h-px border-t border-slate-800/80 border-dashed" />
        </div>

        {/* Live Result Log view */}
        <div className="bg-black/50 border border-emerald-500/10 rounded-xl p-3 text-center space-y-1 font-sans">
          <div className="text-[11px] font-bold text-slate-300 leading-normal">
            {swingResult}
          </div>
        </div>

        {/* Controller panel with Scoreboard */}
        <div className="flex items-center justify-between gap-3 text-xs">
          
          <div className="flex gap-4 font-mono font-bold bg-slate-900/60 py-2 px-3.5 rounded-xl border border-white/5">
            <div className="text-emerald-400">
              HOME RUN HITS: <span className="text-white text-sm">{successCount}</span>
            </div>
            <div className="text-yellow-500">
              OUT/MISS: <span className="text-white text-sm">{missCount}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSwing}
              disabled={isSwinging}
              className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all duration-200 shadow-md ${
                isSwinging 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:scale-105 active:scale-95'
              }`}
            >
              ⚾️ 배트 스윙하기!
            </button>
            <button
              type="button"
              onClick={resetGame}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-slate-300"
              title="게임 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
