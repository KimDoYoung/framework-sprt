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
import kr.co.kfs.asseterp.biz.apr.service.link.ScheduleLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.SpecificMenuRequestLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.mapper.SchListMapper;
import kr.co.kfs.asseterp.biz.sys.mapper.SysSpecificMenuRequestMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V31 A31 데일리체크리스트 · A80 특정화면 사용요청 결재창 제목·본문과 결재 ID 기록을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, ScheduleLinkSeedProvider.class, SpecificMenuRequestLinkSeedProvider.class})
class AprScheduleSpecificLinkSeedDbTest {

    /** 2026-09-14 처리완료 · 비고 123123 / 2025-09-30 처리완료 */
    private static final long LIST_A = 202609149871757L;
    private static final long LIST_B = 202509309089613L;
    private static final long REQ = 202511059185506L;
    private static final long APPR = 202609229873969L;

    @Autowired AprLinkSeedService seedService;
    @Autowired SchListMapper schMapper;
    @Autowired SysSpecificMenuRequestMapper sysMapper;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, APPR);
    }

    @Test
    void 일일업무체크는_그리드_순서로_표를_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A31", null, Map.of("ids", LIST_B + "," + LIST_A));
        assertThat(res.title()).startsWith("일일업무체크 (").endsWith("-시험)");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        // 첫 행(ids 첫 번째)의 마감일
        assertThat(res.content()).contains("2025.09.30 일일업무 체크리스트를 아래와 같이 보고합니다.")
                .contains("- 아 래 -").contains(">구분<").contains(">체크항목<").contains(">결과<").contains(">체크내용<")
                .contains("(사용) 데일리 체크리스트 테스트").contains("123123").contains(">완료<");
        assertThat(res.content().indexOf("TEST")).isLessThan(res.content().indexOf("(사용) 데일리 체크리스트 테스트"));
        // 빈 칸 20개 첫 줄 + 머리 4칸 + 두 행 4칸씩
        assertThat(res.content().split("<tr>", -1).length - 1).isEqualTo(1 + 5 + 2);
    }

    @Test
    void 일일업무체크는_다른_회사_행이나_빈_목록이면_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(
                UserPrincipal.builder().userId(1L).companyId(1L).name("x").roles(List.of("ROLE_USER")).build(), 1L, "A31", null, Map.of("ids", String.valueOf(LIST_A))));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A31", null, Map.of()));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A31", null, Map.of("ids", "abc")));
    }

    @Test
    void 특정화면_사용요청은_업무명과_기준일로_제목을_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A80", REQ);
        assertThat(res.title()).startsWith("특정화면 사용요청_").endsWith("_(기준일:2025-11-05)");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).contains("다음과 같이 Asset-ERP 업무관리자를 지정하고 한국펀드서비스에 변경을 지시하고자 합니다.")
                .contains("- 다 음 -").contains(">권한구분<").contains(">담당자<").contains(">현행<").contains(">변경<");
        assertThat(res.content().split("<tr>", -1).length - 1).isEqualTo(11);
    }

    @Test
    void 특정화면_사용요청은_없는_행이나_다른_회사면_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A80", -1L));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A80", null));
        assertThrows(BusinessException.class, () -> seedService.seed(
                UserPrincipal.builder().userId(1L).companyId(1L).name("x").roles(List.of("ROLE_USER")).build(), 1L, "A80", REQ));
    }

    @Test
    void 결재_ID_기록은_로그인_회사_행만() {
        assertThat(schMapper.updateApprId(28000L, LIST_A, 1L)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select sch04_appr_id from sch04_list where sch04_list_id = ?", Long.class, LIST_A)).isEqualTo(1L);
        assertThat(schMapper.updateApprId(1L, LIST_A, 9L)).isZero();
        assertThat(sysMapper.updateApprId(28000L, REQ, 5L)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select sys53_appr_id from sys53_specific_menu_request where sys53_specific_menu_request_id = ?", Long.class, REQ)).isEqualTo(5L);
        assertThat(sysMapper.updateApprId(1L, REQ, 9L)).isZero();
    }
}
