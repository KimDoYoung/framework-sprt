package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.util.List;

/** sys04_role DELETE 파라미터 (로그인 회사의 권한그룹만 지운다) */
public record RoleDeleteParam(Long companyId, List<Long> roleIds) {
}
