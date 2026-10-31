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
import kr.co.kfs.asseterp.biz.apr.service.link.IcsLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V28 A52 임직원 내부통제 준수확인서(부서장) 결재창 제목·본문을 asseterpdb에서 읽는다(읽기만, 03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, IcsLinkSeedProvider.class})
class AprIcsWriterLinkDbTest {

    /** 2026.08 월간 점검을 확정한 확인자(부서장) */
    private static final long CONFIRMER = 202204180108329L;
    private static final Map<String, String> ARGS = Map.of("stdDate", "2026-08-31", "cycleType", "M", "yyyy", "2026", "mm", "08월", "cycleName", "08월");

    @Autowired AprLinkSeedService seedService;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(CONFIRMER).companyId(28000L).name("박재민").roles(List.of("ROLE_USER")).build();
    }

    @Test
    void A52는_제목에_조직명과_사원명_본문에_소속_임직원_준수여부를_넣는다() {
        AprLinkSeedRes res = seedService.seed(user(), 1L, "A52", null, ARGS);
        assertThat(res.title()).startsWith("2026년 08월_임직원 내부통제 준수확인서 - ").endsWith(" 박재민");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).contains("다음과 같이 임직원 내부통제 준수내역을 보고합니다.").contains("- 다 음 -")
                .contains("준수여부").contains("박재민").contains("전산 3팀").contains("과장").contains("미준수(").endsWith("</tbody></table>");
        // 머리 5 + 제목줄 1 + 사원 1 (이 확인자는 1명)
        assertThat(res.content().split("<tr>", -1).length - 1).isEqualTo(4 + 1 + 1);
    }

    @Test
    void A52_확정한_사원이_없으면_표머리만_나오고_빠진_인자는_열_수_없다() {
        AprLinkSeedRes none = seedService.seed(user(), 1L, "A52", null, Map.of("stdDate", "1999-01-31", "cycleType", "M", "yyyy", "1999", "mm", "01월", "cycleName", "01월"));
        assertThat(none.content().split("<tr>", -1).length - 1).isEqualTo(5);
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A52", null, Map.of("stdDate", "2026-08-31", "cycleType", "M")));
    }
}
