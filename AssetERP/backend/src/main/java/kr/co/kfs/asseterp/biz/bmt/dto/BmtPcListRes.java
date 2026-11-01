package kr.co.kfs.asseterp.biz.bmt.dto;

import java.time.LocalDate;

/** Bmt12_Tab_PcList 그리드 한 행 — AS-IS bmt12_pc_history.selectByCompanyId (장비별 기준일 이전 마지막 PC 이력) */
public record BmtPcListRes(
        Long pcHistoryId,
        Long infoId,
        String personName,
        LocalDate startDate,
        String internalIp,
        String macAddress,
        String astClassTreeName,
        String etc
) {
}
