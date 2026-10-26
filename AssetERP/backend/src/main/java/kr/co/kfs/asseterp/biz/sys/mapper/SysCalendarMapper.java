package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.CalendarRes;
import kr.co.kfs.asseterp.biz.sys.dto.CalendarSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys12_calendar.xml + UpdateDataModel(sys12_calendar) */
@Mapper
public interface SysCalendarMapper {
    /** AS-IS selectByYear (month '%' = 전체) */
    List<CalendarRes> selectByYear(@Param("companyId") Long companyId, @Param("year") String year, @Param("month") String month);

    /** AS-IS selectByDay: 고객사반영 조회창(관리자 회사 0 제외, 사용 고객만) */
    List<CalendarRes> selectByDay(@Param("day") String day);

    CalendarRes selectById(@Param("calendarId") Long calendarId);

    /** UpdateDataModel(sys12_calendar) — 본 화면: 영업일·휴일사유·비고 */
    int updateCalendar(@Param("companyId") Long companyId, @Param("req") CalendarSaveReq req);

    /** UpdateDataModel(sys12_calendar) — 고객사반영: 영업일·휴일사유 */
    int updateOff(@Param("req") CalendarSaveReq req);

    /** AS-IS deleteByDay: 그 해 1/1~12/31 */
    int deleteByDay(@Param("companyId") Long companyId, @Param("startYmd") String startYmd, @Param("endYmd") String endYmd);

    /** AS-IS insertAuto: 기간의 모든 날을 만든다(토·일·sys14 휴일은 영업일 아님) */
    int insertAuto(@Param("companyId") Long companyId, @Param("startYmd") String startYmd, @Param("endYmd") String endYmd);

    /** AS-IS sys12_calendar.bizDate (selectBizDate): 기준일에서 type(-1 전영업일 등)만큼 이동한 영업일 */
    String selectBizDate(@Param("companyId") Long companyId, @Param("stdDate") java.time.LocalDate stdDate, @Param("type") String type);
}
