package kr.co.kfs.asseterp.biz.sch;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoCopyReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoManagerRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch01InfoSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch06AlarmRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch06AlarmSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch08ClassRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch08ClassSaveReq;
import kr.co.kfs.asseterp.biz.sch.service.SchAlarmService;
import kr.co.kfs.asseterp.biz.sch.service.SchClassService;
import kr.co.kfs.asseterp.biz.sch.service.SchInfoService;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

/** O01 업무일정 등록(Sch01_Tab_Info)의 등록·수정·삭제·공유·담당자 변경·분류·알람을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({SchInfoService.class, SchClassService.class, SchAlarmService.class})
class SchInfoDbTest {

    @Autowired SchInfoService infoService;
    @Autowired SchClassService classService;
    @Autowired SchAlarmService alarmService;
    @Autowired JdbcTemplate jdbc;
    /** 담당자 변경이 첨부파일을 새 일정에 연결할 때 파일 목록만 읽는다 */
    @MockitoBean SysFileService fileService;

    /** kfstest 사용자 — 일정 24건의 담당자 */
    private static final long COMPANY = 28000L;
    private static final long USER_ID = 29049L;
    private static final UserPrincipal USER = UserPrincipal.builder().userId(USER_ID).companyId(COMPANY).name("O01시험").build();
    /** 관리자 역할이 없는 같은 회사 사원 */
    private static final UserPrincipal PLAIN = UserPrincipal.builder().userId(29055L).companyId(COMPANY).name("일반").build();
    private static final UserPrincipal OTHER = UserPrincipal.builder().userId(-2L).companyId(1L).name("남").build();
    /** 기한 1·공유 1·알람 1·발생한 스케줄 8건·분류 없음 */
    private static final long INFO_USED = 33376L;
    /** 기한 3건, 발생한 스케줄 없음, 분류 없음 */
    private static final long INFO_FREE = 202203140095969L;
    /** 분류가 있는 일정 */
    private static final long INFO_CLASS = 33379L;

    private long count(String sql, Object... args) {
        return jdbc.queryForObject(sql, Long.class, args);
    }

    @Test
    void 조회는_담당자의_일정만_주고_조건으로_거른다() {
        long all = count("SELECT COUNT(*) FROM sch01_info WHERE sch01_company_id = ? AND sch01_manager_id = ?", COMPANY, USER_ID);
        assertThat(infoService.search(USER, null, "%", "", false, false)).hasSize((int) all);
        long used = count("SELECT COUNT(*) FROM sch01_info WHERE sch01_company_id = ? AND sch01_manager_id = ? AND COALESCE(sch01_use_yn,'false') = 'true'", COMPANY, USER_ID);
        assertThat(infoService.search(USER, null, "%", "", false, true)).hasSize((int) used);
        assertThat(infoService.search(USER, null, "%", "", false, false)).allMatch(r -> r.managerId() == USER_ID);
        // 분류·주기 조건
        assertThat(infoService.search(USER, 202411012006113L, "%", "", false, false)).extracting(Sch01InfoRes::infoId).contains(INFO_CLASS);
        assertThat(infoService.search(USER, null, "%", "", false, false)).filteredOn(r -> r.infoId() == INFO_USED).singleElement()
                .satisfies(r -> assertThat(r.deadlineName()).isNotBlank());
        assertThat(infoService.search(OTHER, null, "%", "", false, false)).isEmpty();
    }

    @Test
    void 등록하면_빈_행이_생기고_저장하면_고쳐지고_닫으면_되돌린다() {
        Sch01InfoRes created = infoService.create(USER);
        assertThat(created.managerId()).isEqualTo(USER_ID);
        assertThat(created.useYn()).isTrue();
        assertThat(created.title()).isNull();

        Sch01InfoRes saved = infoService.update(USER, created.infoId(), new Sch01InfoSaveReq(null, "O01시험 일정", "내용", true, false, true));
        assertThat(saved.title()).isEqualTo("O01시험 일정");
        assertThat(saved.dailyYn()).isTrue();
        assertThat(saved.dailyYnName()).isEqualTo("O");
        assertThat(saved.privateYnName()).isEmpty();
        assertThat(infoService.get(USER, created.infoId()).content()).isEqualTo("내용");
        assertThatThrownBy(() -> infoService.get(OTHER, created.infoId())).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> infoService.update(OTHER, created.infoId(), new Sch01InfoSaveReq(null, "x", null, false, false, true)))
                .isInstanceOf(BusinessException.class);

        assertThat(infoService.rollback(OTHER, created.infoId())).isZero();
        assertThat(infoService.rollback(USER, created.infoId())).isEqualTo(1);
        assertThat(count("SELECT COUNT(*) FROM sch01_info WHERE sch01_info_id = ?", created.infoId())).isZero();
    }

    @Test
    void 삭제는_이미_발생한_스케줄이_있으면_막힌다() {
        assertThatThrownBy(() -> infoService.delete(USER, List.of(INFO_USED)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("이미 발생한 스케줄이므로 삭제할 수 없는 정보입니다");
        assertThat(count("SELECT COUNT(*) FROM sch01_info WHERE sch01_info_id = ?", INFO_USED)).isEqualTo(1);

        Sch01InfoRes created = infoService.create(USER);
        assertThat(infoService.delete(USER, List.of(created.infoId()))).isEqualTo(1);
        assertThat(infoService.delete(USER, List.of())).isZero();
    }

    @Test
    void 공유는_행을_더하고_고치고_지운다() {
        Sch01InfoRes created = infoService.create(USER);
        long infoId = created.infoId();
        assertThat(infoService.searchShares(USER, infoId)).isEmpty();

        List<Sch02ShareRes> saved = infoService.saveShares(USER, infoId, List.of(
                new Sch02ShareSaveReq(-1L, "1", USER_ID, null, null, null),
                new Sch02ShareSaveReq(-2L, "2", null, 1L, null, null)));
        assertThat(saved).hasSize(2);
        assertThat(saved).extracting(Sch02ShareRes::shareCode).containsExactly("1", "2");
        assertThat(saved.get(0).infoId()).isEqualTo(infoId);
        assertThat(infoService.searchShares(USER, infoId)).hasSize(2);
        assertThat(count("SELECT COUNT(*) FROM sch02_share WHERE sch02_info_id = ? AND sch02_company_id = ?", infoId, COMPANY)).isEqualTo(2);

        assertThat(infoService.deleteShares(USER, infoId, List.of(saved.get(0).shareId()))).isEqualTo(1);
        assertThat(infoService.searchShares(USER, infoId)).hasSize(1);
        assertThatThrownBy(() -> infoService.searchShares(OTHER, infoId)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 담당자_변경은_복사하고_이동이면_원래_일정을_미사용으로_바꾼다() {
        long other = 29055L;
        long infoBefore = count("SELECT COUNT(*) FROM sch01_info WHERE sch01_manager_id = ?", other);
        long shareBefore = count("SELECT COUNT(*) FROM sch02_share");
        long deadlineBefore = count("SELECT COUNT(*) FROM sch03_deadline");
        long alarmBefore = count("SELECT COUNT(*) FROM sch06_alarm");
        long classBefore = count("SELECT COUNT(*) FROM sch08_class WHERE sch08_person_id = ?", other);

        // 복사 — 분류 없는 일정(공유 1·기한 1·알람 1)과 분류 있는 일정
        infoService.copy(USER, new Sch01InfoCopyReq(other, "COPY", List.of(INFO_USED, INFO_CLASS)));
        assertThat(count("SELECT COUNT(*) FROM sch01_info WHERE sch01_manager_id = ?", other)).isEqualTo(infoBefore + 2);
        assertThat(count("SELECT COUNT(*) FROM sch02_share")).isEqualTo(shareBefore + 2);
        assertThat(count("SELECT COUNT(*) FROM sch03_deadline")).isEqualTo(deadlineBefore + 2);
        assertThat(count("SELECT COUNT(*) FROM sch06_alarm")).isEqualTo(alarmBefore + 1);
        assertThat(count("SELECT COUNT(*) FROM sch08_class WHERE sch08_person_id = ?", other)).isEqualTo(classBefore + 1);
        assertThat(count("SELECT COUNT(*) FROM sch08_class WHERE sch08_person_id = ? AND sch08_note = '담당자 변경 작업으로 자동생성'", other)).isPositive();
        assertThat(count("SELECT COUNT(*) FROM sch01_info WHERE sch01_info_id = ? AND sch01_use_yn = 'true'", INFO_USED)).isEqualTo(1);

        // 이동 — 원래 일정이 미사용으로
        infoService.copy(USER, new Sch01InfoCopyReq(other, "MOVE", List.of(INFO_FREE)));
        assertThat(count("SELECT COUNT(*) FROM sch01_info WHERE sch01_manager_id = ?", other)).isEqualTo(infoBefore + 3);
        assertThat(count("SELECT COUNT(*) FROM sch01_info WHERE sch01_info_id = ? AND sch01_use_yn = 'false'", INFO_FREE)).isEqualTo(1);
        assertThat(count("SELECT COUNT(*) FROM sch03_deadline")).isEqualTo(deadlineBefore + 2 + 3);

        assertThatThrownBy(() -> infoService.copy(USER, new Sch01InfoCopyReq(null, "MOVE", List.of(INFO_FREE)))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> infoService.copy(USER, new Sch01InfoCopyReq(other, "MOVE", List.of()))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 담당자_변경은_첨부파일을_새_일정에_연결한다() {
        Long fileId = jdbc.queryForObject("SELECT sys10_file_id FROM sys10_file ORDER BY sys10_file_id LIMIT 1", Long.class);
        when(fileService.searchByParentId(anyLong())).thenReturn(List.of(
                new FileRes(fileId, INFO_FREE, "a.pdf", null, null, null, null, "pdf", null, null, null)));
        long before = count("SELECT COUNT(*) FROM sys11_relate_file WHERE sys11_parent_table = 'sch01_info'");
        infoService.copy(USER, new Sch01InfoCopyReq(29055L, "COPY", List.of(INFO_FREE)));
        assertThat(count("SELECT COUNT(*) FROM sys11_relate_file WHERE sys11_parent_table = 'sch01_info'")).isEqualTo(before + 1);
    }

    @Test
    void 담당자_변경_창은_담당자의_사용_중_비공개_아닌_일정을_준다() {
        List<Sch01InfoManagerRes> rows = infoService.searchByManager(USER, USER_ID, null, "");
        assertThat(rows).isNotEmpty();
        assertThat(rows).allMatch(r -> r.managerId() == USER_ID && Boolean.TRUE.equals(r.useYn()) && !Boolean.TRUE.equals(r.privateYn()));
        assertThat(infoService.searchByManager(USER, USER_ID, 202411012006113L, "")).extracting(Sch01InfoManagerRes::infoId).contains(INFO_CLASS);
    }

    @Test
    void 다른_담당자의_일정은_관리자_역할이_있어야_다룬다() {
        assertThat(infoService.isUserManager(USER)).isTrue();
        assertThat(infoService.isUserManager(PLAIN)).isFalse();
        assertThat(infoService.isUserManager(UserPrincipal.builder().userId(-2L).companyId(COMPANY).name("회사관리자").build())).isFalse();

        assertThat(infoService.searchByManager(PLAIN, 29055L, null, "")).isNotNull();
        assertThatThrownBy(() -> infoService.searchByManager(PLAIN, USER_ID, null, "")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> infoService.copy(PLAIN, new Sch01InfoCopyReq(29055L, "COPY", List.of(INFO_FREE)))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 분류는_사용자별로_저장하고_쓰는_분류는_지울_수_없다() {
        List<Sch08ClassRes> saved = classService.save(USER, List.of(new Sch08ClassSaveReq(-1L, "O01시험분류", 99L, true, "비고")));
        assertThat(saved).singleElement().satisfies(r -> {
            assertThat(r.personId()).isEqualTo(USER_ID);
            assertThat(r.className()).isEqualTo("O01시험분류");
        });
        long classId = saved.get(0).classId();
        assertThat(classService.combo(USER)).anyMatch(c -> c.code().equals(String.valueOf(classId)) && c.name().equals("O01시험분류"));
        assertThat(classService.combo(OTHER)).isEmpty();

        classService.save(USER, List.of(new Sch08ClassSaveReq(classId, "O01시험분류2", 98L, false, null)));
        assertThat(classService.search(USER)).anyMatch(r -> r.classId() == classId && !r.useYn() && r.className().equals("O01시험분류2"));
        assertThat(classService.combo(USER)).noneMatch(c -> c.code().equals(String.valueOf(classId)));

        classService.checkDelete(classId);
        Long usedClass = jdbc.queryForObject("SELECT sch01_class_id FROM sch01_info WHERE sch01_info_id = ?", Long.class, INFO_CLASS);
        assertThatThrownBy(() -> classService.checkDelete(usedClass)).isInstanceOf(BusinessException.class).hasMessageContaining("사용중인 분류는 삭제 불가합니다");

        assertThat(classService.delete(OTHER, List.of(classId))).isZero();
        assertThat(classService.delete(USER, List.of(classId))).isEqualTo(1);
    }

    @Test
    void 알람은_행을_더하고_고치고_지운다() {
        Sch01InfoRes created = infoService.create(USER);
        long infoId = created.infoId();
        assertThat(alarmService.search(USER, infoId)).isEmpty();

        List<Sch06AlarmRes> saved = alarmService.save(USER, List.of(new Sch06AlarmSaveReq(-1L, "SCH", infoId, "1", "D", 3L, "1", "AM", "09", "00", "1", true)));
        Sch06AlarmRes alarm = saved.get(0);
        assertThat(alarm.companyId()).isEqualTo(COMPANY);
        assertThat(alarm.dayWeekName()).isNotBlank();
        assertThat(alarm.num()).isEqualTo(3L);
        assertThat(alarmService.search(OTHER, infoId)).isEmpty();

        Sch06AlarmRes changed = alarmService.save(USER, List.of(new Sch06AlarmSaveReq(alarm.alarmId(), "SCH", infoId, "1", "W", 1L, "2", "PM", "10", "30", "2", false))).get(0);
        assertThat(changed.dayWeekCode()).isEqualTo("W");
        assertThat(changed.useYn()).isFalse();
        assertThat(count("SELECT COUNT(*) FROM sch01_info WHERE sch01_info_id = ? AND (SELECT COUNT(*) FROM sch06_alarm WHERE sch06_target_id = ?) = 1", infoId, infoId)).isEqualTo(1);

        assertThat(alarmService.delete(OTHER, List.of(alarm.alarmId()))).isZero();
        assertThat(alarmService.delete(USER, List.of(alarm.alarmId()))).isEqualTo(1);
    }
}
