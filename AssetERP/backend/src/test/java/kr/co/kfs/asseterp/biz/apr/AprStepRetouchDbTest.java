package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveStepReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprWriteRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewStepRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRetouchReq;
import kr.co.kfs.asseterp.biz.apr.service.AprApprActionService;
import kr.co.kfs.asseterp.biz.apr.service.AprApprDetailService;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.apr.service.AprStepEditService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.support.NoticeTestConfig;

/** V08 결재중 문서의 결재선 수정·최근 결재선 불러오기를 asseterpdb의 실제 문서로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprStepEditService.class, AprApprActionService.class, AprApprDetailService.class, AprNoticeService.class, NoticeTestConfig.class})
class AprStepRetouchDbTest {

    @Autowired AprStepEditService service;
    @Autowired AprApprActionService action;
    @Autowired JdbcTemplate jdbc;

    /** 상신자 29035 → 29049 승인 → 202306221546363 대기(차례) → 202406201712129 대기 */
    private static final long MIDDLE = 202608249852607L;
    private static final long TURN = 202306221546363L;
    private static final long REFERER = 29053L;

    private static UserPrincipal user(long id) {
        return UserPrincipal.builder().userId(id).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private List<AprApprSaveStepReq> current() {
        return jdbc.query("select apr04_appr_step_id, apr04_seq, apr04_step_type_cd, apr04_step_status_cd, apr04_step_emp_id from apr04_appr_step where apr04_appr_id = ? order by apr04_seq", (rs, i) ->
                new AprApprSaveStepReq(rs.getLong(1), rs.getString(3), rs.getString(2), rs.getString(4), rs.getLong(5), "false", null), MIDDLE);
    }

    @Test
    void 결재선_수정_단추는_내_차례인_결재자에게만_켜진다() {
        assertThat(action.getState(user(TURN), MIDDLE).canRetouchSteps()).isTrue();
        assertThat(action.getState(user(202406201712129L), MIDDLE).canRetouchSteps()).isFalse();   // 아직 차례 아님
        assertThat(action.getState(user(29035L), MIDDLE).canRetouchSteps()).isFalse();             // 상신자
    }

    @Test
    void 줄을_더하고_지우면_번호가_바뀌고_내가_넣은_줄만_지울_수_있다() {
        List<AprApprSaveStepReq> steps = new ArrayList<>(current());
        int before = steps.size();
        AprNewStepRes line = service.lines(user(TURN), new kr.co.kfs.asseterp.biz.apr.dto.AprStepLineReq("30",
                List.of(new kr.co.kfs.asseterp.biz.apr.dto.AprStepPersonReq(REFERER, jdbc.queryForObject("select CAST(f_get_emptrans(29053, f_today()::date, 'org_code_id') AS NUMERIC)", Long.class))))).get(0);
        steps.add(new AprApprSaveStepReq(line.apprStepId(), "30", String.format("%03d", before + 1), "", REFERER, "false", null));

        AprApprWriteRes res = service.retouch(user(TURN), MIDDLE, new AprRetouchReq(steps, List.of()));
        assertThat(res.ok()).isTrue();
        assertThat(current()).hasSize(before + 1);
        assertThat(jdbc.queryForObject("select apr04_add_emp_id from apr04_appr_step where apr04_appr_step_id = ?", Long.class, line.apprStepId())).isEqualTo(TURN);

        // 남이 넣은 줄(기존 줄)은 지울 수 없다
        Long other = current().get(1).apprStepId();
        assertThat(service.retouch(user(TURN), MIDDLE, new AprRetouchReq(current(), List.of(other))).ok()).isFalse();
        // 내가 넣은 줄은 지울 수 있다
        List<AprApprSaveStepReq> rest = new ArrayList<>(current());
        rest.removeIf(s -> s.apprStepId().equals(line.apprStepId()));
        assertThat(service.retouch(user(TURN), MIDDLE, new AprRetouchReq(rest, List.of(line.apprStepId()))).ok()).isTrue();
        assertThat(current()).hasSize(before);
    }

    @Test
    void 차례가_아닌_사원은_결재선을_수정할_수_없다() {
        assertThat(service.retouch(user(202406201712129L), MIDDLE, new AprRetouchReq(current(), List.of())).ok()).isFalse();
    }

    @Test
    void 최근_결재선_불러오기는_상신자를_뺀_줄을_다시_만든다() {
        var lines = service.recentLines(user(29035L), MIDDLE);
        assertThat(lines).isNotEmpty();
        assertThat(lines).noneMatch(l -> "00".equals(l.stepTypeCode()));
        assertThat(lines.get(0).stepApprName()).contains("(");
        assertThat(service.recentDocs(user(29035L), "group", "")).isNotNull();
    }
}
