package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.InitLeaveRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmpInitLeaveMapper {

    List<InitLeaveRes> selectInitLeaves(@Param("companyId") Long companyId, @Param("year") String year,
                                        @Param("personId") Long personId);

    InitLeaveRes selectInitLeaveById(@Param("companyId") Long companyId, @Param("initLeaveId") Long initLeaveId);

    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);

    int countInitLeave(@Param("companyId") Long companyId, @Param("initLeaveId") Long initLeaveId);

    long selectNextId();

    int insertInitLeave(@Param("companyId") Long companyId, @Param("initLeaveId") Long initLeaveId,
                        @Param("personId") Long personId, @Param("year") String year, @Param("useDays") Double useDays);

    int updateInitLeave(@Param("companyId") Long companyId, @Param("initLeaveId") Long initLeaveId,
                        @Param("year") String year, @Param("useDays") Double useDays);

    int deleteInitLeave(@Param("companyId") Long companyId, @Param("initLeaveId") Long initLeaveId);
}
