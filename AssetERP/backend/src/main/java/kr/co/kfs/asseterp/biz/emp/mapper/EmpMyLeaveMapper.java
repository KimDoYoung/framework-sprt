package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EtcLeaveCheckRes;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveCodeRes;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveDaysRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyLeaveSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** Y01 휴가신청 (AS-IS server/emp/mapper/emp20_leave.xml 본인 쪽) */
@Mapper
public interface EmpMyLeaveMapper {

    List<MyLeaveRes> selectMyLeaves(@Param("personId") Long personId, @Param("stdYear") String stdYear);

    MyLeaveRes selectMineById(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("leaveId") Long leaveId);

    long selectNextId();

    int insertLeave(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("leaveId") Long leaveId,
                    @Param("req") MyLeaveSaveReq req);

    int updateLeave(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("leaveId") Long leaveId,
                    @Param("req") MyLeaveSaveReq req);

    int updateApprId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("leaveId") Long leaveId,
                     @Param("apprId") Long apprId);

    int deleteLeave(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("leaveId") Long leaveId);

    int countAltAppr(@Param("leaveId") Long leaveId);

    int deleteAltApprByLeaveId(@Param("leaveId") Long leaveId);

    LeaveDaysRes selectDays(@Param("personId") Long personId, @Param("stdYear") String stdYear);

    Double countLeave(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                      @Param("closeDate") LocalDate closeDate, @Param("leaveCode") String leaveCode);

    Double countLeaveByDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                            @Param("closeDate") LocalDate closeDate, @Param("leaveCode") String leaveCode);

    EtcLeaveCheckRes selectEtcLeaveCheck(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                         @Param("etcLeaveId") Long etcLeaveId, @Param("leaveId") Long leaveId);

    List<LeaveCodeRes> selectLeaveCodes(@Param("companyId") Long companyId);

    List<LeaveCodeRes> selectSpcLeaveCodes(@Param("companyId") Long companyId);

    String selectMobileTelNo(@Param("companyId") Long companyId, @Param("personId") Long personId);

    String selectRequesterLabel(@Param("companyId") Long companyId, @Param("personId") Long personId);

    int updateOverConfirmRequest(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("leaveId") Long leaveId,
                                 @Param("confirmerId") Long confirmerId);
}
