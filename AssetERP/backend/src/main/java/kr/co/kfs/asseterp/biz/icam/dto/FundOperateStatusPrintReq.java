package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

public record FundOperateStatusPrintReq(
        LocalDate startDate,
        LocalDate closeDate,
        String fundType,
        String searchText
) {
}
