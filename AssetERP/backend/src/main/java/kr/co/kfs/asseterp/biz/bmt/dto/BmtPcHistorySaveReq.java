package kr.co.kfs.asseterp.biz.bmt.dto;

import java.time.LocalDate;

/** Bmt12_Edit_PcHistory [저장] — pcHistoryId가 없으면 새 행(등록·추가등록) */
public record BmtPcHistorySaveReq(
        Long pcHistoryId,
        Long infoId,
        LocalDate startDate,
        String hostName,
        LocalDate settingDate,
        String internalIp,
        String macAddress,
        String etc,
        String note
) {
}
