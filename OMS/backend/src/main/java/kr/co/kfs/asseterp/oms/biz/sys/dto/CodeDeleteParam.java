package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.util.List;

/** sys09_code DELETE 파라미터. companyId가 null이면(SYSADMIN) 회사 조건 없이 */
public record CodeDeleteParam(Long companyId, List<Long> codeIds) {
}
