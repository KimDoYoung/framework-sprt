package kr.co.kfs.asseterp.biz.tdm.dto;

/** 임원선택 조회창 한 행 (AS-IS tdm01_hr.selectByEndDate 중 Tdm01_Lookup_SelectSingle 그리드·선택 속성) */
public record HrLookupRes(
        Long personId,
        String personName,
        String posName,
        String orgName
) {
}
