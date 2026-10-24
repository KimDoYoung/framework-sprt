package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 담당자 저장 한 행 — managerInfoId ≤ 0이면 INSERT (AS-IS Tdm08_ManagerInfo.update, UpdateDataModel) */
public record ManagerSaveReq(
        Long managerInfoId,
        String managerType,
        Long orgId,
        Long personId,
        LocalDate startDate,
        LocalDate endDate) {
}
