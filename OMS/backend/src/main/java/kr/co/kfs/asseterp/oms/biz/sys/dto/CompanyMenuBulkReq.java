package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.util.List;

/** 메뉴 일괄복사 (AS-IS Sys06_Lookup_CopyMulti → updateByMenuYn): 메뉴·고객사 목록, true=권한부여 false=권한삭제 */
public record CompanyMenuBulkReq(List<Long> menuIds, List<Long> companyIds, boolean useYn) {
}
