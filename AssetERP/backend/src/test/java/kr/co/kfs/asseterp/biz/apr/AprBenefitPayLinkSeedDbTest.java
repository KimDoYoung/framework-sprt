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
import kr.co.kfs.asseterp.biz.apr.service.link.BenefitPayLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V40 A46~A51 복리후생비 지출결의서 결재창 제목·본문·연관문서를 asseterpdb에서 읽어 확인한다(읽기만) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, BenefitPayLinkSeedProvider.class})
class AprBenefitPayLinkSeedDbTest {

    private static final String IDS = "202503262248363,202502282140644,202502282140601,202502282140761"; // 2025.03 900BY, 금액 합 3,247,950

    @Autowired AprLinkSeedService seedService;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    @Test
    void 지출결의서는_제목_합계_행을_그리드_순서로_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), 30451L, "A51", null,
                Map.of("ids", IDS, "yyyy", "2025", "mm", "03", "benefitName", "기타복리후생비", "benefitCode", "900BY"));
        assertThat(res.title()).isEqualTo("2025년 03월 직원 기타복리후생비 지급결의서");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.content()).contains("지 출 결 의 서", "1. 발생부서 : ", "2. 계정과목 : ", "3. 일 &nbsp;&nbsp;&nbsp;&nbsp; 금 : 3,247,950원",
                "4. 발생일자 : 2025년도 03월", "6. 내 &nbsp;&nbsp;&nbsp;&nbsp; 역 : 2025년 03월 임직원 기타복리후생비 지급", "합 계&nbsp;", "3,247,950&nbsp;");
        assertThat(res.content().indexOf("69,950")).isLessThan(res.content().indexOf("128,000"));
        assertThat(res.relateApprs()).isNotEmpty();
    }

    @Test
    void 내용이_없거나_남의_행이면_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 30451L, "A46", null, Map.of("yyyy", "2025", "mm", "03")));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 30451L, "A46", null, Map.of("ids", "1", "yyyy", "2025", "mm", "03")));
        assertThrows(BusinessException.class, () -> seedService.seed(UserPrincipal.builder().userId(1L).companyId(1L).roles(List.of()).build(),
                30451L, "A46", null, Map.of("ids", IDS, "yyyy", "2025", "mm", "03")));
    }
}
