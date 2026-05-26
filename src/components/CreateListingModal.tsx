import React, { useState, useEffect } from 'react';
import { KboMatch, TicketListing } from '../types';
import { KBO_MATCHES, KBO_TEAMS } from '../data';
import { AlertCircle, Plus, Info, Scale, Check } from 'lucide-react';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (listing: Omit<TicketListing, 'id' | 'sellerName' | 'sellerRating' | 'sellerPhoneVerified' | 'sellerBankVerified' | 'status' | 'listedAt' | 'qrRotationsCount'>) => void;
  isUserVerified: boolean;
  onOpenVerify: () => void;
}

export default function CreateListingModal({ isOpen, onClose, onAddListing, isUserVerified, onOpenVerify }: CreateListingModalProps) {
  const [selectedMatchId, setSelectedMatchId] = useState(KBO_MATCHES[0].id);
  const [seatCategory, setSeatCategory] = useState<'outfield' | 'infield' | 'table'>('infield');
  const [seatInfo, setSeatInfo] = useState('');
  const [originalPrice, setOriginalPrice] = useState<number>(20000);
  const [askingPrice, setAskingPrice] = useState<number>(22000);
  const [capPercentage, setCapPercentage] = useState<number>(10);

  const selectedMatch = KBO_MATCHES.find(m => m.id === selectedMatchId) || KBO_MATCHES[0];

  // Base caps based on seat types: Outfield (10%), Infield (15%), Table (20% maximum)
  useEffect(() => {
    let cap = 15;
    if (seatCategory === 'outfield') cap = 10;
    if (seatCategory === 'table') cap = 20;
    
    setCapPercentage(cap);
    
    // Auto-update match price matching our dataset
    const price = selectedMatch.originalPrices[seatCategory];
    setOriginalPrice(price);
    
    // Default safe listing (+10% value)
    setAskingPrice(Math.round(price * (1 + cap / 100)));
  }, [seatCategory, selectedMatchId]);

  if (!isOpen) return null;

  const maxPrice = Math.round(originalPrice * (1 + capPercentage / 100));
  const isOverCap = askingPrice > maxPrice;

  // Let's calculate the profit scalpers think they can make
  const premiumPercent = ((askingPrice - originalPrice) / originalPrice) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserVerified) {
      alert("티켓을 판매(양도)하시려면 실명 및 계좌 본인인증(1단계)을 완료해야 합니다.");
      onOpenVerify();
      return;
    }
    if (!seatInfo) {
      alert("좌석 상세 정보를 입력해주세요.");
      return;
    }
    if (isOverCap) {
      alert(`⚠️ 티켓 거래 상한선인 ${maxPrice.toLocaleString()}원 (+${capPercentage}%)을 초과할 수 없습니다. 암표 마진 차단을 위한 상생 제정입니다.`);
      return;
    }

    onAddListing({
      matchId: selectedMatchId,
      seatInfo: seatInfo,
      seatCategory: seatCategory,
      originalPrice: originalPrice,
      askingPrice: askingPrice,
      capPercentage: capPercentage,
      escrowReleased: false,
    });
    onClose();
    
    // Reset state
    setSeatInfo('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Plus className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">건강한 양도 티켓 등록</h3>
            <p className="text-xs text-slate-400">탄력적 상한제 자동 적용 및 암표 마진 원천 배제</p>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {!isUserVerified && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs space-y-2 flex flex-col items-start">
              <span className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                ⚠️ 미인증 상태입니다
              </span>
              <p className="text-slate-600 leading-relaxed">
                다회 매크로 업자의 차단 및 불량 계정 관리를 위해 스마트 실명 및 1인 계좌인증 후 즉시 등록할 수 있습니다.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVerify();
                }}
                className="mt-1 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition text-[11px]"
              >
                1초 휴대폰/계좌 본인인증하기
              </button>
            </div>
          )}

          {/* Match Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">대상 매치 선택</label>
            <select
              className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-slate-900 font-semibold text-slate-800"
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(e.target.value)}
            >
              {KBO_MATCHES.map((m) => {
                const home = KBO_TEAMS[m.homeTeam]?.name || m.homeTeam;
                const away = KBO_TEAMS[m.awayTeam]?.name || m.awayTeam;
                return (
                  <option key={m.id} value={m.id}>
                    {m.dateLabel} - {home} vs {away} ({m.venue})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Seat Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">구역 등급</label>
              <div className="relative">
                <select
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-slate-900 font-semibold text-slate-800"
                  value={seatCategory}
                  onChange={(e) => setSeatCategory(e.target.value as any)}
                >
                  <option value="infield">내야석 (상한 +15%)</option>
                  <option value="outfield">외야석 (상한 +10%)</option>
                  <option value="table">테이블석 (상한 +20%)</option>
                </select>
              </div>
            </div>

            {/* Seat Info */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">상세 좌석 정보</label>
              <input
                type="text"
                placeholder="예: 3루 오렌지석 206블록 A열"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-slate-900 font-medium"
                value={seatInfo}
                onChange={(e) => setSeatInfo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          {/* Pricing Config with Elastic Cap Enforcer */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">정가 (원래 구매 가격)</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full text-sm font-bold text-slate-500 bg-slate-100 px-3.5 py-2.5 rounded-lg border border-slate-200"
                  value={`${originalPrice.toLocaleString()} 원`}
                  disabled
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">고정</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">양도 제안 가격</label>
                <span className={`text-[11px] font-bold ${isOverCap ? 'text-rose-600' : 'text-emerald-700'}`}>
                  (상한: {maxPrice.toLocaleString()}원)
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  className={`w-full text-sm font-bold px-3.5 py-2.5 rounded-lg border focus:outline-none transition ${
                    isOverCap
                      ? 'border-rose-400 bg-rose-50 text-rose-800 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 bg-emerald-50/20 text-emerald-950 focus:border-emerald-600'
                  }`}
                  value={askingPrice || ''}
                  onChange={(e) => setAskingPrice(Number(e.target.value))}
                />
                <span className="absolute right-9 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">원</span>
              </div>
            </div>
          </div>

          {/* Realtime Analytical Sandbox widget */}
          <div className={`p-4 rounded-xl border transition duration-300 ${
            isOverCap 
              ? 'bg-rose-50 border-rose-200 text-rose-900' 
              : premiumPercent <= 0 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-900'
                : 'bg-slate-50 border-slate-100 text-slate-800'
          }`}>
            <div className="flex items-start gap-2.5">
              <Scale className={`w-4 h-4 shrink-0 mt-0.5 ${isOverCap ? 'text-rose-600' : 'text-emerald-700'}`} />
              <div className="text-xs space-y-1.5 flex-1">
                <div className="flex justify-between font-bold">
                  <span>탄력적 상한제 자동 필터 결과:</span>
                  <span className={isOverCap ? 'text-rose-600 font-extrabold' : 'text-emerald-700'}>
                    {isOverCap ? '❌ 등록 차단됨' : '✅ 등록 가능 (안전)'}
                  </span>
                </div>
                
                <p className="leading-relaxed text-slate-600">
                  {isOverCap ? (
                    <>
                      야구팬 상생 가이드라인에 의거하여 현재 설정 등급({seatCategory === 'infield' ? '내야석' : seatCategory === 'outfield' ? '외야석' : '테이블석'})의 <strong>상한비율(+{capPercentage}%)</strong>을 초과하여 등록이 불가능합니다. 티켓가격을 <strong>{maxPrice.toLocaleString()}원</strong> 이하로 조율해주세요.
                    </>
                  ) : (
                    <>
                      설정가 {askingPrice.toLocaleString()}원은 정가 대비 약 <strong>+{premiumPercent.toFixed(1)}%</strong> 수준의 탄력적 보전입니다. 물가상승분/수수료 범주의 합리적인 양도로 판단되어 야구 팬 상생 마켓에 노출될 수 있습니다.
                    </>
                  )}
                </p>

                <div className="pt-2 flex justify-between text-[11px] border-t border-slate-200/60 font-semibold">
                  <span className="text-slate-500">불법 고농도 상업 마진 최소화</span>
                  <span className={isOverCap ? 'text-rose-600' : 'text-emerald-700'}>
                    차이액: {(askingPrice - originalPrice).toLocaleString()} 원
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scalping Prohibited Rules explanation */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex gap-2.5 text-[11px] leading-relaxed text-slate-500">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              <strong>💡 왜 가격 상한선이 존재하나요?</strong><br />
              원가resale은 실 거래 매칭이 매우 저하되는 부작용을 낳습니다. 양도자에게 최소한의 소액 기회 비용을 확보해주되(+10%~20%), 대용량 전문 업자에게는 <strong>"수수료 나르고 나면 수익이 전혀 발생하지 않아 알아서 포기하도록 만드는"</strong> 상생 게임 이론 모델링의 실질적 핵심 로직입니다.
            </p>
          </div>

        </form>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition"
          >
            취소
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`px-5 py-2 text-xs font-bold text-white rounded-lg transition ${
              isOverCap 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
            disabled={isOverCap}
          >
            양도 티켓 제안 올리기
          </button>
        </div>

      </div>
    </div>
  );
}
