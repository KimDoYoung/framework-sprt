package kr.co.kfs.asseterp.biz.act.dto;

/** 계정과목복사 창의 고객사 한 행 (AS-IS sys.Sys01_Company.selectByUseYn: 사용 중인 관리자 외 회사) */
public record ActCompanyRes(Long companyId, String companyName, String locationName) {
}
