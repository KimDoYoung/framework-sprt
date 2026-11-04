/** 알림 창의 건수 (AS-IS Frm01_ListModel cnt1~cnt5): 미결재건·체크리스트·공지사항·알림함·매매승인 */
export interface FrmNoticeCnt {
  cnt1: number;
  cnt2: number;
  cnt3: number;
  cnt4: number;
  cnt5: number;
}

/** 미결재건 창 한 행 (AS-IS Apr01_ApprModel 중 regDate·title·regEmpName — EE56) */
export interface FrmOutstanding {
  apprId: number;
  regDate: string;
  title: string;
  regEmpName: string;
}

/** 알림함 한 행 (AS-IS Sms10_AlarmHistoryModel — EE57). sendTimeStr = 'YYYY-MM-DD HH:mm:ss' */
export interface FrmAlarmHistory {
  alarmHistoryId: number;
  sendTimeStr: string;
  targetPersonName: string;
  content: string;
  sendYn: boolean;
}

/** 실시간 접속현황 한 행 (AS-IS Sys28_LoginRealTimeModel — EE58) */
export interface FrmLoginRealTime {
  loginRealTimeId: number;
  loginTimeStr: string;
  ipAddress: string;
}
