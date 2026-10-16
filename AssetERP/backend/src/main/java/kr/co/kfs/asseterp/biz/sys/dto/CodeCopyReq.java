package kr.co.kfs.asseterp.biz.sys.dto;

import java.util.List;

/** A14 코드복사(AS-IS Sys09_Code.codeInsert): companyId = 원본 회사(화면의 현재 회사), companyIds = 복사받을 회사 */
public record CodeCopyReq(Long companyId, List<Long> companyIds) {
}
