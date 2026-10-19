package kr.co.kfs.asseterp.biz.act;

import kr.co.kfs.asseterp.biz.act.dto.CloseCheckRes;
import kr.co.kfs.asseterp.biz.act.dto.CloseCheckSaveReq;
import kr.co.kfs.asseterp.biz.act.service.ActCloseCheckService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
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

/** E32(마감검증 체크항목)의 조회·저장을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(ActCloseCheckService.class)
class ActCloseCheckDbTest {

    @Autowired ActCloseCheckService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal admin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(1L).roles(List.of("ROLE_ADMIN")).build();

    private static CloseCheckSaveReq req(Long id, Long companyId, String depnYn) {
        return new CloseCheckSaveReq(id, companyId, "true", "true", "true", "true", "true", "true", depnYn, "true", "true", "true", "true", "true", "true");
    }

    @Test
    void 조회_없는_회사는_임시ID와_true_저장하면_INSERT_다시_저장하면_UPDATE() {
        int companies = jdbc.queryForObject("select count(*) from sys01_company where coalesce(sys01_use_yn,'false') = 'true' and sys01_company_id != 0", Integer.class);
        List<CloseCheckRes> all = service.search(null);
        assertThat(all).hasSize(companies);
        assertThat(service.search("")).hasSize(companies);
        assertThat(all).allSatisfy(r -> assertThat(r.companyId()).isNotZero());

        // 아직 행이 없는 고객사는 값이 모두 'true'
        Long target = jdbc.queryForObject("""
                select sys01_company_id from sys01_company
                 where coalesce(sys01_use_yn,'false') = 'true' and sys01_company_id != 0
                   and not exists (select 1 from act15_close_check where act15_company_id = sys01_company_id)
                 order by 1 limit 1""", Long.class);
        CloseCheckRes before = all.stream().filter(r -> r.companyId().equals(target)).findFirst().orElseThrow();
        assertThat(before.depnYn()).isEqualTo("true");
        assertThat(service.search(before.companyName())).extracting(CloseCheckRes::companyId).contains(target);

        CloseCheckRes created = service.save(admin, List.of(req(before.closeCheckId(), target, "false"))).get(0);
        assertThat(created.closeCheckId()).isGreaterThan(1_000_000L);  // 임시 ID가 아니라 시퀀스
        assertThat(created.companyId()).isEqualTo(target);
        assertThat(created.depnYn()).isEqualTo("false");
        assertThat(created.companyName()).isEqualTo(before.companyName());
        assertThat(service.search(null).stream().filter(r -> r.companyId().equals(target)).findFirst().orElseThrow().closeCheckId())
                .isEqualTo(created.closeCheckId());

        CloseCheckRes updated = service.save(admin, List.of(req(created.closeCheckId(), target, "true"))).get(0);
        assertThat(updated.closeCheckId()).isEqualTo(created.closeCheckId());
        assertThat(updated.depnYn()).isEqualTo("true");
        assertThat(jdbc.queryForObject("select count(*) from act15_close_check where act15_company_id = ?", Integer.class, target)).isEqualTo(1);

        // 고객사 없는 새 행은 막는다 / 관리자 회사가 아니면 저장하지 못한다
        assertThatThrownBy(() -> service.save(admin, List.of(req(-1L, null, "false")))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.save(other, List.of(req(created.closeCheckId(), target, "false")))).isInstanceOf(BusinessException.class);
    }
}
