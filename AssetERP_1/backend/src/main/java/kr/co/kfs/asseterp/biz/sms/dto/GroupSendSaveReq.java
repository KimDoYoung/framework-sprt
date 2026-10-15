package kr.co.kfs.asseterp.biz.sms.dto;

/** Sms03_Edit_GroupSend 저장 — 화면이 바꾸는 열은 제목·내용·비고뿐 (groupSendId ≤ 0·null이면 새 행) */
public record GroupSendSaveReq(Long groupSendId, String title, String content, String note) {
}
