package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 기획일정 한 행 — AS-IS Fnd20_PlanModel (fnd20_plan.selectByFundId). closeYn은 상신문서 상태 이름(상신 문서가 없으면 null) */
public record PlanRes(Long planId, Long fundId, Long classTreeId, String classTreeFullName, String approvalTypeName, Long personId,
                      String personName, String orgName, LocalDate startDate, LocalDate dueDate, String closeYn, String note,
                      Long managerId, Long apprId) {
}
