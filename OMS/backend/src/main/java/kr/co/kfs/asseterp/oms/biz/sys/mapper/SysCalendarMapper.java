package kr.co.kfs.asseterp.oms.biz.sys.mapper;

import kr.co.kfs.asseterp.oms.biz.sys.dto.CalendarParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CalendarRes;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** 일자 sys12_calendar (AS-IS sys12_calendar 매퍼) */
@Mapper
public interface SysCalendarMapper {
    CalendarRes selectById(Long calendarId);

    /** 회사의 연도(·월) 일자 */
    List<CalendarRes> searchByYear(CalendarParam param);

    /** 그 날의 사용 고객사 일자 (admin 회사 제외) */
    List<CalendarRes> searchCustomersByDay(CalendarParam param);

    /** 회사의 연도 일자 삭제 */
    int deleteByYear(CalendarParam param);

    /** 회사의 연도 일자 생성 (주말·휴일(sys14) 비영업일) */
    int insertYear(CalendarParam param);

    /** companyId가 null이면 회사 조건 없이 (KFS 관리자) */
    int update(CalendarParam param);
}
