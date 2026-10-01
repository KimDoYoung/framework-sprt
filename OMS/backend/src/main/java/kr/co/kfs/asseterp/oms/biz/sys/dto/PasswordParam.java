package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** sys25_password·사원 조회 파라미터 (AS-IS 파라미터 Map / Sys25_PasswordModel). pwd가 null이면 초기화 */
public record PasswordParam(Long companyId, Long personId, Long seq, String pwd) {
}
