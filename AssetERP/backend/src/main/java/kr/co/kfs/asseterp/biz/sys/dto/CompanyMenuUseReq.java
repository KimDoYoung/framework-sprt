package kr.co.kfs.asseterp.biz.sys.dto;

import java.util.List;

/** A09 일괄복사 권한부여·권한삭제 (AS-IS sys.Sys06_Menu.updateByMenuYn(menuIdList, companyIdList, useYn)) */
public record CompanyMenuUseReq(List<Long> menuIds, List<Long> companyIds, Boolean useYn) {
}
