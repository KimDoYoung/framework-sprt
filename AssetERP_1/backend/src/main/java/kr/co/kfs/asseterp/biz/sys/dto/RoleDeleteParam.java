package kr.co.kfs.asseterp.biz.sys.dto;

import java.util.List;

/** 권한그룹 삭제 파라미터 (로그인 회사의 행만 지운다) */
public record RoleDeleteParam(
        Long companyId,
        List<Long> roleIds
) {
}
