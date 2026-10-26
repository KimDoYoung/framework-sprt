package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.FundExcelRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** AS-IS server/utils/file/ExcelUpload.fundUpload가 부르는 SQL (fnd01_fund_code·fnd02_fund_info·fnd06_office_work·fnd00_fund) */
@Mapper
public interface FndFundUploadMapper {

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS fnd01_fund_code.selectByFundCode — 로그인 회사의 같은 코드 펀드 ID(없으면 null) */
    Long selectFundCodeId(@Param("companyId") Long companyId, @Param("fundCode") String fundCode);

    /** AS-IS fnd06_office_work.selectByKofiaCode — 협회코드로 사무수탁사 코드(없으면 null) */
    String selectOfficeWorkCodeByKofia(@Param("companyId") Long companyId, @Param("kofiaCode") String kofiaCode);

    /** AS-IS fnd00_fund.selectCorpCode — f_get_corp_cd(1, …) */
    String selectCorpCode(@Param("corpType") String corpType, @Param("corpCode") String corpCode,
                          @Param("officeType") String officeType, @Param("officeWorkCode") String officeWorkCode);

    /** AS-IS fnd01_fund_code.excelInsert */
    int excelInsertFund(@Param("r") FundExcelRow row);

    /** AS-IS fnd02_fund_info.excelDelete — 같은 작업일의 정보를 지우고 */
    int excelDeleteInfo(@Param("fundCodeId") Long fundCodeId, @Param("workDate") java.time.LocalDate workDate);

    /** AS-IS fnd02_fund_info.excelInsert */
    int excelInsertInfo(@Param("r") FundExcelRow row);
}
