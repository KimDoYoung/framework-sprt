package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport;
import kr.co.kfs.asseterp.biz.apr.service.link.HrLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V24 A01 휴가신청 · A45 외출등록 · A73 오후근무 · A74 연장근무 제목·시행일자·양식 치환을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, HrLinkSeedProvider.class, FormMappingLinkSeedSupport.class})
class AprHrLinkSeedDbTest {

    private static final long LEAVE = 202609229873968L;      // 연차 2026-09-22 ~ 09-23
    private static final long LEAVE_SPECIAL = 33812L;         // 특별휴가(04) 2021-09-08 (지난 날짜)
    private static final long ERRAND = 202507212358733L;
    private static final long PM_WORK = 202609089863887L;
    private static final long OVERTIME = 202609089863819L;    // 연장근무(10)
    private static final long APPR = 202609229873969L;

    @Autowired AprLinkSeedService seedService;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("천영임").companyName("시험회사").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, APPR);
    }

    /** 임시 양식을 걸어(롤백) 치환을 본다 — 양식은 문서분류 링크(dcr30_link)가 가리킨다 */
    private void form(String linkCode, String content) {
        Long formId = jdbc.queryForObject("select f_create_seq()", Long.class);
        jdbc.update("insert into com10_form_mapping (com10_form_mapping_id, com10_company_id, com10_title, com10_content) values (?, 28000, 'V24시험', ?)", formId, content);
        assertThat(jdbc.update("update dcr30_link set dcr30_form_mapping_id = ? where dcr30_company_id = 28000 and dcr30_link_cd = ?", formId, linkCode)).isGreaterThan(0);
    }

    @Test
    void 휴가신청_제목과_치환() {
        form("A01", "#{휴가구분}|#{휴가시작일}|#{휴가종료일}|#{휴가기간}|#{사유}|#{비상망}|#{회사명}|#{성명}|#{상신일}|#{없는키}");
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A01", LEAVE);
        assertThat(res.title()).startsWith("연차휴가 신청서 / 천영임 ").endsWith(" (2026-09-22~2026-09-23)");
        assertThat(res.effectDate().toString()).isEqualTo("2026-09-22");
        assertThat(res.titleReadOnly()).isTrue();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).startsWith("연차휴가|2026-09-22|2026-09-23|").contains("|시험회사|천영임|").contains("년 ").endsWith("|#{없는키}");
    }

    @Test
    void 특별휴가는_지난_시작일이면_시행일자가_오늘() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A01", LEAVE_SPECIAL);
        assertThat(res.effectDate()).isAfter(java.time.LocalDate.of(2026, 1, 1));
        assertThat(res.title()).contains("(2021-09-08~");
    }

    @Test
    void 외출등록은_제목이_없고_양식만_채운다() {
        form("A45", "#{소속}|#{성명}|#{구분}|#{일자}|#{외출시각}|#{사유}|#{주최자}|#{장소}");
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A45", ERRAND);
        assertThat(res.content()).contains("|2025-07-21|").contains("|test|");
        assertThat(res.titleReadOnly()).isTrue();
        // 제목은 문서분류 기본 제목(없으면 null)
    }

    @Test
    void 오후근무_제목_시행일자_치환() {
        form("A73", "#{소속}|#{사번}|#{직급}|#{근무일자}|#{근무시간}|#{휴게시간}|#{실근로}|#{신청일자}");
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A73", PM_WORK);
        assertThat(res.title()).startsWith("오후근무 신청서 / 천영임 ").endsWith(" (2026-09-09)");
        assertThat(res.effectDate().toString()).isEqualTo("2026-09-09");
        assertThat(res.content()).contains("|2026-09-09|").doesNotContain("#{");
    }

    @Test
    void 연장근무_제목_시행일자_치환() {
        form("A74", "#{구분}|#{근무일자}|#{근무시간}|#{시간분}|#{보상방법}|#{연락처}");
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A74", OVERTIME);
        assertThat(res.title()).contains(" 신청서 / 천영임 ").endsWith(" (2026-09-08)");
        assertThat(res.effectDate().toString()).isEqualTo("2026-09-08");
        assertThat(res.content()).doesNotContain("#{");
    }

    @Test
    void 없는_행과_다른_회사_행은_열_수_없다() {
        for (String code : List.of("A01", "A45", "A73", "A74")) {
            assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, code, -1L));
            assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, code, null));
        }
        UserPrincipal other = UserPrincipal.builder().userId(29049L).companyId(1L).name("x").roles(List.of("ROLE_USER")).build();
        assertThrows(BusinessException.class, () -> seedService.seed(other, 1L, "A01", LEAVE));
        assertThrows(BusinessException.class, () -> seedService.seed(other, 1L, "A74", OVERTIME));
    }
}
