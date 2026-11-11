package kr.co.kfs.asseterp.biz.ics;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.mapper.BizRelateApprMapper;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsComplianceReportMapper;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceRdPdfService;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceReportService;
import kr.co.kfs.asseterp.biz.rd.service.RdFileSaver;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.File;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * #1311 [상신] RD 첨부 PDF (CH-0018·0109, AS-IS Sys99_Print.insertComplianceState(confirmerId) + Ics31_Tab_ComplianceReport mrd + ics32RelateApprFileSetting).
 * 출력 자료는 asseterpdb에서 돌리고 롤백한다(서비스를 직접 만들어 REQUIRES_NEW 없이). RD 서버·파일 등록은 가짜로 바꾼다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class IcsComplianceRdPdfDbTest {

    private static final long CONFIRMER = 202204180108329L;     // 시험 DB: 2026.08 월(M) 작성 25건의 확인자
    private static final LocalDate STD = LocalDate.of(2026, 8, 31);

    @Autowired IcsComplianceReportMapper mapper;
    @Autowired BizRelateApprMapper relateMapper;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(CONFIRMER).companyId(28000L).roles(List.of("ROLE_USER")).build();

    private IcsComplianceRdPdfService svc(RdFileSaver rd, SysFileService sysFile) {
        return new IcsComplianceRdPdfService(mapper, new IcsComplianceReportService(mapper), relateMapper, rd, sysFile);
    }

    @Test
    void 확인자에게_배정된_사원만_출력자료로_쌓인다() {
        long groupId = svc(mock(RdFileSaver.class), mock(SysFileService.class)).insertComplianceState(user, STD, "M");

        Integer rows = jdbc.queryForObject("select count(*) from sys99_print where sys99_group_id = ? and sys99_window_class_nm = 'Ics31_Tab_ComplianceConfirm'"
                + " and sys99_date01 = ? and sys99_date02 is not null and sys99_string05 is not null", Integer.class, groupId, STD);
        assertThat(rows).isPositive();

        // 출력에 나온 사원은 모두 이 확인자에게 배정된 그 달 작성이 있다(원본 2026-10-23 selectInOffice confirmerId 조건)
        Integer notAssigned = jdbc.queryForObject("""
                select count(distinct sys99_long02) from sys99_print p
                 where sys99_group_id = ?
                   and not exists (select 1 from ics31_compliance_write w
                                    where w.ics31_company_id = 28000 and w.ics31_person_id = p.sys99_long02
                                      and w.ics31_yyyymm = '2026.08' and w.ics31_cycle_type = 'M' and w.ics31_confirmer_id = ?)
                """, Integer.class, groupId, CONFIRMER);
        assertThat(notAssigned).isZero();

        // 확인자 조건이 없는 #1312 보고보다 사원 수가 같거나 적다
        int persons = jdbc.queryForObject("select count(distinct sys99_long02) from sys99_print where sys99_group_id = ?", Integer.class, groupId);
        long all = new IcsComplianceReportService(mapper).rows(28000L, STD, "M", null, null).stream().map(r -> r.res().personId()).distinct().count();
        assertThat((long) persons).isLessThanOrEqualTo(all);
    }

    @Test
    void RD가_만든_PDF를_준수보고_이름으로_결재에_붙인다() throws Exception {
        RdFileSaver rd = mock(RdFileSaver.class);
        SysFileService sysFile = mock(SysFileService.class);
        File pdf = Files.createTempFile("compliance-rd-", ".pdf").toFile();
        pdf.deleteOnExit();
        when(rd.save(eq(user), eq("Ics31_Tab_ComplianceReport"), eq("/rexportopt [6] /rxlsopt [100]"), eq("pdf"), eq("compliance_55"),
                eq(Map.of("companyId", "28000", "personId", String.valueOf(CONFIRMER), "rdGroupId", "55")))).thenReturn(Optional.of(pdf));
        when(sysFile.registerRdFile(eq(pdf), eq(900L), anyString(), eq("내부통제 준수보고(2026년 8월).pdf"), eq("pdf"))).thenReturn(88L);

        assertThat(svc(rd, sysFile).attach(user, 55L, 900L, "2026", "8월")).contains(88L);
    }
}
