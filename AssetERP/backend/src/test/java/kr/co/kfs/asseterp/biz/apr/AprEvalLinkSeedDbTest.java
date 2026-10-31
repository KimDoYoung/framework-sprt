package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.apr.service.link.EvalLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpEvalTargetService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V37 A70·A71 인사평가 보고 결재창 제목·본문과 emp45 상신 연결 행 만들기·결재 ID 기록을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, EvalLinkSeedProvider.class, EmpEvalTargetService.class})
class AprEvalLinkSeedDbTest {

    private static final long APPR = 202609229873969L;

    @Autowired AprLinkSeedService seedService;
    @Autowired EmpEvalTargetService evalService;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, APPR);
    }

    @Test
    void 수행결과_보고는_평가표와_평정사유를_넣는다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A70", null, Map.of("stdYear", "2025", "stdTermCode", "30"));
        assertThat(res.title()).startsWith("2025년도 ").endsWith(" 인사평가 수행결과 보고");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).contains("인사평가 수행결과를 다음과 같이 보고합니다.", "- 다 음 -", "인사평가대상자", "평정사유<br>가감", "## 평정사유 ##",
                "* 자세한 내역은 [경영관리 > 인사평가 > 인사평가 결과조회]");
        // 머리 8줄(빈 <tr></tr> 포함) + 대상자 6명 + 아래 3줄 = 17줄, 평정사유가 있으면 사유마다 2줄 더
        int rows = res.content().split("<tr>", -1).length - 1;
        assertThat(rows).isGreaterThanOrEqualTo(17);
        assertThat((rows - 17) % 2).isZero();
    }

    @Test
    void 최종보고는_대표이사_평가_열이_있다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A71", null, Map.of("stdYear", "2025", "stdTermCode", "30"));
        assertThat(res.title()).startsWith("2025년도 ").endsWith(" 인사평가결과 최종보고");
        assertThat(res.content()).contains("인사평가 최종 결과를 다음과 같이 보고합니다.", "대표이사<br>평가", "평가결과<br>(상벌가감후)", "최종 평가결과", "# 평정사유 ##");
    }

    @Test
    void 평가기간이_없거나_내역이_없으면_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A70", null, Map.of("stdYear", "2025")));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A70", null, Map.of("stdYear", "1999", "stdTermCode", "10")));
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(1L).name("타사").roles(List.of("ROLE_USER")).build();
        assertThrows(BusinessException.class, () -> seedService.seed(other, 1L, "A71", null, Map.of("stdYear", "2025", "stdTermCode", "30")));
    }

    @Test
    void 상신_연결_행은_없으면_만들고_있으면_문서_ID만_비운다() {
        UserPrincipal u = user();
        Long id = evalService.createRelateAppr(u, "2099", "10", false);
        assertThat(jdbc.queryForObject("select count(*) from emp45_eval_relate_appr where emp45_eval_relate_appr_id = ? and emp45_company_id = 28000 and emp45_std_year = '2099'", Integer.class, id)).isEqualTo(1);
        evalService.updateRelateApprId(u, id, 11L, false);
        evalService.updateRelateApprId(u, id, 22L, true);
        assertThat(jdbc.queryForObject("select emp45_appr_id from emp45_eval_relate_appr where emp45_eval_relate_appr_id = ?", Long.class, id)).isEqualTo(11L);
        assertThat(jdbc.queryForObject("select emp45_final_appr_id from emp45_eval_relate_appr where emp45_eval_relate_appr_id = ?", Long.class, id)).isEqualTo(22L);
        // 같은 기간에 다시 상신: 같은 행, 1차는 1차만 비운다
        assertThat(evalService.createRelateAppr(u, "2099", "10", false)).isEqualTo(id);
        assertThat(jdbc.queryForObject("select emp45_appr_id from emp45_eval_relate_appr where emp45_eval_relate_appr_id = ?", Long.class, id)).isNull();
        assertThat(jdbc.queryForObject("select emp45_final_appr_id from emp45_eval_relate_appr where emp45_eval_relate_appr_id = ?", Long.class, id)).isEqualTo(22L);
        // 최종은 최종만 비운다 (AS-IS 와 달리 행 번호를 넣지 않는다 — 이상한점 #88)
        assertThat(evalService.createRelateAppr(u, "2099", "10", true)).isEqualTo(id);
        assertThat(jdbc.queryForObject("select emp45_final_appr_id from emp45_eval_relate_appr where emp45_eval_relate_appr_id = ?", Long.class, id)).isNull();
        // 다른 회사 행은 못 고친다
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(1L).name("타사").roles(List.of("ROLE_USER")).build();
        assertThrows(BusinessException.class, () -> evalService.updateRelateApprId(other, id, 1L, false));
    }
}
