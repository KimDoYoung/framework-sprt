package kr.co.kfs.asseterp.biz.tdm.dto;

/** 승인 이력 한 행 — 종합의견 기준 (AS-IS Tdm55_ChckRecordModel — selectByChckApprCmntId) */
public record ChckApprRecordRes(Long rowNum, String updDateStr, String procType, String checkOrgName, String personInfo, String procResult, String resultCmnt,
                             String reportCmnt) {
}
