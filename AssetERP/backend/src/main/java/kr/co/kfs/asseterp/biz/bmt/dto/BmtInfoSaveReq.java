package kr.co.kfs.asseterp.biz.bmt.dto;

import java.time.LocalDate;

/** Bmt10_Edit_Info [저장] — 장비명(자산분류 ID)·매입일자·폐기일자·취득금액·취득정보·세부사양·비고 */
public record BmtInfoSaveReq(
        Long astClassTreeId,
        LocalDate applyDate,
        LocalDate retireDate,
        Long acqAmount,
        String acqInfo,
        String spec,
        String note
) {
}
