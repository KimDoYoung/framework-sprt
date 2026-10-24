package kr.co.kfs.asseterp.biz.tdm.dto;

/** 매뉴얼 작업의 직책별 책무·관리의무 건수 한 행 (AS-IS tdm41_manl_duty.groupByManlJobId, N16) */
public record ManlDutyGroupRes(Long manlDutyId, Long manlJobId, Long roleId, String roleName,
                               Long taskCnt, Long taskIndvCnt, Long taskCommonCnt, Long taskCeoCnt,
                               Long taskRelateDetailCnt, Long taskRelateDutyCnt, Long taskRelateDutyNoneCnt) {
}
