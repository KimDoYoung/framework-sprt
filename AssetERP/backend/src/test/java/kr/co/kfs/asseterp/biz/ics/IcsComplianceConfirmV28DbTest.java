package kr.co.kfs.asseterp.biz.ics;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriterRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceConfirmService;
import kr.co.kfs.asseterp.common.dto.PageRes;

/** V28 준수점검(준감인) — 내가 확인자인 내역만, 사원명 조회(writerId)·미확인 건수·사원 조회창 목록을 asseterpdb에서 읽는다(읽기만, 03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(IcsComplianceConfirmService.class)
class IcsComplianceConfirmV28DbTest {

    private static final LocalDate STD = LocalDate.of(2024, 10, 31);

    @Autowired IcsComplianceConfirmService service;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user(long id) {
        return UserPrincipal.builder().userId(id).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    @Test
    void 내가_확인자인_작성_내역만_읽는다() {
        int mine = jdbc.queryForObject("select count(*) from ics31_compliance_write where ics31_company_id = 28000 and ics31_yyyymm = '2024.10' and ics31_cycle_type = 'M' and ics31_confirmer_id = 29049 and coalesce(ics31_fix_yn,'false') = 'true'", Integer.class);
        PageRes<IcsComplianceConfirmRes> res = service.search(user(29049L), STD, "", false, "M", null, 0, 100);
        assertThat(res.total()).isEqualTo(res.rows().size());
        assertThat(res.rows().size()).isLessThanOrEqualTo(mine);
        assertThat(res.rows()).isNotEmpty();
        // 다른 사원이 로그인하면 내 것이 보이지 않는다
        assertThat(service.search(user(1L), STD, "", false, "M", null, 0, 100).rows()).isEmpty();
    }

    @Test
    void 사원명_조회는_목록에만_걸고_전체_건수에는_안_건다() {
        PageRes<IcsComplianceConfirmRes> all = service.search(user(29049L), STD, "", false, "M", null, 0, 100);
        PageRes<IcsComplianceConfirmRes> none = service.search(user(29049L), STD, "", false, "M", -1L, 0, 100);
        assertThat(none.rows()).isEmpty();
        assertThat(none.total()).isEqualTo(all.total());  // 원본 그대로(이상한점 #60)
    }

    @Test
    void 미확인_건수와_사원_조회창_목록() {
        assertThat(service.unconfirmedCount(user(29049L), STD, "M")).isGreaterThanOrEqualTo(0);
        assertThat(service.unconfirmedCount(user(1L), STD, "M")).isZero();
        List<IcsComplianceWriterRes> writers = service.writers(user(29049L), STD, "", "M");
        assertThat(writers).isNotEmpty();
        assertThat(writers.get(0).personName()).isNotBlank();
        assertThat(service.writers(user(29049L), STD, "없는이름없는이름", "M")).isEmpty();
    }
}
