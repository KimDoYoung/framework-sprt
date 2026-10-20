package kr.co.kfs.asseterp.biz.ics.dto;

/**
 * 법규 회사별 설정 저장 한 행 (AS-IS Ics03_CompanyInfoModel 중 화면이 바꾸는 열, H08).
 * 법규관리 화면은 세 값을 모두 보낸다. 사용여부 설정 창은 exceptYn만 보낸다 — AS-IS 모델은 boolean이라 안 보낸 값은 기존 값(없으면 false)으로 쓴다
 */
public record IcsCompanyInfoSaveReq(Long classTreeId, Boolean exceptYn, Boolean autoYn, Boolean advisYn) {
}
