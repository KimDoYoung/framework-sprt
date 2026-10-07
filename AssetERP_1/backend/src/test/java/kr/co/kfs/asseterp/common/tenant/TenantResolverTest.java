package kr.co.kfs.asseterp.common.tenant;

import kr.co.kfs.asseterp.biz.company.dto.CompanyRes;
import kr.co.kfs.asseterp.biz.company.mapper.CompanyMapper;
import kr.co.kfs.asseterp.common.config.properties.TenantProperties;
import kr.co.kfs.asseterp.support.TestProperties;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class TenantResolverTest {

    private final CompanyMapper companyMapper = mock(CompanyMapper.class);
    private final TenantResolver resolver = new TenantResolver(
            TestProperties.bind("asseterp.tenant", TenantProperties.class), companyMapper);

    private Tenant resolve(String host) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setServerName(host);
        return resolver.resolve(request);
    }

    @Test
    void 첫_라벨이_회사코드가_된다() {
        when(companyMapper.findByCompanyCode("kfstest"))
                .thenReturn(Optional.of(new CompanyRes(28000L, "kfstest", "한국펀드서비스(주)", "true")));

        Tenant tenant = resolve("KFSTest.localhost");

        assertThat(tenant.code()).isEqualTo("kfstest");
        assertThat(tenant.admin()).isFalse();
        assertThat(tenant.isValid()).isTrue();
    }

    @Test
    void admin_별칭은_admin으로_정규화한다() {
        assertThat(resolve("admindev.asseterp.co.kr").code()).isEqualTo("admin");
        assertThat(resolve("www.extadmin.localhost").admin()).isTrue();
    }

    @Test
    void 서브도메인이_없는_호스트는_기본_회사코드() {
        assertThat(resolve("localhost").code()).isEqualTo("admin");
        assertThat(resolve("127.0.0.1").code()).isEqualTo("admin");
    }

    @Test
    void 등록되지_않았거나_사용중지된_회사는_무효() {
        when(companyMapper.findByCompanyCode(anyString())).thenReturn(Optional.empty());
        when(companyMapper.findByCompanyCode("ptr"))
                .thenReturn(Optional.of(new CompanyRes(63360L, "ptr", "PTR", "false")));

        assertThat(resolve("kalpa.localhost").isValid()).isFalse();
        assertThat(resolve("ptr.localhost").isValid()).isFalse();
    }
}
