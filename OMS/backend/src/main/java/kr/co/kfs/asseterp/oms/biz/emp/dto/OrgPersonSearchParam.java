package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** 조직(하위 포함) 사원 조회 조건 */
public record OrgPersonSearchParam(Long companyId, Long orgCodeId, LocalDate baseDate) {
}
