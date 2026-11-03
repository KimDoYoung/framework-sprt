package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz20_fee_charge.selectFeeInfo — 구간 계산을 운용/자문/일임별로 모은 청구 한 건의 발생·최저·병행·청구 보수 (자료생성 내부용) */
public record BizFeeInfoRow(
        LocalDate occStartDate, LocalDate occCloseDate, Long occDays, Long occFee,
        LocalDate minStartDate, LocalDate minCloseDate, Long minDays, Long minFee,
        LocalDate withStartDate, LocalDate withCloseDate, Long withDays, Long withFee,
        Long chargeFee, Long tax, String targetYn
) {
}
