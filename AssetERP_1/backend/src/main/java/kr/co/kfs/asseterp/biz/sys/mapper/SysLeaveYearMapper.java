package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.LeaveSettingRes;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveYearRes;
import kr.co.kfs.asseterp.biz.sys.dto.LeaveYearSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys30_leave_year.xml + sys01_company.selectById(휴가 열) + UpdateDataModel(sys30_leave_year·sys01_company) */
@Mapper
public interface SysLeaveYearMapper {
    /** AS-IS sys01_company.selectById 중 휴가 열 */
    LeaveSettingRes selectLeaveSetting(@Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel(sys01_company) — 이 화면이 바꾸는 휴가초과허용여부·휴가결산월만 */
    int updateLeaveSetting(@Param("companyId") Long companyId, @Param("leaveYn") String leaveYn, @Param("leaveMonthCode") String leaveMonthCode);

    List<LeaveYearRes> selectByAll(@Param("companyId") Long companyId);

    LeaveYearRes selectById(@Param("leaveYearId") Long leaveYearId);

    Long selectNextId();

    int insertLeaveYear(@Param("id") Long id, @Param("companyId") Long companyId, @Param("req") LeaveYearSaveReq req);

    int updateLeaveYear(@Param("companyId") Long companyId, @Param("req") LeaveYearSaveReq req);

    int deleteLeaveYears(@Param("companyId") Long companyId, @Param("leaveYearIds") List<Long> leaveYearIds);
}
