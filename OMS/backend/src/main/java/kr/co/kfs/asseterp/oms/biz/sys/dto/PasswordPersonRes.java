package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 비밀번호 초기화 대상 사원 (AS-IS emp03_trans.selectByPasswordPersonId)
 *
 * @param orgNm  본부(부서) — 현재 발령 조직
 * @param lockYn 잠금 (emp01_lock_yn = 'true')
 */
public record PasswordPersonRes(Long personId, String empNo, String korNm, String orgNm, boolean lockYn) {
}
