package kr.co.kfs.asseterp.biz.apr.mapper;

import java.time.LocalDate;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.PayIncomeTaxPrintRow;

/** 급여 링크코드 D01(연봉계약)·X01(갑근세원천징수확인서)의 본문 값 조회 (V26) */
@Mapper
public interface AprPayLinkSeedMapper {

    /** emp03_trans.selectByDate — 그 날 기준 발령의 사원 유형 코드(없으면 null) */
    String selectTransKindCode(@Param("personId") Long personId, @Param("startDate") LocalDate startDate);

    /** sys99_print.getIncomeTaxWithholding — stdYear는 `2026%` 처럼 LIKE 값 */
    PayIncomeTaxPrintRow selectIncomeTaxPrint(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                              @Param("incomeTaxWithholdingId") Long incomeTaxWithholdingId, @Param("stdYear") String stdYear);
}
