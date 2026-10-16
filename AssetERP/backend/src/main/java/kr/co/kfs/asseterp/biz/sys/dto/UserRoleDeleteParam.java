package kr.co.kfs.asseterp.biz.sys.dto;

import java.util.List;

/** 권한그룹별 사원 삭제 (로그인 회사 권한그룹의 행만) */
public record UserRoleDeleteParam(
        Long companyId,
        List<Long> userRoleIds
) {
}
