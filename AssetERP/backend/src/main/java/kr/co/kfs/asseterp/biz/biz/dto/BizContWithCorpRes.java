package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz13_with_corp.selectByHistoryContCorpId — 운영정보(운용사) */
public record BizContWithCorpRes(Long withCorpId, Long contCorpId, Long companyId, String manageType, Long corpId,
                                 LocalDate firstStartDate, LocalDate lastCloseDate, String corpCd, String corpNm, String manageTypeNm) {
}
