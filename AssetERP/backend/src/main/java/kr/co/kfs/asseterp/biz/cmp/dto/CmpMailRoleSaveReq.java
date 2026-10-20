package kr.co.kfs.asseterp.biz.cmp.dto;

/** 공용메일 권한자 추가 (AS-IS Cmp11_MailRole.updateList — 사원 한 명). 이미 있는 사원은 건너뛴다 */
public record CmpMailRoleSaveReq(Long mailBookId, Long personId) {
}
