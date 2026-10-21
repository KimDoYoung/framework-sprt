package kr.co.kfs.asseterp.biz.ics;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportApprRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceReportService;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** K03 내부통제 준수보고(Ics31_Tab_ComplianceReport) 조회 — 읽기만 한다(원본이 쌓던 sys99_print는 쌓지 않는다) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(IcsComplianceReportService.class)
class IcsComplianceReportDbTest {

    @Autowired IcsComplianceReportService service;
    @Autowired JdbcTemplate jdbc;

    private static final UserPrincipal ME = UserPrincipal.builder().userId(-28656L).companyId(28000L).build();
    private static final LocalDate STD_DATE = LocalDate.of(2026, 8, 31);

    @Test
    void 재직_사원별_준수항목_결과를_만든다() {
        List<IcsComplianceReportRes> rows = service.report(ME, STD_DATE, "M");
        assertThat(rows).isNotEmpty();
        // 사원 한 명은 준수항목 수만큼 행이 있고(AS-IS 13개), 순번은 1부터 올라간다
        assertThat(rows.get(0).seq()).isEqualTo(1L);
        long first = rows.get(0).personId();
        assertThat(rows.stream().filter(r -> r.personId() == first).count()).isEqualTo(13);
        assertThat(rows).allMatch(r -> r.personName() != null && r.complianceResult() != null);
        // 준수면 사유가 없고, 아니면 사유 칸(없을 수도 있음)을 서버가 채운다
        assertThat(rows).filteredOn(r -> "준수".equals(r.complianceResult())).allMatch(r -> r.reason() == null);
        // 읽기 전용: 조회가 sys99_print를 쌓지 않는다
        Integer before = jdbc.queryForObject("select count(*) from sys99_print", Integer.class);
        service.report(ME, STD_DATE, "M");
        assertThat(jdbc.queryForObject("select count(*) from sys99_print", Integer.class)).isEqualTo(before);
    }

    @Test
    void 상신_연결은_없으면_null이다() {
        assertThat(service.appr(ME, "2026.08", "M")).isNull();
        IcsComplianceReportApprRes linked = service.appr(ME, "2026.06", "M");
        assertThat(linked).isNotNull();
        assertThat(linked.relateApprId()).isPositive();
    }
}
