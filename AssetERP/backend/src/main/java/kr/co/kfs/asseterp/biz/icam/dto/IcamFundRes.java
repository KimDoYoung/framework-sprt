package kr.co.kfs.asseterp.biz.icam.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.math.BigDecimal;
import java.time.LocalDate;

/** ICAM 펀드기본 한 행 (AS-IS Icam03_FundModel / icam03_fund + 코드명). 최근 펀드 목록(selectRecentFund)과 펀드별 이력(selectByNamePaging)이 같이 쓴다 */
public record IcamFundRes(
        /** 18자리 ID라 JS가 잃는다(05 §6) → 문자열로 내린다 */
        @JsonSerialize(using = ToStringSerializer.class) Long fundId,
        LocalDate stdDate,
        String fundCd,
        String fundNm,
        String kofiaFundCd,
        String ksdFundCd,
        String ksdItemCd,
        String trustNm,
        String fundTypeNm,
        String publicNm,
        String parentNm,
        String classTypeNm,
        String fundUnitNm,
        String charClassNm,
        String diffDivYn,
        LocalDate setDate,
        LocalDate endDate,
        LocalDate endExpectDate,
        String operator1,
        String operator2,
        String consignmentNm,
        String trustBankNm,
        String officeWorkNm,
        String cur,
        LocalDate closeDate,
        LocalDate feeDate,
        BigDecimal managementRate,
        BigDecimal salesRate,
        BigDecimal consignmentRate,
        BigDecimal officeWorkRate,
        BigDecimal setAmt,
        BigDecimal nav,
        String workDateString,
        String worker
) {
}
