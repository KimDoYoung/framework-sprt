package kr.co.kfs.asseterp.biz.cmp.dto;

/** 공용메일 권한자 한 행 (AS-IS Cmp11_MailRoleModel, selectByRoleId) */
public record CmpMailRoleRes(Long mailRoleId, Long mailBookId, Long personId, String orgName, String titleName, String empNo, String empKorName) {
}
