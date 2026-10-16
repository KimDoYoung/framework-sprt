package kr.co.kfs.asseterp.biz.sys.dto;

/** AssetERP 관리팀 한 행 (AS-IS Sys92_ManagementTeamModel / sys92_management_team + 사원 정보) */
public record ManagementTeamRes(
        Long managementTeamId,
        Long companyId,
        Long personId,
        String personNm,
        String posNm,
        String officeTelNo,
        String emailAddr,
        String chargePart,
        String workYear,
        String mainCareer,
        String note
) {
}
