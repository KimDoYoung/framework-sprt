package kr.co.kfs.asseterp.biz.apr.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.IcsWriterLinkRow;

/** 링크코드 A52(임직원 내부통제 준수확인서, 부서장, V28)·A53(작성자, 원본 2026-11-05)의 본문 값 조회 */
@Mapper
public interface AprIcsWriterLinkMapper {

    /** ics30_compliance.selectWriterList — 그 분기(월)에 확정된 소속 임직원의 준수 여부. kindCode는 `IcsComplianceType` 고정이라 SQL 안에 있다 */
    List<IcsWriterLinkRow> selectWriterList(@Param("companyId") Long companyId, @Param("confirmerId") Long confirmerId,
                                            @Param("cycleType") String cycleType, @Param("stdDate") LocalDate stdDate);

    /** ics30_compliance.selectWriterReport (원본 2026-11-05) — A53 작성자 본인의 준수항목별 결과·미준수 사유 */
    List<kr.co.kfs.asseterp.biz.apr.dto.IcsWriterReportRow> selectWriterReport(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                                                             @Param("cycleType") String cycleType, @Param("stdDate") LocalDate stdDate);
}
