package kr.co.kfs.asseterp.biz.apr.dto;

/** 결재선 설정 창의 사원 조회 한 줄 (emp00_trans_info.selectByText·selectByOrgCodeId·getTransDate·getOrgCodeId, V07) — titleName2는 직급이 있으면 직급명, 없으면 직책명 */
public record AprStepEmpRes(Long personId, Long orgCodeId, String orgKorName, String titleName, String titleName2, String empKorName) {
}
