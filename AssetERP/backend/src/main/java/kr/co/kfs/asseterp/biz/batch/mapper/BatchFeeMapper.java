package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamFee;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamFeeBook;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

/** ICAM 보수분개(사무관리·운용) 반영용 SQL (ICAM 읽기는 IcamReader) */
@Mapper
public interface BatchFeeMapper {

    /** AS-IS icam10_fee.deleteOfficeMngFee — 20407·24926 */
    int deleteOfficeMngFee(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** AS-IS icam10_fee.deleteFundMngFee — 20402·24923 (펀드코드는 항상 '%') */
    int deleteFundMngFee(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                         @Param("closeDate") LocalDate closeDate, @Param("fundCode") String fundCode);

    /** AS-IS icam12_fee_book.delete */
    int deleteFeeBook(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** AS-IS icam10_fee.insert */
    int insertFee(@Param("p") BatchIcamFee fee);

    /** AS-IS icam12_fee_book.insert */
    int insertFeeBook(@Param("p") BatchIcamFeeBook book);

    /** AS-IS biz13_with_corp.selectManageTypeIs1 — 계약사관리 운영구분이 '자산운용(1)'인 건수 */
    Long countManageTypeIs1(@Param("companyId") Long companyId, @Param("icamCompanyCode") String icamCompanyCode, @Param("stdDate") LocalDate stdDate);

    /** AS-IS icam11_fee_deposit.selectByFundCode 의 건수(기준일 이전 시작분) */
    int countFeeDeposit(@Param("companyId") Long companyId, @Param("icamCompanyCode") String icamCompanyCode,
                        @Param("fundCode") String fundCode, @Param("stdDate") LocalDate stdDate);

    /** AS-IS icam11_fee_deposit.insert — 입금계좌·비고는 null */
    int insertFeeDeposit(@Param("companyId") Long companyId, @Param("icamCompanyCode") String icamCompanyCode,
                         @Param("fundCode") String fundCode, @Param("startDate") LocalDate startDate);

    /** AS-IS sys15_corp.selectCorpCodeCheck (corpId != 1, 사용 중) */
    long countCorpCode(@Param("companyId") Long companyId, @Param("corpCode") String corpCode, @Param("corpId") long corpId);

    /** AS-IS sys15_corp.insert — 운용사(5), 사용, 순번 = 회사코드 숫자 */
    int insertManagerCorp(@Param("corpId") Long corpId, @Param("companyId") Long companyId, @Param("corpName") String corpName,
                          @Param("corpCode") String corpCode, @Param("seq") long seq);

    /** AS-IS icam10_fee.createFundFeeBook — 'Y' 또는 오류 문구 */
    String createFundFeeBook(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS icam10_fee.createFundFeeRcvTr */
    String createFundFeeRcvTr(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS ast09_book.createDepositBook */
    String createDepositBook(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);
}
