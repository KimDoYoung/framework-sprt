package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.org.dto.OrgCodeRow;
import kr.co.kfs.asseterp.oms.biz.org.mapper.OrgInfoMapper;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanySaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysCodeMapper;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysCompanyMapper;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysMenuMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SysCompanyServiceTest {

    private final SysCompanyMapper companyMapper = mock(SysCompanyMapper.class);
    private final SysCodeMapper codeMapper = mock(SysCodeMapper.class);
    private final OrgInfoMapper orgMapper = mock(OrgInfoMapper.class);
    private final SysCompanyService service = new SysCompanyService(companyMapper, mock(SysMenuMapper.class), codeMapper, orgMapper);

    private static CompanySaveReq req(LocalDate start, LocalDate close) {
        return new CompanySaveReq(" 새회사 ", "newco", "111", "pw", start, close, false, false, null, null, null, null, null, null);
    }

    @Test
    void 신규_고객사는_최상위_조직과_기본_공통코드를_함께_만든다() {
        when(companyMapper.selectNextId()).thenReturn(900L);
        when(orgMapper.selectNextId()).thenReturn(901L, 902L);
        LocalDate start = LocalDate.of(2026, 1, 1);

        service.createCompany(req(start, LocalDate.of(2030, 12, 31)));

        verify(companyMapper).insert(argThat(r -> r.companyId() == 900L && "새회사".equals(r.companyNm()) && "true".equals(r.useYn())));
        verify(orgMapper).insertOrgCode(new OrgCodeRow(901L, 900L, "10000", start, null, null, null, null));
        verify(orgMapper).insertOrgInfo(argThat(r -> r.orgInfoId() == 902L && r.orgCodeId() == 901L && "새회사".equals(r.korNm())));
        verify(codeMapper).insertCompanyDefaults(900L);
    }

    @Test
    void 설립일이_계약종료일보다_늦으면_예외() {
        assertThatThrownBy(() -> service.createCompany(req(LocalDate.of(2030, 1, 1), LocalDate.of(2020, 1, 1))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("설립일");
        verify(companyMapper, never()).insert(any());
    }

    @Test
    void 서브도메인이_중복되면_예외() {
        when(companyMapper.countByLocNm(any())).thenReturn(1);
        assertThatThrownBy(() -> service.createCompany(req(LocalDate.of(2020, 1, 1), LocalDate.of(2030, 1, 1))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("서브도메인");
    }
}
