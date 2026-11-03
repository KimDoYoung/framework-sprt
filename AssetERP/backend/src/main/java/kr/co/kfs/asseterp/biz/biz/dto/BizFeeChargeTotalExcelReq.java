package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** 통합상신(A20) 문서에 붙이는 통합 엑셀 (EE33, AS-IS ExcelCreate.createTotalFeeExcel) — apprId 는 저장된 상신 문서 ID */
public record BizFeeChargeTotalExcelReq(Long apprId, LocalDate chargeDate, String quarter) {
}
