package kr.co.kfs.asseterp.biz.tdm.dto;

/** 이행점검 작업 한 건 (AS-IS Tdm50_ChckJobModel 중 Tdm50_Tab_CheckJob이 쓰는 속성 — selectByCheckYm) */
public record CheckJobRes(Long chckJobId, Long companyId, String checkYm, String checkName,
                          String startDate, String endDate, Boolean endYn,
                          Long apprId, String apprStatusCode, String apprStatusName,
                          Boolean lockYn, Boolean batchCheckUseYn) {
}
