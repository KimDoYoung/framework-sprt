package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EtcLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveDaysRes;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveOptionRes;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmpLeaveMapper {

    List<LeaveRes> selectLeaves(@Param("personId") Long personId, @Param("stdYear") String stdYear);

    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);

    LeaveDaysRes selectDays(@Param("personId") Long personId, @Param("stdYear") String stdYear);

    LeaveOptionRes selectOption(@Param("companyId") Long companyId);

    int updateOverConfirm(@Param("companyId") Long companyId, @Param("leaveId") Long leaveId,
                          @Param("confirmStatusCode") String confirmStatusCode, @Param("confirmerId") Long confirmerId);

    LeaveRes selectLeaveById(@Param("companyId") Long companyId, @Param("leaveId") Long leaveId);

    long selectNextId();

    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName);

    int insertPrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") Long groupId,
                    @Param("personId") Long personId, @Param("stdYear") String stdYear);

    List<EtcLeaveRes> selectEtcLeaves(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                      @Param("stdYear") String stdYear);
}
