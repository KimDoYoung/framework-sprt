package kr.co.kfs.asseterp.biz.pay.dto;

import java.util.List;

/** 결재창에서 상신·저장한 문서 ID를 지출요청 행들에 기록 (AS-IS pay.Pay50_Expense.updateExpenseApprId·updatesSttleApprId, V27) */
public record PayExpenseApprIdReq(List<Long> ids, Long apprId) {
}
