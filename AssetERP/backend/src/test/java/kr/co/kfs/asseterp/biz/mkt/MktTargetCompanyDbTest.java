package kr.co.kfs.asseterp.biz.mkt;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.dto.MktTargetRes;
import kr.co.kfs.asseterp.biz.mkt.service.MktTargetCompanyService;
import kr.co.kfs.asseterp.common.dto.PageRes;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** L08 이익제공(수령)처 조회창(Mkt01_Lookup_Select2)의 두 조회를 asseterpdb에서 실제로 돌린다 (읽기만) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(MktTargetCompanyService.class)
class MktTargetCompanyDbTest {

    @Autowired MktTargetCompanyService service;

    private final UserPrincipal user = UserPrincipal.builder().userId(202306221546363L).companyId(28000L).roles(List.of("ROLE_USER")).build();
    private final UserPrincipal otherCompany = UserPrincipal.builder().userId(202306221546363L).companyId(1L).roles(List.of("ROLE_USER")).build();

    @Test
    void 회사별은_회사명만_채우고_담당자_열은_비운다() {
        PageRes<MktTargetRes> page = service.searchCompanies(user, "", 0, 100);
        assertThat(page.total()).isPositive();
        assertThat(page.rows()).isNotEmpty().allSatisfy(r -> {
            assertThat(r.targetCompanyName()).isNotNull();
            assertThat(r.managerName()).isNull();
            assertThat(r.managerOrgName()).isNull();
        });
        // 검색어는 부분일치 · 쪽 크기를 지킨다
        String name = page.rows().get(0).targetCompanyName();
        assertThat(service.searchCompanies(user, name.substring(0, 1), 0, 1).rows()).hasSizeLessThanOrEqualTo(1);
        assertThat(service.searchCompanies(otherCompany, "", 0, 100).rows()).isEmpty();
    }

    @Test
    void 직원별은_회사와_담당자를_함께_주고_건수는_행수와_맞는다() {
        PageRes<MktTargetRes> page = service.searchManagers(user, "", 0, 1000);
        assertThat(page.total()).isEqualTo(page.rows().size());
        assertThat(page.rows()).anySatisfy(r -> assertThat(r.managerName()).isNotNull());
        assertThat(service.searchManagers(otherCompany, "", 0, 100).rows()).isEmpty();
    }
}
