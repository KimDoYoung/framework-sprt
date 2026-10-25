package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.CompanySetupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CompanySetupSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface TdmCompanySetupMapper {

    /** AS-IS tdm91_company_setup.selectByCompanyId */
    List<CompanySetupRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS tdm91_company_setup.selectById */
    CompanySetupRes selectById(@Param("companySetupId") Long companySetupId);

    /** AS-IS tdm91_company_setup.countByDate */
    int countByDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("companySetupId") Long companySetupId);

    Long selectCompanyId(@Param("companySetupId") Long companySetupId);

    Long selectNextId();

    int insertCompanySetup(@Param("companySetupId") Long companySetupId, @Param("companyId") Long companyId, @Param("row") CompanySetupSaveReq row, @Param("updName") String updName);

    int updateCompanySetup(@Param("row") CompanySetupSaveReq row, @Param("updName") String updName);

    int deleteCompanySetups(@Param("companyId") Long companyId, @Param("companySetupIds") List<Long> companySetupIds);
}
