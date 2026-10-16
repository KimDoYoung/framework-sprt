package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.LicenseRes;
import kr.co.kfs.asseterp.biz.emp.dto.LicenseSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/Emp08_License.java */
@Mapper
public interface EmpLicenseMapper {

    List<LicenseRes> selectLicenses(@Param("companyId") Long companyId, @Param("personId") Long personId);

    LicenseRes selectLicenseById(@Param("licenseId") Long licenseId);

    Long selectNextLicenseId();

    int insertLicense(@Param("licenseId") Long licenseId, @Param("companyId") Long companyId, LicenseSaveReq req);

    int updateLicense(@Param("licenseId") Long licenseId, @Param("companyId") Long companyId, LicenseSaveReq req);

    int deleteLicenses(@Param("licenseIds") List<Long> licenseIds, @Param("companyId") Long companyId);
}
