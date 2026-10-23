package kr.co.kfs.asseterp.biz.crm;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crm.dto.CrmContactRes;
import kr.co.kfs.asseterp.biz.crm.service.CrmContactService;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** L12 영업 거래처 조회창(Crm09_Lookup_SelectSingle, keyInCompany)의 조회를 asseterpdb에서 실제로 돌린다 (읽기만) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(CrmContactService.class)
class CrmContactDbTest {

    @Autowired CrmContactService service;

    private final UserPrincipal user = UserPrincipal.builder().userId(202306221546363L).companyId(28000L).roles(List.of("ROLE_USER")).build();
    private final UserPrincipal otherCompany = UserPrincipal.builder().userId(202306221546363L).companyId(1L).roles(List.of("ROLE_USER")).build();

    @Test
    void 직접_입력한_거래상대방_이름을_중복없이_이름순으로_주고_검색어는_부분일치() {
        List<CrmContactRes> all = service.searchKeyInCompanies(user, "");
        assertThat(all).isNotEmpty();
        assertThat(all).extracting(CrmContactRes::contactId).isSorted();
        assertThat(all).extracting(CrmContactRes::contactName).doesNotHaveDuplicates().doesNotContainNull();
        String part = all.get(0).contactName().substring(0, 1).toLowerCase();
        assertThat(service.searchKeyInCompanies(user, part)).isNotEmpty().hasSizeLessThanOrEqualTo(all.size());
        assertThat(service.searchKeyInCompanies(otherCompany, "")).isEmpty();
    }
}
