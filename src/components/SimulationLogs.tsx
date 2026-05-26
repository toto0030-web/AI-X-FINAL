import React from 'react';
import { SimulationLog } from '../types';
import { Terminal, ShieldAlert, BadgeInfo, CheckCircle } from 'lucide-react';

interface SimulationLogsProps {
  logs: SimulationLog[];
  onClear: () => void;
}

export default function SimulationLogs({ logs, onClear }: SimulationLogsProps) {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[280px]">
      
      {/* Header */}
      <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-emerald-300">페어플레이 가동 백엔드 실시간 로그 (Anti-Scalp Enforcer Telemetry)</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-[10px] font-bold text-slate-500 hover:text-slate-300 transition"
        >
          로그 비우기
        </button>
      </div>

      {/* Logs Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 italic text-[11px]">
            대기 중... 마켓에서 본인인증, 가격캡 적용 등록, 혹은 에스크로 양도를 실행해보세요!
          </div>
        ) : (
          logs.map((log) => {
            let badgeBg = 'bg-slate-800 text-slate-300';
            let iconColor = 'text-slate-400';
            
            if (log.type === 'success') {
              badgeBg = 'bg-emerald-950/80 text-emerald-400 border border-emerald-900';
              iconColor = 'text-emerald-500';
            } else if (log.type === 'warn') {
              badgeBg = 'bg-amber-950/80 text-amber-400 border border-amber-900';
              iconColor = 'text-amber-500';
            } else if (log.type === 'error') {
              badgeBg = 'bg-rose-950/80 text-rose-400 border border-rose-900';
              iconColor = 'text-rose-500';
            } else {
              badgeBg = 'bg-blue-950/80 text-blue-400 border border-blue-900';
              iconColor = 'text-blue-500';
            }

            return (
              <div key={log.id} className="flex gap-2.5 items-start bg-slate-950/40 p-2 rounded-lg border border-slate-800/40">
                <span className="text-[10px] text-slate-500 shrink-0 font-medium pt-0.5">{log.timestamp}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold shrink-0 uppercase ${badgeBg}`}>
                  {log.type}
                </span>
                <span className="flex-1 text-slate-200">{log.message}</span>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
