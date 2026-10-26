package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CalendarRes;
import kr.co.kfs.asseterp.biz.sys.dto.CalendarSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysCalendarMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS server/sys/Sys12_Calendar.java (selectByYear L36 / insertAuto L87 / update L77 / updateList L72 / selectByDay L31).
 * 본 화면(조회·저장·생성)은 로그인 회사의 일자, 고객사반영(selectByDay·updateList)은 관리자 회사만.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysCalendarService {

    private final SysCalendarMapper mapper;

    /** AS-IS selectByYear: month '%' = 전체 */
    public List<CalendarRes> search(UserPrincipal user, String year, String month) {
        return mapper.selectByYear(user.getCompanyId(), year, month == null || month.isEmpty() ? "%" : month);
    }

    /** AS-IS Sys12_Calendar.selectBizDate L60: 기준일에서 type(-1 = 전 영업일)만큼 이동한 영업일, yyyy-MM-dd */
    public String bizDate(UserPrincipal user, java.time.LocalDate stdDate, String type) {
        return mapper.selectBizDate(user.getCompanyId(), stdDate, type);
    }

    /** AS-IS insertAuto: 그 해의 일자를 지우고 다시 만든다. 원본은 월 인자를 받아도 쓰지 않는다(연 전체) */
    @Transactional
    public void generate(UserPrincipal user, String year) {
        if (year == null || !year.matches("\\d{4}")) {
            // AS-IS: to_date 오류 메시지(e.getMessage())가 그대로 뜬다 — 원인이 분명해 미리 막는다
            throw new BusinessException(ErrorCode.INVALID_INPUT, "년도를 4자리 숫자로 입력해주세요");
        }
        mapper.deleteByDay(user.getCompanyId(), year + "0101", year + "1231");
        mapper.insertAuto(user.getCompanyId(), year + "0101", year + "1231");
    }

    /** AS-IS update(UpdateDataModel) → 저장된 행(요청 순서). UPDATE에 회사 조건을 더했다(05 §6) */
    @Transactional
    public List<CalendarRes> update(UserPrincipal user, List<CalendarSaveReq> rows) {
        List<CalendarRes> saved = new ArrayList<>();
        for (CalendarSaveReq req : rows) {
            if (req.calendarId() == null || mapper.updateCalendar(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(req.calendarId()));
        }
        return saved;
    }

    /** AS-IS selectByDay: 고객사반영 조회창 — 관리자 회사만 */
    public List<CalendarRes> searchByDay(UserPrincipal user, String day) {
        requireSysAdmin(user);
        return mapper.selectByDay(day);
    }

    /** AS-IS update·updateList(UpdateDataModel): 고객사 일자의 영업일·휴일사유 → 저장한 행 수 */
    @Transactional
    public int updateCustomers(UserPrincipal user, List<CalendarSaveReq> rows) {
        requireSysAdmin(user);
        for (CalendarSaveReq req : rows) {
            if (req.calendarId() == null || mapper.updateOff(req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return rows.size();
    }

    private void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
