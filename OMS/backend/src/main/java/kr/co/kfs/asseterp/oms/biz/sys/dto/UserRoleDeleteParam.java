package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.util.List;

/** sys05_user_role DELETE 파라미터 (로그인 회사 권한그룹의 행만) */
public record UserRoleDeleteParam(Long companyId, List<Long> userRoleIds) {
}
