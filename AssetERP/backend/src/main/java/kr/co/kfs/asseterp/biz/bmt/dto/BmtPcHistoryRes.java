package kr.co.kfs.asseterp.biz.bmt.dto;

import java.time.LocalDate;

/** Bmt10_Lookup_History 그리드 한 행 — AS-IS bmt12_pc_history.selectByInfoId / selectById */
public record BmtPcHistoryRes(
        Long pcHistoryId,
        Long infoId,
        String astClassTreeName,
        LocalDate startDate,
        String hostName,
        LocalDate settingDate,
        String internalIp,
        String macAddress,
        String etc,
        String note
) {
}
