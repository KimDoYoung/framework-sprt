package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.JointLeaveRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface EmpJointLeaveMapper {

    List<JointLeaveRes> selectByYear(@Param("companyId") Long companyId, @Param("stdYear") String stdYear);

    JointLeaveRes selectById(@Param("companyId") Long companyId, @Param("jointLeaveId") Long jointLeaveId);

    Long selectNextId();

    int insertJointLeave(@Param("companyId") Long companyId, @Param("jointLeaveId") Long jointLeaveId,
                         @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                         @Param("reason") String reason);

    int updateJointLeave(@Param("companyId") Long companyId, @Param("jointLeaveId") Long jointLeaveId,
                         @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                         @Param("reason") String reason);

    /** AS-IS apr01_appr.insertApprDel — 삭제하는 결재문서를 폐기문서로 옮김 */
    int insertApprDel(@Param("apprId") Long apprId, @Param("empId") Long empId);

    /** AS-IS apr01_appr.deleteAppr */
    int deleteAppr(@Param("apprId") Long apprId);

    int deleteJointLeaves(@Param("companyId") Long companyId, @Param("jointLeaveIds") List<Long> jointLeaveIds);
}
