package kr.co.kfs.asseterp.biz.emp.dto;

/** 사원찾기 행 (AS-IS Emp01_Lookup_PersonModel ← emp03_trans.selectByText) */
public record TransPersonRes(
        Long transId,
        Long personId,
        Long orgCodeId,
        String orgNm,
        String empNo,
        String korNm,
        String titleNm
) {
}
