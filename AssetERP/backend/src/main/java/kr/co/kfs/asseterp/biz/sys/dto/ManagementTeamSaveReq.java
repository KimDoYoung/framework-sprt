package kr.co.kfs.asseterp.biz.sys.dto;

/** 관리팀 저장 열 (AS-IS update): 사원·담당 업무·근속년수·주요경력. managementTeamId ≤ 0이면 신규, companyId는 신규일 때만 쓴다(AS-IS insertRow가 1을 넣음) */
public record ManagementTeamSaveReq(
        Long managementTeamId,
        Long companyId,
        Long personId,
        String chargePart,
        String workYear,
        String mainCareer
) {
}
