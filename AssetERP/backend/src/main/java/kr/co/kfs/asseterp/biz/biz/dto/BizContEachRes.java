package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz16_each_contract.selectByCorpId — 개별계약서 */
public record BizContEachRes(Long contractId, Long companyId, Long contCorpId, LocalDate date, String fundNm, LocalDate fundStartDate,
                             String fundFee, String note, LocalDate startDate, Long apprId, String apprStatusCd, String aprStatusNm) {
}
