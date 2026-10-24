package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무이행점검 수행부서·담당자 한 행 (AS-IS tdm08_manager_info.selectByCompanyId, Tdm08_ManagerInfoModel) */
public record ManagerRes(
        Long managerInfoId,
        String managerType,
        String managerTypeName,
        Long orgId,
        String orgName,
        Long personId,
        String personName) {
}
