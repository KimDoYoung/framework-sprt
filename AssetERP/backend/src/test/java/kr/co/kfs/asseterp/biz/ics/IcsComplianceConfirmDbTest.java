package kr.co.kfs.asseterp.biz.ics;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceConfirmService;
import kr.co.kfs.asseterp.common.dto.PageRes;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** K02 내부통제 준수점검(Ics31_Tab_ComplianceConfirm)의 조회·확인 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(IcsComplianceConfirmService.class)
class IcsComplianceConfirmDbTest {

    @Autowired IcsComplianceConfirmService service;
    @Autowired JdbcTemplate jdbc;

    private static final UserPrincipal ME = UserPrincipal.builder().userId(-28656L).companyId(28000L).build();
    /** 2026.08 월 주기 제출분이 회사 28000에 25건 있다(AS-IS selectByCompanyIdTotal로도 25) */
    private static final LocalDate STD_DATE = LocalDate.of(2026, 8, 31);

    @Test
    void 제출된_작성_내역을_페이지로_읽는다() {
        PageRes<IcsComplianceConfirmRes> all = service.search(ME, STD_DATE, "", false, "M", 0, 100);
        assertThat(all.total()).isEqualTo(25);
        assertThat(all.rows()).hasSize(25).allMatch(r -> r.fixYn() && r.complianceWriteId() != null);

        PageRes<IcsComplianceConfirmRes> page2 = service.search(ME, STD_DATE, "", false, "M", 10, 10);
        assertThat(page2.total()).isEqualTo(25);
        assertThat(page2.rows()).hasSize(10).first().isEqualTo(all.rows().get(10));

        PageRes<IcsComplianceConfirmRes> found = service.search(ME, STD_DATE, all.rows().get(0).personName(), false, "M", 0, 100);
        assertThat(found.total()).isBetween(1L, 25L);
    }

    @Test
    void 확인하고_확인취소한다() {
        List<IcsComplianceConfirmRes> rows = service.search(ME, STD_DATE, "", false, "M", 0, 100).rows();
        List<Long> ids = rows.stream().limit(2).map(IcsComplianceConfirmRes::complianceWriteId).toList();
        // 먼저 확인취소로 시작 상태를 맞춘다(실제 데이터는 이미 확인된 건이 있을 수 있다 — 롤백)
        assertThat(service.updateConfirmYn(ME, new IcsComplianceConfirmReq(false, ids))).isEqualTo(2);
        long confirmedBefore = service.search(ME, STD_DATE, "", true, "M", 0, 100).total();

        assertThat(service.updateConfirmYn(ME, new IcsComplianceConfirmReq(true, ids))).isEqualTo(2);
        assertThat(service.search(ME, STD_DATE, "", false, "M", 0, 100).rows()).filteredOn(r -> ids.contains(r.complianceWriteId())).allMatch(IcsComplianceConfirmRes::confirmYn);
        // 미확인건만 조회: 확인한 건은 빠진다
        assertThat(service.search(ME, STD_DATE, "", true, "M", 0, 100).total()).isEqualTo(confirmedBefore - 2);
        assertThat(jdbc.queryForObject("select ics31_confirmer_id from ics31_compliance_write where ics31_compliance_write_id = ?", Long.class, ids.get(0))).isEqualTo(-28656L);

        assertThat(service.updateConfirmYn(ME, new IcsComplianceConfirmReq(false, ids))).isEqualTo(2);
        assertThat(service.search(ME, STD_DATE, "", true, "M", 0, 100).total()).isEqualTo(confirmedBefore);
    }

    @Test
    void 다른_회사_작성_행은_확인하지_못한다() {
        List<Long> other = jdbc.queryForList("select ics31_compliance_write_id from ics31_compliance_write where ics31_company_id <> 28000 limit 1", Long.class);
        if (other.isEmpty()) return;  // 다른 회사 작성 내역이 DB에 없으면 건너뛴다
        assertThat(service.updateConfirmYn(ME, new IcsComplianceConfirmReq(true, other))).isZero();
    }
}
