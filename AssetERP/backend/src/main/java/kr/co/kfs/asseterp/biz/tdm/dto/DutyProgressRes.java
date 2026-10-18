package kr.co.kfs.asseterp.biz.tdm.dto;

/**
 * 책무진행 상태 한 행 (AS-IS Sys99_PrintModel 중 Tdm50_Tab_DutyProgressAdmin 그리드에 쓰는 속성, 원본 f_recon_tdm 'CHCK_STATUS' 결과).
 * 괄호는 sys99_print 컬럼. 월별 m00~m11은 조회 기준월부터 12개월(long21~long32)
 */
public record DutyProgressRes(Long printId,
                              String companyName, String roleName, String exctName, String orgName, String name1454, String apprList1463,   // string01~06
                              Long manlCnt, Long endCnt, Long lockCnt, Long approveCnt, Long unusedCnt,                                       // long01~05
                              Long manlAnnually, Long manlSemiannually, Long manlQuarterly, Long manlMonthly, Long manlAnytime, Long manlEtc, // long06~11
                              String thisMonthYn, String nextMonthYn,                                                                         // string07~08
                              Long m00Cnt, Long m01Cnt, Long m02Cnt, Long m03Cnt, Long m04Cnt, Long m05Cnt,                                   // long21~26
                              Long m06Cnt, Long m07Cnt, Long m08Cnt, Long m09Cnt, Long m10Cnt, Long m11Cnt,                                   // long27~32
                              Long itemCnt1455,                                                                                               // long33
                              String checker1456, String apprList1456, String apprStatus,                                                     // string11~13
                              String exctApproveYn, String chckLockYn, String chckCloseYn, String chckApprStatus) {                           // string14~17
}
