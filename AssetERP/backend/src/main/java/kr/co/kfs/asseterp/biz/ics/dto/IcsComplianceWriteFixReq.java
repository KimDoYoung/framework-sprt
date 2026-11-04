package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * 제출(true)·제출취소(false) (AS-IS ics.Ics31_ComplianceWrite.updateFixYn) — 그리드 행들의 complianceWriteId.
 * 제출이면 confirmerId(확인자 선택창에서 고른 사원)와, 그 확인자가 이미 부서장 준수확인서를 상신했는지 보는 stdDate·cycleType이 함께 온다
 */
public record IcsComplianceWriteFixReq(Boolean fixYn, List<Long> writeIds, Long confirmerId, LocalDate stdDate, String cycleType) {
}
