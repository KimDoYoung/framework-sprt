package kr.co.kfs.asseterp.biz.ics.dto;

import java.util.List;

/** 확인(true)·확인취소(false) (AS-IS ics.Ics31_ComplianceWrite.updateConfirmYn) — 고른 행들의 complianceWriteId */
public record IcsComplianceConfirmReq(Boolean confirmYn, List<Long> writeIds) {
}
