package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.util.List;

/** 코드 복사 (AS-IS sys09_code.codeInsert): sourceCompanyId 회사의 codeKindId 코드를 companyIds 회사로 */
public record CodeCopyReq(Long codeKindId, Long sourceCompanyId, List<Long> companyIds) {
}
