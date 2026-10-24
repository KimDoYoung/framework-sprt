package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 부서 일괄지정 (AS-IS tdm.Tdm44_ManlDutyOrg.insert): 고른 관리의무(realManlDutyId) × 고른 부서(orgId) */
public record ManlDutyOrgAssignReq(List<Long> manlDutyIds, List<Long> orgIds) {
}
