package kr.co.kfs.asseterp.biz.apr.dto;

/** 오타수정 기록 (AS-IS Apr92_ApprModiModel — 수정자가 처음 고치기 전의 문서 내용 + 변경사유) */
public record AprTypoRes(Long apprModiId, String title, String content, String receiveName, String referenceName, String note, String reason, String signCompany, String signCeo) {
}
