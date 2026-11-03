package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** 자료생성 뒤 엑셀·PDF 만들기 (EE33) — quarter 는 화면의 분기 콤보 값("1"~"4", 파일 이름에 들어간다). contCorpId 가 없으면 전체 계약사 */
public record BizFeeChargeFileReq(LocalDate chargeDate, String quarter, Long contCorpId) {
}
