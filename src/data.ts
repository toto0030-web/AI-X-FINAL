import { KboMatch, TicketListing } from './types';

export const KBO_TEAMS: Record<string, { name: string; color: string; emoji: string; bg: string }> = {
  LG: { name: 'LG 트윈스', color: 'text-red-700 md:text-red-700', bg: 'bg-red-50 text-red-700 border-red-200', emoji: '⚾️' },
  DOOSAN: { name: '두산 베어스', color: 'text-slate-900 md:text-slate-900', bg: 'bg-slate-50 text-slate-900 border-slate-200', emoji: '🐻' },
  KIA: { name: 'KIA 타이거즈', color: 'text-rose-600 md:text-rose-600', bg: 'bg-rose-50 text-rose-600 border-rose-200', emoji: '🐯' },
  SAMSUNG: { name: '삼성 라이온즈', color: 'text-blue-600 md:text-blue-600', bg: 'bg-blue-50 text-blue-600 border-blue-200', emoji: '🦁' },
  HANWHA: { name: '한화 이글스', color: 'text-orange-500 md:text-orange-500', bg: 'bg-orange-50 text-orange-500 border-orange-200', emoji: '🦅' },
  LOTTE: { name: '롯데 자이언츠', color: 'text-cyan-700 md:text-cyan-700', bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', emoji: '⚓️' },
  SSG: { name: 'SSG 랜더스', color: 'text-red-600 md:text-red-600', bg: 'bg-red-50 text-red-600 border-red-200', emoji: '🚀' },
  KIWOOM: { name: '키움 히어로즈', color: 'text-amber-800 md:text-amber-800', bg: 'bg-amber-50 text-amber-800 border-amber-200', emoji: '🦸' },
};

export const KBO_MATCHES: KboMatch[] = [
  {
    id: 'match-1',
    homeTeam: 'LG',
    awayTeam: 'DOOSAN',
    date: '18:30',
    dateLabel: '2026년 5월 28일 (목)',
    venue: '서울 잠실 야구장',
    homeLogo: '⚾️',
    awayLogo: '🐻',
    originalPrices: {
      outfield: 15000,
      infield: 25000,
      table: 45000,
    }
  },
  {
    id: 'match-2',
    homeTeam: 'KIA',
    awayTeam: 'SAMSUNG',
    date: '18:30',
    dateLabel: '2026년 5월 29일 (금)',
    venue: '광주 기아 챔피언스 필드',
    homeLogo: '🐯',
    awayLogo: '🦁',
    originalPrices: {
      outfield: 14000,
      infield: 23000,
      table: 40000,
    }
  },
  {
    id: 'match-3',
    homeTeam: 'HANWHA',
    awayTeam: 'LOTTE',
    date: '17:00',
    dateLabel: '2026년 5월 30일 (토)',
    venue: '대전 한화생명 이글스파크',
    homeLogo: '🦅',
    awayLogo: '⚓️',
    originalPrices: {
      outfield: 13000,
      infield: 22000,
      table: 38000,
    }
  },
  {
    id: 'match-4',
    homeTeam: 'SSG',
    awayTeam: 'KIWOOM',
    date: '14:00',
    dateLabel: '2026년 5월 31일 (일)',
    venue: '인천 SSG 랜더스필드',
    homeLogo: '🚀',
    awayLogo: '🦸',
    originalPrices: {
      outfield: 12000,
      infield: 20000,
      table: 35000,
    }
  }
];

export const INITIAL_LISTINGS: TicketListing[] = [
  {
    id: 'list-1',
    matchId: 'match-1',
    sellerName: '최강두산베어스인',
    sellerRating: 4.8,
    sellerPhoneVerified: true,
    sellerBankVerified: true,
    seatInfo: '3루 블루석 106블록 12열 14번',
    seatCategory: 'infield',
    originalPrice: 25000,
    askingPrice: 27500, // +10%
    capPercentage: 10,
    status: 'available',
    listedAt: '2시간 전',
    qrRotationsCount: 0,
    escrowReleased: false,
  },
  {
    id: 'list-2',
    matchId: 'match-1',
    sellerName: 'LG엘린이출신',
    sellerRating: 4.9,
    sellerPhoneVerified: true,
    sellerBankVerified: true,
    seatInfo: '1루 외야그린석 417블록 5열 7번',
    seatCategory: 'outfield',
    originalPrice: 15000,
    askingPrice: 16500, // +10%
    capPercentage: 10,
    status: 'available',
    listedAt: '1시간 전',
    qrRotationsCount: 0,
    escrowReleased: false,
  },
  {
    id: 'list-3',
    matchId: 'match-2',
    sellerName: '광주호랑이99',
    sellerRating: 4.7,
    sellerPhoneVerified: true,
    sellerBankVerified: true,
    seatInfo: '3루 K9구역 10열 3번',
    seatCategory: 'infield',
    originalPrice: 23000,
    askingPrice: 26400, // +15% (Strict demand pricing cap)
    capPercentage: 15,
    status: 'available',
    listedAt: '3시간 전',
    qrRotationsCount: 0,
    escrowReleased: false,
  },
  {
    id: 'list-4',
    matchId: 'match-3',
    sellerName: '한화중독자',
    sellerRating: 4.6,
    sellerPhoneVerified: true,
    sellerBankVerified: true,
    seatInfo: '포수후면 중앙테이블석 101구역 C열',
    seatCategory: 'table',
    originalPrice: 38000,
    askingPrice: 45600, // +20% (Max allowed price cap)
    capPercentage: 20,
    status: 'available',
    listedAt: '30분 전',
    qrRotationsCount: 0,
    escrowReleased: false,
  },
];
