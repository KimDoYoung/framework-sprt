package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.JointLeaveExceptRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmpJointLeaveExceptMapper {

    List<JointLeaveExceptRes> selectByJointLeaveId(@Param("companyId") Long companyId, @Param("jointLeaveId") Long jointLeaveId);

    JointLeaveExceptRes selectById(@Param("companyId") Long companyId, @Param("jointLeaveExceptId") Long jointLeaveExceptId);

    Long selectNextId();

    /** 공동연차가 로그인 회사 것일 때만 넣는다(0이면 회사 불일치) */
    int insertJointLeaveExcept(@Param("companyId") Long companyId, @Param("jointLeaveExceptId") Long jointLeaveExceptId,
                               @Param("jointLeaveId") Long jointLeaveId, @Param("personId") Long personId,
                               @Param("reason") String reason);

    int updateJointLeaveExcept(@Param("companyId") Long companyId, @Param("jointLeaveExceptId") Long jointLeaveExceptId,
                               @Param("reason") String reason);

    int deleteJointLeaveExcepts(@Param("companyId") Long companyId, @Param("jointLeaveExceptIds") List<Long> jointLeaveExceptIds);
}
