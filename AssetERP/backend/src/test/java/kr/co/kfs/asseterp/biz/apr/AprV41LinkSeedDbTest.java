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

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.apr.service.link.BizTripLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.CeoReportLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.DirectorLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V41 B11~B14 출장 · A44·A62 임원 선임/해임 · A72 책임자보고 결재창 제목·본문을 asseterpdb에서 읽어 확인한다(읽기만) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, BizTripLinkSeedProvider.class, DirectorLinkSeedProvider.class, CeoReportLinkSeedProvider.class,
        FormMappingLinkSeedSupport.class})
class AprV41LinkSeedDbTest {

    private static final long BIZ_TRIP_ID = 202411272036135L; // 국내출장 / 부산 / 박재민(IT본부) / 2024-11-25 ~ 2024-11-29
    private static final String DIRECTOR_ID = "29053";        // 최근선임일 2023-05-25, 만료일 2024-05-26

    @Autowired AprLinkSeedService seedService;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    @Test
    void 출장_신청과_결과보고는_제목이_다르고_고칠_수_있다() {
        AprLinkSeedRes b11 = seedService.seed(user(), 32980L, "B11", BIZ_TRIP_ID, Map.of());
        assertThat(b11.title()).isEqualTo("국내출장 승인 요청의 건 - 부산");
        assertThat(b11.titleReadOnly()).isFalse();
        assertThat(b11.saveVisible()).isTrue();
        AprLinkSeedRes b14 = seedService.seed(user(), 32980L, "B14", BIZ_TRIP_ID, Map.of());
        assertThat(b14.title()).isEqualTo("국내출장 결과 보고 - 부산");
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 32980L, "B12", 1L, Map.of()));
    }

    @Test
    void 임원_선임은_선임일과_만료일_해임은_해임일을_표에_넣는다() {
        AprLinkSeedRes a44 = seedService.seed(user(), 32980L, "A44", null, Map.of("ids", DIRECTOR_ID));
        assertThat(a44.title()).isEqualTo("임원선임보고");
        assertThat(a44.titleReadOnly()).isFalse();
        assertThat(a44.saveVisible()).isFalse();
        assertThat(a44.content()).contains("다음과 같이 임원선임보고를 하고자 합니다.", "1. 선임", "만료일", "2023-05-25", "2024-05-26", "2. 보고처 : 금융감독원");
        AprLinkSeedRes a62 = seedService.seed(user(), 32980L, "A62", null, Map.of("ids", DIRECTOR_ID));
        assertThat(a62.title()).isEqualTo("임원해임보고");
        assertThat(a62.content()).contains("다음과 같이 임원해임보고를 하고자 합니다.", "1. 해임", "해임일", "2023-05-25");
        assertThat(a62.content()).doesNotContain("만료일");
    }

    @Test
    void 임원_대상이_없거나_남의_행이면_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 32980L, "A44", null, Map.of()));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 32980L, "A44", null, Map.of("ids", "1")));
    }

    @Test
    void 책임자보고는_본문이_비고_시행일자가_기준일이다() {
        AprLinkSeedRes a72 = seedService.seed(user(), 32980L, "A72", null, Map.of("stdDate", "2026-10-01", "stdDateStr", "2026년 10월"));
        assertThat(a72.title()).isEqualTo("임직원 금융투자상품 매매명세보고(2026년 10월)");
        assertThat(a72.content()).isEmpty();
        assertThat(a72.effectDate().toString()).isEqualTo("2026-10-01");
        assertThat(a72.titleReadOnly()).isFalse();
        assertThat(a72.saveVisible()).isFalse();
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 32980L, "A72", null, Map.of()));
    }
}
