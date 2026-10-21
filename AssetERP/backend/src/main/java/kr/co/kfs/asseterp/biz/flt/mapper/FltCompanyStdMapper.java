package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.CompanyStdLockupReq;
import kr.co.kfs.asseterp.biz.flt.dto.CompanyStdRes;
import kr.co.kfs.asseterp.biz.flt.dto.CompanyStdSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/flt/mapper/flt01_company_std.xml + UpdateDataModel(flt01_company_std) — J09 기준관리 */
@Mapper
public interface FltCompanyStdMapper {

    List<CompanyStdRes> selectByCompanyId(@Param("companyId") Long companyId);

    CompanyStdRes selectById(@Param("companyStdId") Long companyStdId);

    Long selectNextId();

    int insertCompanyStd(@Param("companyStdId") Long companyStdId, @Param("companyId") Long companyId, @Param("req") CompanyStdSaveReq req);

    int updateCompanyStd(@Param("companyId") Long companyId, @Param("req") CompanyStdSaveReq req);

    int deleteCompanyStds(@Param("companyId") Long companyId, @Param("companyStdIds") List<Long> companyStdIds);

    /** AS-IS Flt01_CompanyStd.updateOne — 의무보유기간 위반 체크 방식 5개 열 */
    int updateLockup(@Param("companyId") Long companyId, @Param("companyStdId") Long companyStdId, @Param("req") CompanyStdLockupReq req);
}
