import React, { useState, useEffect } from 'react';
import { TicketListing, KboMatch } from '../types';
import { KBO_TEAMS, KBO_MATCHES } from '../data';
import { ShieldCheck, Calendar, ArrowRight, MapPin, QrCode, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';

interface EscrowStepTrackerProps {
  activeListing: TicketListing;
  onConfirmEntry: (listingId: string) => void;
  onCanceled: () => void;
}

export default function EscrowStepTracker({ activeListing, onConfirmEntry, onCanceled }: EscrowStepTrackerProps) {
  const [dummyHash, setDummyHash] = useState('FP-8293-SAFE-92');
  const [countdown, setCountdown] = useState(10);
  const match = KBO_MATCHES.find(m => m.id === activeListing.matchId) || KBO_MATCHES[0];

  const homeTeam = KBO_TEAMS[match.homeTeam];
  const awayTeam = KBO_TEAMS[match.awayTeam];

  // Rotate QR hash code every 10 seconds to showcase real-time cryptographically secure ownership transfers
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeListing.status === 'escrow') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Generate mock security key
            const r1 = Math.floor(1000 + Math.random() * 9000);
            const r2 = Math.floor(1000 + Math.random() * 9000);
            setDummyHash(`FP-${r1}-ROTA-${r2}`);
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeListing.status]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
      
      {/* Ticket Details & Escrow Status Info */}
      <div className="p-6 flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-ping" />
            4단계: 안심 에스크로 보관중
          </span>
          <span className="text-xs font-semibold text-slate-500">거래 번호: TX-{activeListing.id.toUpperCase()}</span>
        </div>

        {/* Stadium Info Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-semibold">{match.dateLabel}</span>
            <span className="text-slate-500 font-semibold flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              {match.venue}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 py-2">
            <span className={`text-base font-extrabold ${homeTeam?.color} flex items-center gap-1`}>
              <span>{homeTeam?.emoji}</span> {homeTeam?.name}
            </span>
            <span className="text-xs font-bold text-slate-400">VS</span>
            <span className={`text-base font-extrabold ${awayTeam?.color} flex items-center gap-1`}>
              <span>{awayTeam?.emoji}</span> {awayTeam?.name}
            </span>
          </div>

          <div className="h-px bg-slate-200/60 my-1" />
          
          <div className="flex justify-between text-xs font-medium pt-1">
            <span className="text-slate-500">지정 구역</span>
            <span className="text-slate-800 font-bold">{activeListing.seatInfo}</span>
          </div>
        </div>

        {/* Flow Visualizer for Escrow logic */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700">에스크로 자금 흐름 모니터링</h4>
          
          <div className="relative flex justify-between text-[11px] font-semibold text-slate-500">
            {/* Step Bullet 1 */}
            <div className="flex flex-col items-center z-10">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
                1
              </div>
              <span className="mt-1 text-slate-800 font-bold">결제 완료</span>
              <span className="text-[9px] text-slate-400">구매자 송금</span>
            </div>

            {/* Connecting Bar */}
            <div className="absolute left-1/4 top-3 w-1/2 h-0.5 bg-emerald-500" />

            {/* Step Bullet 2 */}
            <div className="flex flex-col items-center z-10">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white animate-pulse">
                2
              </div>
              <span className="mt-1 text-emerald-700 font-bold">안전 금고 보관</span>
              <span className="text-[9px] text-emerald-500">플랫폼 홀딩</span>
            </div>

            {/* Step Bullet 3 */}
            <div className="flex flex-col items-center z-10">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs ring-4 ring-white">
                3
              </div>
              <span className="mt-1 text-slate-400">바코드 입장</span>
              <span className="text-[9px] text-slate-400">QR 자동 검증</span>
            </div>
          </div>

          {/* Details */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg text-[11px] leading-relaxed text-slate-600 space-y-1">
            <p className="font-bold text-emerald-950 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              에스크로 보호 안내 (D+0 신속 정산)
            </p>
            <p>
              현재 결제대금 <strong>{activeListing.askingPrice.toLocaleString()}원</strong>은 플랫폼의 에스크로 안전 가상 금고에 완벽하게 락업되어 있습니다. 해당 금액은 관람객의 물리적 입장이 확인되는 즉시 판매자에게 안전 정산 전달됩니다.
            </p>
          </div>
        </div>

      </div>

      {/* Rotating QR Codes (Prevention of duplicated usage) */}
      <div className="p-6 bg-slate-50 flex flex-col items-center justify-center text-center space-y-3 shrink-0 md:w-64 min-h-[300px]">
        {activeListing.status === 'escrow' ? (
          <>
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-slate-800 flex items-center justify-center gap-1">
                <QrCode className="w-4 h-4 text-emerald-700" />
                실시간 소유권 이전 QR
              </h4>
              <p className="text-[10px] text-slate-500 font-medium">캡쳐 방지용 동적 암호화 난수</p>
            </div>

            {/* Interactive QR representation */}
            <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-200 flex flex-col items-center space-y-2.5 relative group">
              <div className="w-32 h-32 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Visual grid representing the QR Code */}
                <div className="grid grid-cols-6 gap-1 w-24 h-24 max-w-full opacity-80">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-sm ${(i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 12 || i === 24 ? 'bg-slate-900' : 'bg-slate-200'}`} 
                    />
                  ))}
                </div>
                {/* Visual sweeping overlay with laser-glow utility */}
                <div className="absolute inset-x-0 h-1 bg-emerald-500 shadow-[0_0_10px_#10b981,_0_0_18px_#10b981] animate-scan top-0" />
              </div>
              
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md text-[10px] font-mono border border-slate-100 text-slate-700">
                <RefreshCw className="w-3 h-3 text-emerald-600 animate-spin" />
                <span>{dummyHash}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <RefreshCw className="w-3 h-3 text-emerald-600 animate-spin" />
              <span>다음 회전까지 {countdown}초 남음</span>
            </div>

            <div className="w-full pt-1.5 space-y-1.5">
              <button
                type="button"
                onClick={() => onConfirmEntry(activeListing.id)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-md shadow-slate-900/10 flex items-center justify-center gap-1"
              >
                <span>구장 입장 완료하기 (인증)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button 
                type="button"
                onClick={onCanceled}
                className="w-full py-1.5 text-[11px] text-rose-600 hover:text-rose-700 font-bold hover:bg-rose-50 rounded-lg transition"
              >
                거래 취소/에스크로 환불
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4 py-8 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800">정산 및 소유권 완전히 완료</h4>
              <p className="text-xs text-slate-400 mt-1">
                경기장 입장이 정상 완료되었습니다.<br />
                대금 정산이 마무리 되었습니다.
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
