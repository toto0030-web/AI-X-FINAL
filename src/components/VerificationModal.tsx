import React, { useState, useEffect } from 'react';
import { ShieldCheck, Smartphone, Check, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { UserVerification } from '../types';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifyComplete: (data: UserVerification) => void;
  currentVerification: UserVerification;
}

export default function VerificationModal({ isOpen, onClose, onVerifyComplete, currentVerification }: VerificationModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // SMS verification vs Bank verification vs Final Check
  const [name, setName] = useState(currentVerification.name || '');
  const [residentFront, setResidentFront] = useState('');
  const [residentBack, setResidentBack] = useState('');
  const [phone, setPhone] = useState(currentVerification.phone || '');
  const [carrier, setCarrier] = useState('SKT');
  const [smsSent, setSmsSent] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [smsTimer, setSmsTimer] = useState(180);
  const [isSmsVerified, setIsSmsVerified] = useState(false);

  const [bankName, setBankName] = useState(currentVerification.bankName || '신한은행');
  const [accountNumber, setAccountNumber] = useState(currentVerification.accountNumber || '');
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [theCheatChecking, setTheCheatChecking] = useState(false);
  const [theCheatChecked, setTheCheatChecked] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (smsSent && smsTimer > 0 && !isSmsVerified) {
      timer = setTimeout(() => setSmsTimer(smsTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [smsSent, smsTimer, isSmsVerified]);

  if (!isOpen) return null;

  const handleSendSms = () => {
    if (!phone || phone.length < 10) {
      alert("올바른 전화번호를 입력해주세요.");
      return;
    }
    setSmsSent(true);
    setSmsTimer(180);
    // Auto populate mock verification code
    setTimeout(() => {
      setSmsCode('8429');
    }, 1500);
  };

  const handleVerifySms = () => {
    if (smsCode === '8429') {
      setIsSmsVerified(true);
      setStep(2);
    } else {
      alert("인증번호가 일치하지 않습니다. (테스트 번호: 8429)");
    }
  };

  const verifyBankTransfer = () => {
    if (!accountNumber || accountNumber.length < 8) {
      alert("정확한 계좌번호를 입력해주세요.");
      return;
    }
    setTheCheatChecking(true);
    // Simulate Dutchit DB validation (No blacklisted fraud records)
    setTimeout(() => {
      setTheCheatChecking(false);
      setIsAccountVerified(true);
      setTheCheatChecked(true);
      setStep(3);
    }, 2000);
  };

  const handleComplete = () => {
    const finalData: UserVerification = {
      isVerified: true,
      name: name || '홍길동',
      phone: phone || '010-1234-5678',
      bankName: bankName,
      accountNumber: accountNumber,
      theCheatChecked: true,
      theCheatStatus: 'clean',
    };
    onVerifyComplete(finalData);
    onClose();
  };

  return (
    <div id="verif-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div id="verif-modal-card" className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-5 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-100" />
          <div>
            <h3 className="font-bold text-lg leading-tight">페어플레이 암표차단 인증</h3>
            <p className="text-xs text-emerald-100/80">실명인증 + 계좌 연동을 통한 다회 및 매크로 계정 원천 차단</p>
          </div>
        </div>

        {/* Dynamic Step Progression Bar */}
        <div className="flex bg-slate-50 border-b border-slate-100 px-6 py-3 text-xs font-semibold text-slate-500 justify-between items-center">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-emerald-700 font-bold' : ''}`}>
            <span>1. 휴대폰 인증</span>
            {isSmsVerified && <Check className="w-3.5 h-3.5 text-emerald-600" />}
          </div>
          <div className="h-px bg-slate-200 flex-1 mx-3" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-emerald-700 font-bold' : ''}`}>
            <span>2. 계좌 & 더치트 검증</span>
            {isAccountVerified && <Check className="w-3.5 h-3.5 text-emerald-600" />}
          </div>
          <div className="h-px bg-slate-200 flex-1 mx-3" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-700 font-bold' : ''}`}>
            <span>3. 발급 완료</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl text-xs leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  매크로 및 전문 업자의 대량 양도를 방지하기 위해 <strong>1인당 하나의 통신본인 휴대폰</strong>만 등록 가능합니다. 인증번호는 아래 예제 코드로 제공됩니다.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">이름 (실명)</label>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-emerald-600 font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">주민등록번호 (앞 6자리 + 뒤 1째자리)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="950526"
                    className="w-1/2 text-sm text-center px-3.5 py-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-emerald-600 font-mono tracking-widest"
                    value={residentFront}
                    onChange={(e) => setResidentFront(e.target.value.replace(/\D/g, ''))}
                  />
                  <span className="text-slate-400">-</span>
                  <div className="w-1/2 flex items-center gap-1">
                    <input
                      type="text"
                      maxLength={1}
                      placeholder="1"
                      className="w-10 text-sm text-center px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-emerald-600 font-mono"
                      value={residentBack}
                      onChange={(e) => setResidentBack(e.target.value.replace(/\D/g, ''))}
                    />
                    <span className="text-slate-300 font-mono text-sm">••••••</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">통신사 선택 및 휴대폰 번호</label>
                <div className="flex gap-1.5 mb-2">
                  {['SKT', 'KT', 'LGU+', '알뜰폰'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`flex-1 text-xs py-2 rounded-lg font-bold border transition ${
                        carrier === c
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                      onClick={() => setCarrier(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="01012345678 (- 없이)"
                    className="flex-1 text-sm px-3.5 py-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-emerald-600 font-mono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    disabled={smsSent}
                  />
                  <button
                    type="button"
                    onClick={handleSendSms}
                    className="px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
                  >
                    {smsSent ? '재발송' : '인증요청'}
                  </button>
                </div>
              </div>

              {smsSent && (
                <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 animation-fade-in space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-slate-700">SMS 인증번호</label>
                    <span className="text-xs font-semibold font-mono text-rose-500">
                      {Math.floor(smsTimer / 60)}:{(smsTimer % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="인증번호 4자리 입력"
                      className="flex-1 text-sm text-center tracking-widest font-bold px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-emerald-600"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleVerifySms}
                      className="px-5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
                    >
                      확인
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal text-center">
                    📢 실시간 테스트 모드: 문자가 자동 발송되었습니다. 입력창에 <strong>8429</strong>가 채워졌거나 일치해야 넘어갑니다.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">본인확인 완료</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{name} ({carrier} • {phone})</p>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-xs text-rose-800">
                <span className="font-bold">더치트(The Cheat) 실시간 1초 검증체계 연동</span>
                <p className="mt-1 leading-relaxed text-slate-600">
                  안전한 계좌와 연동되어 사기 이력이 있는지 콤팩트하게 상호 크로스체크합니다. 명의 불일치 및 불건전 사기 유저는 플랫폼 진입 자체가 엄격히 금지됩니다.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">실명 명의 은행 선택</label>
                <select
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-600 font-semibold text-slate-700"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                >
                  <option value="신한은행">신한은행</option>
                  <option value="국민은행">KB국민은행</option>
                  <option value="우리은행">우리은행</option>
                  <option value="하나은행">하나은행</option>
                  <option value="농협은행">NH농협은행</option>
                  <option value="카카오뱅크">카카오뱅크</option>
                  <option value="토스뱅크">토스뱅크</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">실명 계좌 번호 (- 없이)</label>
                <input
                  type="text"
                  placeholder="예: 11048291024"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-emerald-600 font-mono font-medium"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <button
                type="button"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition flex justify-center items-center gap-2 shadow-md shadow-emerald-700/10"
                onClick={verifyBankTransfer}
                disabled={theCheatChecking}
              >
                {theCheatChecking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>더치트 사기이력 신속 분석 중...</span>
                  </>
                ) : (
                  <span>실명 계좌 & 사기 이력 검증하기</span>
                )}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6 space-y-5">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-50 text-emerald-600 flex items-center justify-center anim-bounce">
                  <ShieldCheck className="w-9 h-9" />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xl text-slate-800">페어플레이 암표방지 지장 획득!</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  인증 완료일자: {new Date().toLocaleDateString()}<br />
                  네트워크 상생 규정 및 1인 계정 다회 매크로 제재 준수 동의
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left text-xs font-semibold text-slate-600 max-w-sm mx-auto space-y-2">
                <div className="flex justify-between">
                  <span>유저 성명</span>
                  <span className="text-slate-800">{name || '홍길동'}</span>
                </div>
                <div className="flex justify-between">
                  <span>전화번호</span>
                  <span className="text-slate-800">{phone || '010-1234-5678'}</span>
                </div>
                <div className="flex justify-between">
                  <span>거래 안심 계좌</span>
                  <span className="text-slate-800">{bankName} ({accountNumber})</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200">
                  <span className="text-emerald-700 flex items-center gap-1">
                    🟢 더치트 안전 연동상태
                  </span>
                  <span className="text-emerald-700 text-right">클린 (무사고 이력 보장)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleComplete}
                className="px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition"
              >
                상생 마켓 바로가기
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
}
