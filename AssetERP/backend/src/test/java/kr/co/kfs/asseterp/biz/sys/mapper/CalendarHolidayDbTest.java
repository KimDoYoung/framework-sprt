package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CalendarRes;
import kr.co.kfs.asseterp.biz.sys.dto.CalendarSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.HolidayInitReq;
import kr.co.kfs.asseterp.biz.sys.dto.HolidayRes;
import kr.co.kfs.asseterp.biz.sys.dto.HolidaySaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysCalendarService;
import kr.co.kfs.asseterp.biz.sys.service.SysHolidayService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * A18 일자관리(일자·휴일·고객사반영)를 asseterpdb에서 실제로 돌리고 롤백한다.
 * 일자 "생성"은 그 해의 일자를 지우고 다시 만드는 동작이라 실제 회사로는 시험하지 않는다 — 없는 회사(99999)로 한다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({SysCalendarService.class, SysHolidayService.class})
class CalendarHolidayDbTest {

    private static final long FAKE = 99999L;

    @Autowired SysCalendarService calendar;
    @Autowired SysHolidayService holiday;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal fake = UserPrincipal.builder().userId(1L).companyId(FAKE).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 일자_생성은_그_해를_지우고_다시_만들며_토일과_휴일은_영업일이_아니다() {
        holiday.update(fake, List.of(new HolidaySaveReq(0L, "2031-03-03", "시험휴일", "메모")));  // 2031-03-03 = 월요일
        calendar.generate(fake, "2031");
        List<CalendarRes> year = calendar.search(fake, "2031", "%");
        assertThat(year).hasSize(365);
        // 다시 만들어도 그대로(지우고 만든다)
        calendar.generate(fake, "2031");
        assertThat(calendar.search(fake, "2031", null)).hasSize(365);
        assertThat(calendar.search(fake, "2031", "03")).hasSize(31);
        CalendarRes holidayRow = calendar.search(fake, "2031", "03").stream().filter(r -> r.day().equals("2031-03-03")).findFirst().orElseThrow();
        assertThat(holidayRow.weekday()).isEqualTo("월요일");
        assertThat(holidayRow.workingYn()).isEqualTo("false");
        assertThat(holidayRow.offReason()).isEqualTo("시험휴일");
        CalendarRes sunday = calendar.search(fake, "2031", "03").stream().filter(r -> r.day().equals("2031-03-02")).findFirst().orElseThrow();
        assertThat(sunday.weekday()).isEqualTo("일요일");
        assertThat(sunday.workingYn()).isEqualTo("false");
        CalendarRes weekday = calendar.search(fake, "2031", "03").stream().filter(r -> r.day().equals("2031-03-04")).findFirst().orElseThrow();
        assertThat(weekday.workingYn()).isEqualTo("true");
        // 다른 회사(0)의 일자는 건드리지 않는다
        assertThat(calendar.search(sysAdmin, "2031", "%")).isEmpty();
    }

    @Test
    void 일자_저장은_영업일_휴일사유_비고만_바꾸고_회사_범위() {
        calendar.generate(fake, "2031");
        CalendarRes row = calendar.search(fake, "2031", "05").get(0);
        List<CalendarRes> saved = calendar.update(fake, List.of(new CalendarSaveReq(row.calendarId(), "false", "시험사유", "시험비고")));
        assertThat(saved.get(0).workingYn()).isEqualTo("false");
        assertThat(saved.get(0).offReason()).isEqualTo("시험사유");
        assertThat(saved.get(0).note()).isEqualTo("시험비고");
        assertThat(saved.get(0).day()).isEqualTo(row.day());
        // 다른 회사로는 저장할 수 없다
        UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(FAKE + 1).roles(List.of("ROLE_ADMIN")).build();
        assertThatThrownBy(() -> calendar.update(other, List.of(new CalendarSaveReq(row.calendarId(), "true", "", ""))))
                .isInstanceOf(BusinessException.class);
        // 년도 검사
        assertThatThrownBy(() -> calendar.generate(fake, "20")).isInstanceOf(BusinessException.class);
    }

    @Test
    void 고객사반영은_관리자만_회사0을_빼고_그날_사용_고객만_보여_주고_영업일_휴일사유를_바꾼다() {
        calendar.generate(fake, "2031");
        assertThatThrownBy(() -> calendar.searchByDay(fake, "2031-05-01")).isInstanceOf(BusinessException.class);
        int expected = jdbc.queryForObject("select count(*) from sys12_calendar c join sys01_company o on o.sys01_company_id = c.sys12_company_id "
                + "where c.sys12_company_id != 0 and c.sys12_day = '2031-05-01'::timestamp and o.sys01_use_yn = 'true'", Integer.class);
        List<CalendarRes> list = calendar.searchByDay(sysAdmin, "2031-05-01");
        assertThat(list).hasSize(expected);
        // 가짜 회사는 sys01_company에 없어 목록에 없다 — 가짜 회사 행은 id로 직접 바꾼다
        CalendarRes row = calendar.search(fake, "2031", "05").get(0);
        calendar.updateCustomers(sysAdmin, List.of(new CalendarSaveReq(row.calendarId(), "false", "고객사반영", null)));
        CalendarRes changed = calendar.search(fake, "2031", "05").get(0);
        assertThat(changed.workingYn()).isEqualTo("false");
        assertThat(changed.offReason()).isEqualTo("고객사반영");
        assertThatThrownBy(() -> calendar.updateCustomers(fake, List.of(new CalendarSaveReq(row.calendarId(), "true", "", null))))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void 휴일_등록_수정_삭제는_로그인_회사_범위() {
        List<HolidayRes> saved = holiday.update(fake, List.of(new HolidaySaveReq(-1L, "2031-06-06", "현충일", "메모")));
        assertThat(saved.get(0).companyId()).isEqualTo(FAKE);
        assertThat(saved.get(0).day()).isEqualTo("2031-06-06");
        assertThat(holiday.search(fake, "2031")).hasSize(1);
        // 조회연도가 비면 결과 없음(원본), LIKE라 일부만 줘도 된다
        assertThat(holiday.search(fake, "")).isEmpty();
        assertThat(holiday.search(fake, "20%")).hasSize(1);
        Long id = saved.get(0).holidayId();
        assertThat(holiday.update(fake, List.of(new HolidaySaveReq(id, "2031-06-07", "수정", null))).get(0).holidayName()).isEqualTo("수정");
        UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(FAKE + 1).roles(List.of("ROLE_ADMIN")).build();
        assertThat(holiday.delete(other, List.of(id))).isZero();
        assertThat(holiday.delete(fake, List.of(id))).isEqualTo(1);
    }

    @Test
    void 기초데이터생성은_관리자만_고른_일자의_admin_휴일을_고객사로_복사하고_고객사를_꼭_골라야() {
        String day = jdbc.queryForObject("select to_char(min(sys14_day), 'YYYY-MM-DD') from sys14_holiday where sys14_company_id = 0", String.class);
        assertThatThrownBy(() -> holiday.insertInitData(fake, new HolidayInitReq(FAKE, List.of(day)))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> holiday.insertInitData(sysAdmin, new HolidayInitReq(null, List.of(day)))).isInstanceOf(BusinessException.class);
        // 같은 날을 두 번 해도 한 건(지우고 복사)
        holiday.insertInitData(sysAdmin, new HolidayInitReq(FAKE, List.of(day)));
        assertThat(holiday.insertInitData(sysAdmin, new HolidayInitReq(FAKE, List.of(day)))).isEqualTo(1);
        int copied = jdbc.queryForObject("select count(*) from sys14_holiday where sys14_company_id = ? and sys14_day = ?::timestamp", Integer.class, FAKE, day);
        int source = jdbc.queryForObject("select count(*) from sys14_holiday where sys14_company_id = 0 and sys14_day = ?::timestamp", Integer.class, day);
        assertThat(copied).isEqualTo(source);
    }
}
