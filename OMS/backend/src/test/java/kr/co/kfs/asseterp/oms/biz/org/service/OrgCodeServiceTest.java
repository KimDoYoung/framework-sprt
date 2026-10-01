package kr.co.kfs.asseterp.oms.biz.org.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgCodeSaveReq;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgHistoryRes;
import kr.co.kfs.asseterp.oms.biz.org.mapper.OrgCodeMapper;
import kr.co.kfs.asseterp.oms.biz.org.mapper.OrgHistoryMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OrgCodeServiceTest {

    private final OrgCodeMapper codeMapper = mock(OrgCodeMapper.class);
    private final OrgHistoryMapper historyMapper = mock(OrgHistoryMapper.class);
    private final OrgCodeService service = new OrgCodeService(codeMapper, historyMapper);
    private final OrgHistoryService historyService = new OrgHistoryService(historyMapper, codeMapper, service);
    private final UserPrincipal user = UserPrincipal.builder().userId(-1L).companyId(28000L).roles(List.of()).build();
    private static final LocalDate OPEN = LocalDate.of(2020, 1, 1);

    private static OrgCodeSaveReq req(Long infoId, LocalDate modDate) {
        return new OrgCodeSaveReq(infoId, 1L, "11000", "본부", null, "0020", "1", modDate, "변경", OPEN, "개설", null, null, null);
    }

    @Test
    void 신규_조직은_코드ID와_이력ID가_같고_이력_변경일은_개설일() {
        when(codeMapper.selectCompanyId(1L)).thenReturn(28000L);
        when(codeMapper.selectNextId()).thenReturn(900L);
        service.createOrgCode(user, req(null, null));
        verify(codeMapper).insertInfo(argThat(r -> r.orgInfoId() == 900L && r.orgCodeId() == 900L && OPEN.equals(r.modDate()) && "개설".equals(r.modReason())));
        verify(codeMapper).insertCode(argThat(r -> r.orgCodeId() == 900L && r.companyId() == 28000L));
    }

    @Test
    void 변경일이_같으면_이력을_고치고_다르면_새_이력() {
        when(codeMapper.selectCompanyId(any())).thenReturn(28000L);
        LocalDate mod = LocalDate.of(2024, 1, 1);
        when(codeMapper.selectInfo(50L)).thenReturn(new OrgHistoryRes(50L, 10L, 1L, mod, null, "본부", null, null, null, null, null));

        service.updateOrgCode(user, 10L, req(50L, mod));
        verify(codeMapper).updateInfo(argThat(r -> r.orgInfoId() == 50L));

        when(codeMapper.selectNextId()).thenReturn(901L);
        service.updateOrgCode(user, 10L, req(50L, LocalDate.of(2025, 1, 1)));
        verify(codeMapper).insertInfo(argThat(r -> r.orgInfoId() == 901L && r.orgCodeId() == 10L));
    }

    @Test
    void 변경일이_개설일보다_앞서면_예외() {
        when(codeMapper.selectCompanyId(any())).thenReturn(28000L);
        assertThatThrownBy(() -> service.updateOrgCode(user, 10L, req(50L, LocalDate.of(2019, 1, 1))))
                .isInstanceOf(BusinessException.class).hasMessageContaining("개설일 이후");
    }

    @Test
    void 다른_회사_조직은_수정할_수_없다() {
        when(codeMapper.selectCompanyId(10L)).thenReturn(30000L);
        assertThatThrownBy(() -> service.updateOrgCode(user, 10L, req(50L, OPEN))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 하위_조직이나_사원이_있으면_조직을_지울_수_없다() {
        when(codeMapper.selectCompanyId(10L)).thenReturn(28000L);
        when(historyMapper.countChildren(10L)).thenReturn(1);
        assertThatThrownBy(() -> historyService.deleteOrg(user, 10L)).hasMessageContaining("하위부서");
        when(historyMapper.countChildren(10L)).thenReturn(0);
        when(historyMapper.countEmployees(10L)).thenReturn(2);
        assertThatThrownBy(() -> historyService.deleteOrg(user, 10L)).hasMessageContaining("사원");
        verify(codeMapper, never()).deleteCode(any());
    }
}
