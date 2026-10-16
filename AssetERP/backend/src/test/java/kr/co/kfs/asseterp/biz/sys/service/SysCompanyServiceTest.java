package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyCreateReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyRow;
import kr.co.kfs.asseterp.biz.sys.dto.CompanySearchParam;
import kr.co.kfs.asseterp.biz.sys.mapper.SysCompanyMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mockito.InOrder;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/** A15 고객별 시스템정보 관리 — 고객 목록·신규 등록 (AS-IS Sys01_Company) */
class SysCompanyServiceTest {

    private final SysCompanyMapper mapper = mock(SysCompanyMapper.class);
    private final SysCompanyService service = new SysCompanyService(mapper);
    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal companyAdmin = UserPrincipal.builder().userId(-2L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    private static CompanyCreateReq req(String nm, String loc, String bizNo) {
        return new CompanyCreateReq(nm, loc, " 1111 ", LocalDate.of(2025, 1, 1), null, bizNo, null, "1", null);
    }

    @Test
    void 조회는_고객명_양쪽에_퍼센트_없으면_퍼센트만() {
        service.searchCompanies(sysAdmin, "kfs", "true");
        service.searchCompanies(sysAdmin, null, "false");
        verify(mapper).searchCompanies(new CompanySearchParam("%kfs%", "true"));
        verify(mapper).searchCompanies(new CompanySearchParam("%", "false"));
    }

    @Test
    void 등록은_공백을_지우고_INSERT한_뒤_초기화를_원본_순서로_하고_다시_읽는다() {
        when(mapper.selectNextId()).thenReturn(100L, 101L, 102L);

        service.createCompany(sysAdmin, req(" 칼파 ", " kalpa ", " 105-86-52597 "));

        InOrder o = inOrder(mapper);
        o.verify(mapper).insertCompany(new CompanyRow(100L, "칼파", "kalpa", "1111", LocalDate.of(2025, 1, 1),
                null, "105-86-52597", null, "1", null));
        o.verify(mapper).insertOrgCode(any());
        o.verify(mapper).insertOrgInfo(any());
        o.verify(mapper).insertCodesFromAdmin(100L);
        o.verify(mapper).importDcrFromAdmin(100L);
        o.verify(mapper).insertAstDetailFromAdmin(100L);
        o.verify(mapper).insertLeaveYearFromAdmin(100L);
        o.verify(mapper).insertPayFormulaFromAdmin(100L);
        o.verify(mapper).insertIcsManager(100L);
        o.verify(mapper).insertAccountCodesFromAdmin(100L);
        o.verify(mapper).insertCompliancesFromAdmin(100L);
        o.verify(mapper).insertComplianceAnswersFromAdmin(100L);
        o.verify(mapper).insertApplicationFormsFromAdmin(100L);
        o.verify(mapper).insertExpenseFormsFromAdmin(100L);
        o.verify(mapper).insertFormMappingsFromAdmin(100L);
        o.verify(mapper).selectCompany(100L);
    }

    @Test
    void 필수값이_비면_등록하지_않는다() {
        assertThatThrownBy(() -> service.createCompany(sysAdmin, req("칼파", " ", "1")))
                .isInstanceOf(BusinessException.class).hasMessage("서브도메인은 필수 입력항목입니다.");
        assertThatThrownBy(() -> service.createCompany(sysAdmin,
                new CompanyCreateReq("칼파", "kalpa", "1111", null, null, "1", null, null, null)))
                .isInstanceOf(BusinessException.class).hasMessage("설립일은 필수 입력항목입니다.");
        verify(mapper, never()).insertCompany(any());
    }

    @Test
    void 서브도메인이나_사업자번호가_이미_있으면_등록하지_않는다() {
        when(mapper.countByLocNm("kfstest")).thenReturn(1);
        assertThatThrownBy(() -> service.createCompany(sysAdmin, req("칼파", "kfstest", "1")))
                .isInstanceOf(BusinessException.class).hasMessage("이미 사용 중인 서브도메인입니다.");
        when(mapper.countByBizNo("dup")).thenReturn(1);
        assertThatThrownBy(() -> service.createCompany(sysAdmin, req("칼파", "kalpa", "dup")))
                .isInstanceOf(BusinessException.class).hasMessage("이미 등록된 사업자등록번호입니다.");
        verify(mapper, never()).insertCompany(any());
    }

    @Test
    void KFS_관리자가_아니면_조회도_등록도_못한다() {
        assertThatThrownBy(() -> service.searchCompanies(companyAdmin, null, null)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.createCompany(companyAdmin, req("칼파", "kalpa", "1"))).isInstanceOf(BusinessException.class);
        verify(mapper, never()).insertCompany(any());
        verify(mapper, never()).selectCompany(anyLong());
    }
}
