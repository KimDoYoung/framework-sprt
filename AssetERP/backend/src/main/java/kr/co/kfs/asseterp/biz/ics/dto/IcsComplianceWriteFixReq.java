package kr.co.kfs.asseterp.biz.ics.dto;

import java.util.List;

/** 제출(true)·제출취소(false) (AS-IS ics.Ics31_ComplianceWrite.updateFixYn) — 그리드 행들의 complianceWriteId */
public record IcsComplianceWriteFixReq(Boolean fixYn, List<Long> writeIds) {
}
