package kr.co.kfs.asseterp.biz.tdm.dto;

/** 알림발송 대상 (AS-IS tdm51_chck_org.getMessageList 결과 중 부서담당자 ID) */
public record CheckOrgManagerRes(Long chckOrgId, Long orgManagerId) {
}
