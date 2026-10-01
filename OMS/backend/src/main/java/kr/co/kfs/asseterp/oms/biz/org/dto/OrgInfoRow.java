package kr.co.kfs.asseterp.oms.biz.org.dto;

import java.time.LocalDate;

/** org02_info INSERT 파라미터 */
public record OrgInfoRow(Long orgInfoId, String korNm, LocalDate modDate, String modReason, Long orgCodeId, Long parentCodeId,
                         String engNm, String note, String levelCd, String sortOrder, String modDetail) {
}
