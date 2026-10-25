package kr.co.kfs.asseterp.biz.tdm.dto;

/** 점검 마감 정보 (AS-IS tdm50_chck_job.selectEndInfoByApprEmpId — Tdm50_ChckJobModel의 endYn·endDate·batchApprUseYn) */
public record CheckApprEndInfoRes(Boolean endYn, String endDate, Boolean batchApprUseYn) {
}
