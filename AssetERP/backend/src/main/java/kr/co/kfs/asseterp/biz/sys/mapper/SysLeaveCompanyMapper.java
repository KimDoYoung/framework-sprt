package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.LeaveCompanyRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysLeaveCompanyMapper {

    List<LeaveCompanyRes> selectByCompanyId(@Param("companyId") Long companyId);

    int countById(@Param("companyId") Long companyId, @Param("leaveCompanyId") Long leaveCompanyId);

    long selectNextId();

    int insertLeaveCompany(@Param("companyId") Long companyId, @Param("leaveCompanyId") Long leaveCompanyId,
                           @Param("leaveCode") String leaveCode, @Param("spcLeaveCode") String spcLeaveCode,
                           @Param("days") Long days, @Param("calcCode") String calcCode,
                           @Param("unUseYn") String unUseYn, @Param("note") String note);

    int updateLeaveCompany(@Param("companyId") Long companyId, @Param("leaveCompanyId") Long leaveCompanyId,
                           @Param("days") Long days, @Param("calcCode") String calcCode, @Param("unUseYn") String unUseYn);
}
