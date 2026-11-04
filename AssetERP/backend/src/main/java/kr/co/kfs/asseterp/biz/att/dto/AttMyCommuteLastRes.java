package kr.co.kfs.asseterp.biz.att.dto;

/** 마지막 출퇴근 + 회사 근태 설정 (MainFrame.checkCommute · Att02_Lookup_Commute.getLastInfo가 함께 쓴다). last는 기록이 없으면 null */
public record AttMyCommuteLastRes(boolean popupYn, boolean lockYn, AttMyCommuteRes last) {
}
