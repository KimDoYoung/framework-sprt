package kr.co.kfs.asseterp.biz.emp.dto;

/** 메일 검증 결과 (AS-IS ServiceResult status 1 = 성공 / -1 = 실패, message 그대로) */
public record EmpMailCheckRes(boolean ok, String message) {
}
