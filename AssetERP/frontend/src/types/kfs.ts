/** 리모트뷰 사용기록 한 행 (AS-IS Kfs01_RemoteViewModel — Kfs01_Tab_RemoteView #1334). 날짜는 yyyy-MM-dd */
export interface RemoteView {
  remoteViewId: number;
  personName?: string | null;
  date?: string | null;
  startTime?: string | null;
  closeTime?: string | null;
  reason?: string | null;
  managerYn?: boolean | null;
}
