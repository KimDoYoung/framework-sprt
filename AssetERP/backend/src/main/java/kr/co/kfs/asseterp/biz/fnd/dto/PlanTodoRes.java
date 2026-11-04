package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 상품기획 창(Fnd20_Lookup_ToDoList) 한 행 — AS-IS Fnd20_PlanModel 중 그리드가 쓰는 값. closeYn은 결재 상태 이름(없으면 null) */
public record PlanTodoRes(Long planId, String fundName, String classTreeFullName, String approvalTypeName, LocalDate startDate, LocalDate dueDate,
                          String closeYn, Long apprId, String note) {
}
