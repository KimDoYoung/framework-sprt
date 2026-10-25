package kr.co.kfs.asseterp.biz.tdm.dto;

/** 점검항목 생성 전 상태 (AS-IS tdm50_chck_job.selectCheckStatus) */
public record CheckStatusRes(Boolean exctApprYn, Boolean checkEndYn, Boolean checkIngYn, Boolean manlApprYn) {
}
