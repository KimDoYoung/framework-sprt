package kr.co.kfs.asseterp.biz.apr.dto;

/** 결재선 이름 문구에 쓰는 사원 정보 (emp00_trans_info, V06) */
public record AprStepPersonRow(Long personId, Long orgCodeId, String titleName, String korName, String orgKorName, String orgTitleName) {
}
