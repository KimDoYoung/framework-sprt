package kr.co.kfs.asseterp.biz.apr.dto;

/** Apr01_Tab_TotalList 그리드 한 행 (G16 운영현황표). apprId는 SQL의 ROW_NUMBER()(행 키), 나머지는 담당자별 건수(일반·내부통제·계 × 발생·처리·미처리) */
public record AprTotalListRes(Long apprId, String aprOrgName, String aprPersonName, Long genCnt, Long icsCnt, Long totalCnt,
                              Long procGenCnt, Long procIcsCnt, Long procTotalCnt, Long unProcGenCnt, Long unProcIcsCnt, Long unProcTotalCnt) {
}
