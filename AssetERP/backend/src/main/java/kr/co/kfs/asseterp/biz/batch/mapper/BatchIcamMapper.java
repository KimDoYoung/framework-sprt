package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamData;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamFund;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamFundBook;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** ICAM 연계 배치의 asseterpdb 쪽 조회·쓰기 (ICAM 읽기는 IcamReader) */
@Mapper
public interface BatchIcamMapper {

    /** AS-IS sys01_company.selectIcamCompanyCode — companyId는 LIKE 패턴('%' 또는 숫자 문자열) */
    List<BatchIcamCompany> selectIcamCompanies(@Param("companyId") String companyId);

    /** AS-IS icam02_data.insert */
    int insertIcamData(@Param("p") BatchIcamData data);

    /** AS-IS sys12_calendar.selectByDate(companyId=0) — 시작일~종료일의 모든 날(영업일 여부 무관), 날짜순 */
    List<LocalDate> selectCalendarDays(@Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** AS-IS icam03_fund.delete — 같은 ICAM 회사·기준일·펀드의 기존 행 */
    int deleteIcamFund(@Param("p") BatchIcamFund fund);

    /** AS-IS icam03_fund.insert */
    int insertIcamFund(@Param("p") BatchIcamFund fund);

    /** AS-IS fnd03_consignment.insert2 — icam03_fund에 있고 회사에 없는 수탁사만 추가 */
    int insertConsignments(@Param("companyId") Long companyId, @Param("icamCompanyCode") String icamCompanyCode);

    /** AS-IS fnd09_trust_bank.insert2 */
    int insertTrustBanks(@Param("companyId") Long companyId, @Param("icamCompanyCode") String icamCompanyCode);

    /** AS-IS fnd06_office_work.insert2 */
    int insertOfficeWorks(@Param("companyId") Long companyId, @Param("icamCompanyCode") String icamCompanyCode);

    /** AS-IS sys01_company.selectIcamCompanyExcept — ICAM 회사코드가 있는 사용 중인 A1(자산운용) 회사만 */
    List<BatchIcamCompany> selectIcamCompaniesA1(@Param("companyId") String companyId);

    /** AS-IS icam06_fund_book.deleteByStdDate — 회사의 기간(시작일~종료일) 원장 */
    int deleteFundBook(@Param("icamCompanyCode") String icamCompanyCode, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** AS-IS icam06_fund_book.insert */
    int insertFundBook(@Param("p") BatchIcamFundBook book);
}
