package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz.Biz16_EachCont.update — contractId 가 0 이하(새 행)이면 INSERT */
public record BizContEachReq(Long contractId, Long contCorpId, LocalDate date, String fundNm, LocalDate fundStartDate, String fundFee,
                             String note, LocalDate startDate) {
}
