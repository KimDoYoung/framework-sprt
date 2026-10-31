package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprRelateReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveStepReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprWriteRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprRelateEditMapper;
import kr.co.kfs.asseterp.biz.apr.service.AprApprWriteService;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.support.NoticeTestConfig;

/** V13 연관 탭 다섯 개의 저장과 마감일 검사를 asseterpdb에서 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprApprWriteService.class, AprNoticeService.class, NoticeTestConfig.class})
class AprApprRelateDbTest {

    @Autowired AprApprWriteService service;
    @Autowired AprRelateEditMapper relateMapper;
    @Autowired JdbcTemplate jdbc;

    private static final long ME = 29035L;
    private static final long APPROVER = 202312071648256L;
    private static final long SIMPLE = 202609229873969L;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(ME).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private long one(String sql) {
        return jdbc.queryForObject(sql, Long.class);
    }

    private AprApprSaveReq req(String mode, AprApprRelateReq relates) {
        Long classTreeId = jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, SIMPLE);
        List<AprApprSaveStepReq> steps = List.of(new AprApprSaveStepReq(null, "00", "001", null, ME, "false", null),
                new AprApprSaveStepReq(null, "10", "002", null, APPROVER, "false", null));
        return new AprApprSaveReq(mode, classTreeId, null, "연관 시험", "<p>본문</p>", null, LocalDateTime.of(2026, 11, 2, 0, 0), LocalDateTime.of(2026, 10, 31, 0, 0),
                null, null, null, "20", null, null, null, null, "의견", false, steps, relates);
    }

    private int count(String table, String col, long id) {
        return jdbc.queryForObject("select count(*) from " + table + " where " + col + " = ?", Integer.class, id);
    }

    /** 주기가 '해당없음'이 아닌 기한 하나 (마감일 검사에 걸리는 줄) */
    private long deadlineWithClose() {
        for (Long d : jdbc.queryForList("select distinct apr20_deadline_id from apr20_relate_ics where apr20_deadline_id is not null limit 50", Long.class)) {
            String cycle = relateMapper.selectCycleName(d);
            if (cycle != null && !"해당없음".equals(cycle)) {
                return d;
            }
        }
        throw new IllegalStateException("시험할 기한이 없다");
    }

    @Test
    void 임시저장은_연관_다섯_탭을_화면_내용으로_바꾼다() {
        long id = service.nextApprId();
        long fund = one("select fnd01_fund_code_id from fnd01_fund_code where fnd01_company_id = 28000 limit 1");
        long adv = one("select adv02_account_id from adv02_account limit 1");
        long ics = one("select apr20_class_tree_id from apr20_relate_ics where apr20_deadline_id is not null limit 1");
        long icsDeadline = one("select apr20_deadline_id from apr20_relate_ics where apr20_class_tree_id = " + ics + " and apr20_deadline_id is not null limit 1");
        long icr = one("select apr22_class_tree_id from apr22_relate_icr where apr22_deadline_id is not null limit 1");
        long icrDeadline = one("select apr22_deadline_id from apr22_relate_icr where apr22_class_tree_id = " + icr + " and apr22_deadline_id is not null limit 1");

        AprApprRelateReq relates = new AprApprRelateReq(
                List.of(new AprApprRelateReq.Fund(null, fund, "false", "false")),
                List.of(new AprApprRelateReq.Adv(null, adv)),
                List.of(new AprApprRelateReq.Appr(null, SIMPLE)),
                List.of(new AprApprRelateReq.Law(null, ics, icsDeadline, "20", LocalDate.of(2026, 10, 31), LocalDate.of(2026, 11, 30), "true")),
                List.of(new AprApprRelateReq.Law(null, icr, icrDeadline, "10", null, LocalDate.of(2026, 12, 31), "false")));
        AprApprWriteRes res = service.save(user(), id, req("save", relates));
        assertThat(res.ok()).as(res.message()).isTrue();
        assertThat(count("apr03_relate_fund", "apr03_appr_id", id)).isEqualTo(1);
        assertThat(count("apr12_relate_adv", "apr12_appr_id", id)).isEqualTo(1);
        assertThat(count("apr21_relate_appr", "apr21_appr_id", id)).isEqualTo(1);
        assertThat(count("apr20_relate_ics", "apr20_appr_id", id)).isEqualTo(1);
        assertThat(count("apr22_relate_icr", "apr22_appr_id", id)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select apr20_stand_yn from apr20_relate_ics where apr20_appr_id = ?", String.class, id)).isEqualTo("true");

        // 다시 저장하면 화면에 남은 줄만 남는다 — 목록이 null인 탭(연관문서)은 그대로, 빈 목록은 모두 지운다
        AprApprRelateReq second = new AprApprRelateReq(List.of(), List.of(), null, null, List.of());
        assertThat(service.save(user(), id, req("save", second)).ok()).isTrue();
        assertThat(count("apr03_relate_fund", "apr03_appr_id", id)).isZero();
        assertThat(count("apr12_relate_adv", "apr12_appr_id", id)).isZero();
        assertThat(count("apr21_relate_appr", "apr21_appr_id", id)).isEqualTo(1);
        assertThat(count("apr20_relate_ics", "apr20_appr_id", id)).isEqualTo(1);
        assertThat(count("apr22_relate_icr", "apr22_appr_id", id)).isZero();
    }

    @Test
    void 연관을_보내지_않으면_연관_테이블을_건드리지_않는다() {
        long id = service.nextApprId();
        assertThat(service.save(user(), id, req("save", null)).ok()).isTrue();
        assertThat(count("apr21_relate_appr", "apr21_appr_id", id)).isZero();
    }

    @Test
    void 결재요청은_연관법규_내규의_마감일을_검사한다() {
        long id = service.nextApprId();
        long ics = one("select apr20_class_tree_id from apr20_relate_ics where apr20_deadline_id is not null limit 1");
        long deadline = deadlineWithClose();
        AprApprRelateReq noClose = new AprApprRelateReq(null, null, null,
                List.of(new AprApprRelateReq.Law(null, ics, deadline, "20", LocalDate.of(2026, 10, 31), null, "false")), null);
        AprApprWriteRes res = service.save(user(), id, req("request", noClose));
        assertThat(res.ok()).isFalse();
        assertThat(res.message()).isEqualTo("연관법규의 마감일을 입력해주세요");
        assertThat(count("apr01_appr", "apr01_appr_id", id)).isZero();

        AprApprRelateReq icrNoClose = new AprApprRelateReq(null, null, null, null,
                List.of(new AprApprRelateReq.Law(null, ics, deadline, "20", LocalDate.of(2026, 10, 31), null, "false")));
        assertThat(service.save(user(), id, req("request", icrNoClose)).message()).isEqualTo("연관내규의 마감일을 입력해주세요");

        // 임시저장은 마감일이 없어도 저장된다
        assertThat(service.save(user(), id, req("save", noClose)).ok()).isTrue();
    }
}
