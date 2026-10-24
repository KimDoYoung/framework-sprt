package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 담당자 적용기간 한 행 (AS-IS tdm08_manager_info.selectByManagerType·selectById, Tdm08_ManagerInfoModel) */
public record ManagerInfoRes(
        Long managerInfoId,
        String managerType,
        Long orgId,
        Long personId,
        LocalDate startDate,
        LocalDate endDate,
        String personName,
        String posName,
        String orgName) {
}
