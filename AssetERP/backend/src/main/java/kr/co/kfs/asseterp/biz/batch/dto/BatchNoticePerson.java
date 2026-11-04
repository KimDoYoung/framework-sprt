package kr.co.kfs.asseterp.biz.batch.dto;

/** 알림을 받을 사원. hasPassword는 AS-IS가 메일 발송 조건으로 보던 getDecPassword() != null (메일 암호가 있는지) */
public record BatchNoticePerson(Long personId, String mobileTelNo, String emailAddress, boolean hasPassword) {
}
