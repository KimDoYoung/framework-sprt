package kr.co.kfs.asseterp.biz.pay.dto;

/** 원천징수영수증 저장 한 행 (S25) — 화면이 바꾸는 것은 사원과 비고뿐이다(AS-IS 그리드 편집 열) */
public record PayTaxReceiptSaveReq(
        Long taxWithholdingId,
        Long personId,
        String note
) {
}
