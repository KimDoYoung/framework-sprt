package kr.co.kfs.asseterp.biz.emp;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EvalGradeRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalGradeSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalListRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalListSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalListStdRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpEvalGradeService;
import kr.co.kfs.asseterp.biz.emp.service.EmpEvalListService;
import kr.co.kfs.asseterp.biz.emp.service.EmpEvalListStdService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** E26(인사평가 항목)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({EmpEvalListStdService.class, EmpEvalListService.class, EmpEvalGradeService.class})
class EmpEvalDbTest {

    @Autowired EmpEvalListStdService stds;
    @Autowired EmpEvalListService lists;
    @Autowired EmpEvalGradeService grades;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(1L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 적용일_생성은_가장_최근_항목과_등급을_복사하고_중복은_막는다() {
        int before = stds.search(admin).size();
        LocalDate date = LocalDate.of(2031, 1, 1);

        Long id = stds.create(admin, date);
        List<EvalListStdRes> all = stds.search(admin);
        assertThat(all).hasSize(before + 1);
        assertThat(all.get(0).evalListStdId()).isEqualTo(id);  // 적용일 최근 순
        assertThat(all.get(0).fixYn()).isEqualTo("false");

        // 관리자 회사(0)의 가장 최근(오늘 이전) 항목·등급이 그대로 복사된다
        int srcLists = jdbc.queryForObject("""
                select count(*) from emp41_eval_list where emp41_eval_list_std_id = (
                  select emp40_eval_list_std_id from emp40_eval_list_std
                   where emp40_company_id = 0 and emp40_start_date <= current_date and emp40_eval_list_std_id <> ?
                   order by emp40_start_date desc limit 1)""", Integer.class, id);
        assertThat(lists.search(admin, id)).hasSize(srcLists);
        assertThat(lists.search(admin, id)).extracting(EvalListRes::evalClassName).doesNotContainNull();  // f_cdnm
        assertThat(grades.search(admin, id)).isNotEmpty();

        assertThatThrownBy(() -> stds.create(admin, date)).isInstanceOf(BusinessException.class).hasMessage("이미 생성된 기준 적용일입니다");
        assertThat(stds.inUse(id)).isFalse();

        stds.delete(admin, id);
        assertThat(stds.search(admin)).hasSize(before);
        assertThat(jdbc.queryForObject("select count(*) from emp41_eval_list where emp41_eval_list_std_id = ?", Integer.class, id)).isZero();
        assertThat(jdbc.queryForObject("select count(*) from emp42_eval_grade where emp42_eval_list_std_id = ?", Integer.class, id)).isZero();
    }

    @Test
    void 확정과_확정취소() {
        LocalDate date = LocalDate.of(2031, 2, 1);
        Long id = stds.create(admin, date);

        stds.updateFixYn(admin, date, true);
        assertThat(stds.search(admin).stream().filter(s -> s.evalListStdId().equals(id)).findFirst().orElseThrow().fixYn()).isEqualTo("true");
        stds.updateFixYn(admin, date, false);
        assertThat(stds.search(admin).stream().filter(s -> s.evalListStdId().equals(id)).findFirst().orElseThrow().fixYn()).isEqualTo("false");
    }

    @Test
    void 항목_저장은_새_행_수정_삭제대기를_한_번에_처리하고_다른_회사는_못_다룬다() {
        Long id = stds.create(admin, LocalDate.of(2031, 3, 1));
        List<EvalListRes> src = lists.search(admin, id);
        EvalListRes first = src.get(0);
        EvalListRes second = src.get(1);

        int saved = lists.update(admin, new EvalListSaveReq(id, List.of(
                new EvalListSaveReq.Row(first.evalListId(), first.evalClassCode(), "수정한 내용", 11L, 22L, 5L),
                new EvalListSaveReq.Row(-1L, first.evalClassCode(), "새 행", 0L, 0L, 99L)), List.of(second.evalListId())));
        assertThat(saved).isEqualTo(2);

        List<EvalListRes> after = lists.search(admin, id);
        assertThat(after).hasSize(src.size());  // 새 행 +1, 삭제대기 -1
        assertThat(after).extracting(EvalListRes::content).contains("수정한 내용", "새 행").doesNotContain(second.content());
        assertThat(after.stream().filter(r -> r.evalListId().equals(first.evalListId())).findFirst().orElseThrow().weightLeader()).isEqualTo(22L);

        // 다른 회사는 이 적용기준을 보지도 고치지도 못하고, 다른 적용기준의 행은 고쳐지지 않는다
        assertThatThrownBy(() -> lists.search(other, id)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> lists.update(other, new EvalListSaveReq(id, List.of(), List.of(first.evalListId())))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> stds.delete(other, id)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 평가등급_저장() {
        Long id = stds.create(admin, LocalDate.of(2031, 4, 1));
        List<EvalGradeRes> src = grades.search(admin, id);
        assertThat(src).isSortedAccordingTo((a, b) -> Long.compare(b.gradeScore(), a.gradeScore()));  // 기준점수 큰 순
        EvalGradeRes first = src.get(0);
        EvalGradeRes last = src.get(src.size() - 1);

        grades.update(admin, new EvalGradeSaveReq(id, List.of(
                new EvalGradeSaveReq.Row(first.evalGradeId(), "ZZ", 1.5, 99L, "1", "true"),
                new EvalGradeSaveReq.Row(null, "NEW", 0.5, 1L, "3", "false")), List.of(last.evalGradeId())));

        List<EvalGradeRes> after = grades.search(admin, id);
        assertThat(after).hasSize(src.size());
        assertThat(after).extracting(EvalGradeRes::grade).contains("ZZ", "NEW");
        EvalGradeRes zz = after.stream().filter(g -> g.grade().equals("ZZ")).findFirst().orElseThrow();
        assertThat(zz.gradeWeight()).isEqualTo(1.5);
        assertThat(zz.compareName()).isNotBlank();  // f_cdnm('CompareCode')
        assertThat(zz.reasonYn()).isEqualTo("true");
    }
}
