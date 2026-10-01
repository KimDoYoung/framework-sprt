package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.sys.dto.CalendarParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CalendarRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CalendarSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysCalendarMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** 일자관리 (AS-IS server/sys/Sys12_Calendar). 휴일관리(Sys14_Holiday)는 AS-IS에도 서버가 없어 변환하지 않는다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysCalendarService {

    private final SysCalendarMapper sysCalendarMapper;

    /** AS-IS selectByYear: month가 없으면 연도 전체 */
    public List<CalendarRes> searchCalendars(Long companyId, String year, String month) {
        requireYear(year);
        return sysCalendarMapper.searchByYear(CalendarParam.ofYear(companyId, year, month));
    }

    /** AS-IS update(UpdateDataModel). companyId가 null이면 회사 조건 없이 (고객사반영) → 저장된 행(요청 순서) */
    @Transactional
    public List<CalendarRes> updateCalendars(Long companyId, List<CalendarSaveReq> rows) {
        List<CalendarRes> saved = new ArrayList<>(rows.size());
        for (CalendarSaveReq req : rows) {
            if (sysCalendarMapper.update(CalendarParam.ofSave(companyId, req)) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysCalendarMapper.selectById(req.calendarId()));
        }
        return saved;
    }

    /** AS-IS insertAuto: 그 연도 일자를 지우고 다시 만든다 → 만든 일수 */
    @Transactional
    public int generateCalendars(Long companyId, String year) {
        requireYear(year);
        CalendarParam param = CalendarParam.ofYear(companyId, year, null);
        sysCalendarMapper.deleteByYear(param);
        return sysCalendarMapper.insertYear(param);
    }

    /** AS-IS selectByDay(companyId 없음): 그 날의 사용 고객사 일자 */
    public List<CalendarRes> searchCustomerCalendars(LocalDate day) {
        if (day == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "반영할 일자를 선택해주세요");
        }
        return sysCalendarMapper.searchCustomersByDay(new CalendarParam(null, null, null, day, null, null, null, null));
    }

    private void requireYear(String year) {
        if (year == null || !year.matches("\\d{4}")) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "년도를 4자리로 입력하세요.");
        }
    }
}
