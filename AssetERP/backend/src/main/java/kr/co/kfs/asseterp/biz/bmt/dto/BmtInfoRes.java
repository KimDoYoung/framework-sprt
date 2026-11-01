package kr.co.kfs.asseterp.biz.bmt.dto;

import java.time.LocalDate;

/** Bmt10_Tab_Info 그리드 한 행 — AS-IS bmt10_info.selectByCompanyId / selectByBaseDate / selectById */
public record BmtInfoRes(
        Long infoId,
        Long astClassTreeId,
        String astClassTreeName,
        LocalDate applyDate,
        LocalDate retireDate,
        Long acqAmount,
        String acqInfo,
        String spec,
        String note,
        String personName
) {
}
