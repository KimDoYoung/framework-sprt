package kr.co.kfs.asseterp.biz.kfs.dto;

/** 리모트뷰 사용기록 저장 한 행 (AS-IS kfs.Kfs01_RemoteView.update) — 화면이 고치는 업무내용·관리자확인만 */
public record RemoteViewSaveReq(Long remoteViewId, String reason, Boolean managerYn) {
}
