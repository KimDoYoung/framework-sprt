package kr.co.kfs.asseterp.biz.pay.dto;

/**
 * 급여관리(항목별) [저장] 한 행 — 지급일·사원은 서버가 monthId로 정한다(클라이언트 값을 믿지 않는다)
 */
public record PayMonthItemAmountReq(Long monthId, Long monthItemId, String itemType, String itemCd, Long itemAmt) {
}
