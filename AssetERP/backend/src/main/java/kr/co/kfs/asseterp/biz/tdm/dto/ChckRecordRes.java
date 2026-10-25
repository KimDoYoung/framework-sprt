package kr.co.kfs.asseterp.biz.tdm.dto;

/** 점검(승인) 이력 한 행 (AS-IS Tdm55_ChckRecordModel — selectByChckOrgId) */
public record ChckRecordRes(Long rowNum, String updDateStr, String procType, String personInfo, String procResult, String resultCmnt) {
}
