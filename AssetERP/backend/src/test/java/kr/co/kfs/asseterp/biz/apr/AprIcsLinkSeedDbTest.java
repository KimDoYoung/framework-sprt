package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
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
import kr.co.kfs.asseterp.biz.apr.service.link.IcsLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRelateApprIdReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsChecklistConfirmService;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceReportService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V19 A27 체크리스트·A32 준수보고 결재창 제목·본문과 상신 연결 행(ics16·ics32)을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, IcsLinkSeedProvider.class, IcsChecklistConfirmService.class, IcsComplianceReportService.class})
class AprIcsLinkSeedDbTest {

    /** 29049(전산1팀) 확인자의 2022.08 월간 체크리스트 대분류 — 연결 행·반려(40) 문서가 있다 / 같은 달 다른 대분류(완료 30) */
    private static final long L_CLASS = 202309159433555L;
    private static final long LAST_APPR = 202302060976628L;
    private static final long NEW_APPR = 202609229873969L;
    /** 확인자 29049가 대분류를 조회하는 기준 분기(월) */
    private static final Map<String, String> SEED_ARGS = Map.of("stdDate", "2026-09-30", "cycleType", "M", "yyyy", "2026", "mm", "09월");
    private static final LocalDate STD = LocalDate.of(2022, 8, 31);

    @Autowired AprLinkSeedService seedService;
    @Autowired IcsChecklistConfirmService confirmService;
    @Autowired IcsComplianceReportService reportService;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private String orgName() {
        return jdbc.queryForObject("select f_org_nm(f_get_emptrans(29049, f_today()::date, 'org_code_id')::numeric, f_today()::date)", String.class);
    }

    @Test
    void A27_체크리스트_제목과_본문을_만든다() {
        String lClassName = jdbc.queryForObject("select ics21_checklist_l_class_nm from ics21_checklist_l_class where ics21_checklist_l_class_id = ?", String.class, L_CLASS);
        AprLinkSeedRes res = seedService.seed(user(), 1L, "A27", L_CLASS,
                SEED_ARGS);
        assertThat(res.title()).isEqualTo(lClassName + " 체크리스트 (2026년 09월 - " + orgName() + ")");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).startsWith("<table border=2").contains("2026년 09월 " + orgName() + " " + lClassName + " 체크리스트를 다음과 같이 보고합니다.")
                .contains("- 다 음 -").contains("내부통제 체크리스트 현황").contains("내부통제 체크리스트 상세").endsWith("</tbody></table>");
    }

    @Test
    void A27_없는_대분류와_빠진_인자는_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A27", -1L, SEED_ARGS));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A27", null, SEED_ARGS));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A27", L_CLASS, Map.of()));
    }

    @Test
    void A32_준수보고_제목과_본문을_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), 1L, "A32", null, Map.of("yyyy", "2026", "cycleName", "2분기"));
        assertThat(res.title()).isEqualTo("2026년 2분기_임직원 내부통제 준수보고");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).contains("2026년 2분기 임직원 내부통제 준수 점검결과를 보고합니다.").contains("첨부파일을 참고하세요.").endsWith("</tbody></table>");
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A32", null, Map.of()));
    }

    @Test
    void A27_상신_뒤_이전_문서를_폐기하고_연결_행의_문서를_바꾼다() {
        confirmService.updateRelateApprId(user(), new IcsChecklistRelateApprIdReq(STD, "M", L_CLASS, NEW_APPR, LAST_APPR));
        assertThat(jdbc.queryForObject("select ics16_appr_id from ics16_relate_appr where ics16_company_id = 28000 and ics16_check_yyyymm = '2022.08' and ics16_cycle_type = 'M' and ics16_checklist_l_class_id = ?", Long.class, L_CLASS)).isEqualTo(NEW_APPR);
        assertThat(jdbc.queryForObject("select count(*) from apr01_appr where apr01_appr_id = ?", Integer.class, LAST_APPR)).isZero();
        assertThat(jdbc.queryForObject("select count(*) from apr99_appr_del where apr99_appr_id = ?", Integer.class, LAST_APPR)).isEqualTo(1);
    }

    @Test
    void A27_연결_행이_없으면_만든다() {
        confirmService.updateRelateApprId(user(), new IcsChecklistRelateApprIdReq(LocalDate.of(2099, 1, 31), "M", L_CLASS, NEW_APPR, null));
        assertThat(jdbc.queryForObject("select ics16_confirmer_id from ics16_relate_appr where ics16_check_yyyymm = '2099.01' and ics16_checklist_l_class_id = ?", Long.class, L_CLASS)).isEqualTo(29049L);
    }

    @Test
    void A27_연결_행에_없는_문서는_폐기하지_않는다() {
        assertThrows(BusinessException.class, () -> confirmService.updateRelateApprId(user(),
                new IcsChecklistRelateApprIdReq(STD, "M", L_CLASS, NEW_APPR, NEW_APPR)));
        assertThrows(BusinessException.class, () -> confirmService.updateRelateApprId(user(),
                new IcsChecklistRelateApprIdReq(STD, "M", L_CLASS, -1L, null)));
        assertThat(jdbc.queryForObject("select count(*) from apr01_appr where apr01_appr_id = ?", Integer.class, NEW_APPR)).isEqualTo(1);
    }

    @Test
    void A32_상신_연결은_있으면_그대로_없으면_만든다() {
        // 기존 행은 ics32_appr_type이 비어 있다 — 새 열을 채우는 작업(UPDATE … SET ics32_appr_type = '1')을 이 테스트 안에서만 한다(롤백)
        jdbc.update("update ics32_relate_appr set ics32_appr_type = '1' where ics32_appr_type is null");
        Long exist = jdbc.queryForObject("select ics32_relate_appr_id from ics32_relate_appr where ics32_company_id = 28000 and ics32_yyyymm = '2025.01' and ics32_cycle_type = 'M' and ics32_person_id is null", Long.class);
        assertThat(reportService.createRelateAppr(user(), "2025.01", "M", null)).isEqualTo(exist);

        Long created = reportService.createRelateAppr(user(), "2099.02", "M", "1");
        assertThat(created).isNotNull().isNotEqualTo(exist);
        assertThat(reportService.createRelateAppr(user(), "2099.02", "M", null)).isEqualTo(created);
        reportService.updateRelateApprId(user(), created, NEW_APPR);
        assertThat(jdbc.queryForObject("select ics32_appr_id from ics32_relate_appr where ics32_relate_appr_id = ?", Long.class, created)).isEqualTo(NEW_APPR);
        assertThat(reportService.appr(user(), "2099.02", "M", null).statusCode()).isEqualTo("10");
        assertThrows(BusinessException.class, () -> reportService.updateRelateApprId(user(), -1L, NEW_APPR));
        assertThrows(BusinessException.class, () -> reportService.updateRelateApprId(user(), created, -1L));
        assertThrows(BusinessException.class, () -> reportService.createRelateAppr(user(), "2099-02", "M", null));
        assertThrows(BusinessException.class, () -> reportService.createRelateAppr(user(), "2099.02", "M", "9"));
    }

    @Test
    void A53_작성자_준수확인서_제목과_본문을_만든다() {
        // 원본 2026-11-05 Apr01_Edit_ApprDoc A53 · ComplianceWriteHtmlData.getHtmlContent3 (호출 Ics31_Tab_ComplianceWrite [결재요청])
        AprLinkSeedRes res = seedService.seed(user(), 1L, "A53", null,
                Map.of("stdDate", "2024-10-31", "cycleType", "M", "yyyy", "2024", "cycleName", "10월"));
        assertThat(res.title()).isEqualTo("2024년 10월_임직원 내부통제 준수확인서 - " + orgName() + " 시험");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.content()).contains("다음과 같이 임직원 내부통제 준수내역을 보고합니다.").contains("준수항목").contains("준수여부");
    }

    @Test
    void A52_상신_연결은_로그인_사원별_구분_2로_따로_만든다() {
        Long a32 = reportService.createRelateAppr(user(), "2099.03", "M", "1");
        Long a52 = reportService.createRelateAppr(user(), "2099.03", "M", "2");
        assertThat(a52).isNotEqualTo(a32);
        assertThat(reportService.createRelateAppr(user(), "2099.03", "M", "2")).isEqualTo(a52);
        assertThat(jdbc.queryForObject("select ics32_person_id from ics32_relate_appr where ics32_relate_appr_id = ?", Long.class, a52)).isEqualTo(29049L);
        assertThat(jdbc.queryForObject("select ics32_appr_type from ics32_relate_appr where ics32_relate_appr_id = ?", String.class, a52)).isEqualTo("2");
        assertThat(jdbc.queryForObject("select count(*) from ics32_relate_appr where ics32_relate_appr_id = ? and ics32_person_id is null", Integer.class, a32)).isEqualTo(1);
        assertThat(reportService.appr(user(), "2099.03", "M", "2").relateApprId()).isEqualTo(a52);
        assertThat(reportService.appr(user(), "2099.03", "M", "2").statusCode()).isNull();
        reportService.updateRelateApprId(user(), a52, NEW_APPR);
        assertThat(reportService.appr(user(), "2099.03", "M", "2").statusCode()).isEqualTo("10");
        assertThat(reportService.appr(user(), "2099.03", "M", "1").statusCode()).isNull();
    }
}
