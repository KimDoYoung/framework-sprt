package kr.co.kfs.asseterp.oms.biz.emp.dto;

/** 사원 + 회사 (회사 조건 조회·삭제) */
public record PersonKey(Long companyId, Long personId) {
}
