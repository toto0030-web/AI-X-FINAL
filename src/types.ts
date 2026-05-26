export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

export type TicketStatus = 'available' | 'escrow' | 'completed' | 'canceled';

export interface KboMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string; // e.g., "오후 6시 30분"
  dateLabel: string; // e.g., "5월 28일 (수)"
  venue: string; // e.g., "잠실 경기장"
  homeLogo: string; // Tailwind color or emoji
  awayLogo: string;
  originalPrices: {
    outfield: number; // 외야석
    infield: number;  // 내야석
    table: number;   // 테이블석
  };
}

export interface TicketListing {
  id: string;
  matchId: string;
  sellerName: string;
  sellerRating: number; // 0-5
  sellerPhoneVerified: boolean;
  sellerBankVerified: boolean;
  seatInfo: string; // e.g., "3루 레드석 206블록 12열"
  seatCategory: 'outfield' | 'infield' | 'table';
  originalPrice: number;
  askingPrice: number;
  capPercentage: number; // e.g., 10, 15, 20
  status: TicketStatus;
  listedAt: string;
  purchasedBy?: string;
  escrowReleased: boolean;
  qrRotationsCount: number;
}

export interface UserVerification {
  isVerified: boolean;
  name: string;
  phone: string;
  bankName: string;
  accountNumber: string;
  theCheatChecked: boolean; // 더치트 연동 데이터 검증여부
  theCheatStatus: 'clean' | 'warning' | 'unread';
}

export interface SimulationLog {
  id: string;
  type: 'info' | 'success' | 'warn' | 'error';
  message: string;
  timestamp: string;
}
