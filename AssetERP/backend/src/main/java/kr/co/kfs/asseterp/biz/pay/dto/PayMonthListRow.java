package kr.co.kfs.asseterp.biz.pay.dto;

/**
 * 급여대장 PDF의 사원 한 줄 (AS-IS Pay10_MonthModel, pay10_month.selectByList — V25).
 * 항목 코드별 금액: 110 기본급 · 130 상여금 · 111 중식대 · 112 차량유지비 · 113 양육수당 · 120 연장 · 121 야간 · 122 휴일 · 123 연차 · 140 급여소급분 · 190 기타수당
 * · 210 국민연금 · 220 건강보험 · 230 장기요양 · 240 고용보험 · 250 소득세 · 260 지방세(22x~26x의 '1'은 연말정산).
 */
public record PayMonthListRow(
        String personNo, String personName, String posName,
        Long code110, Long code130, Long code111, Long code112, Long code113,
        Long code120, Long code121, Long code122, Long code123, Long code140, Long code190,
        Long code210, Long code220, Long code221, Long code230, Long code231,
        Long code240, Long code241, Long code250, Long code251, Long code260, Long code261,
        Long paySum, Long taxDdcSum, Long deductionSum,
        Double workDay, Double totalWorkTime, Double extendWorkTime, Double nightWorkTime, Double holidayWorkTime) {
}
