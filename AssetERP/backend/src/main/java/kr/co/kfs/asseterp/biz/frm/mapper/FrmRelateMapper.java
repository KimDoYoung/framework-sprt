package kr.co.kfs.asseterp.biz.frm.mapper;

import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateBookingRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateLeaveRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateMyScheduleRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateNoticeRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateOrgScheduleRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktHistoryRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/**
 * MyPage 일정 박스(AS-IS frm/Monitoring_Page_Relate) 탭 6개 조회.
 * AS-IS 매퍼 sch01_info · mkt03_history · bbs02_notice · emp20_leave · mrb01_booking 의 MyPage 문장만 모았다(화면 하나가 부르는 묶음)
 */
@Mapper
public interface FrmRelateMapper {

    /** AS-IS sch01_info.selectMyPageSchedule — 나의일정 */
    List<FrmRelateMyScheduleRes> selectMyPageSchedule(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                                      @Param("orgId") Long orgId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS sch01_info.selectMyPageOrgSchedule — 부서일정 (소속 조직만, dailyYn=false, searchText='%') */
    List<FrmRelateOrgScheduleRes> selectMyPageOrgSchedule(@Param("companyId") Long companyId, @Param("orgId") Long orgId,
                                                          @Param("stdDate") LocalDate stdDate, @Param("dailyYn") Boolean dailyYn,
                                                          @Param("searchText") String searchText);

    /** AS-IS mkt03_history.selectByRegDate — 업무활동(작성일 = 기준일) */
    List<MktHistoryRes> selectByRegDate(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                        @Param("orgId") Long orgId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS bbs02_notice.selectPersonNotice — 알림 */
    List<FrmRelateNoticeRes> selectPersonNotice(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                                @Param("orgId") Long orgId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS emp20_leave.selectByDate (shareCheck=true) — 자리비움 */
    List<FrmRelateLeaveRes> selectLeaveByDate(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                              @Param("orgId") Long orgId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS mrb01_booking.selectByBookingDate — 예약(회의실·공용차량) */
    List<FrmRelateBookingRes> selectByBookingDate(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);
}
