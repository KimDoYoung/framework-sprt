package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeDeleteParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeKindRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysCodeKindMapper;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysCodeMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class SysCodeServiceTest {

    private final SysCodeMapper codeMapper = mock(SysCodeMapper.class);
    private final SysCodeKindMapper kindMapper = mock(SysCodeKindMapper.class);
    private final SysCodeService service = new SysCodeService(codeMapper, kindMapper);
    private final UserPrincipal companyAdmin = UserPrincipal.builder().userId(-1L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();
    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_ADMIN", "ROLE_SYSADMIN")).build();

    private static CodeSaveReq req(Long id, Long companyId, LocalDate applyDate) {
        return new CodeSaveReq(id, companyId, 7L, "01", "코드", "1", false, applyDate, null, null);
    }

    @Test
    void 회사관리자는_다른_회사를_골라도_로그인_회사로_조회한다() {
        service.searchCodes(companyAdmin, 7L, 30000L, null);
        verify(codeMapper).searchByCodeKindId(new CodeSearchParam(7L, 28000L, "", null));
        service.searchCodes(sysAdmin, 7L, 30000L, "x");
        verify(codeMapper).searchByCodeKindId(new CodeSearchParam(7L, 30000L, "x", null));
    }

    @Test
    void 신규_코드는_로그인_회사로_넣고_시작일이_없으면_1910_01_01() {
        when(kindMapper.selectById(7L)).thenReturn(new CodeKindRes(7L, "K", "종류", false, null));
        when(codeMapper.selectNextId()).thenReturn(900L);

        service.updateCodes(companyAdmin, List.of(req(-1L, 30000L, null)));

        verify(codeMapper).insert(new CodeRow(900L, 28000L, 7L, "01", "코드", "1", "false", LocalDate.of(1910, 1, 1), null, null));
    }

    @Test
    void 시스템_코드는_회사_0이고_KFS_관리자만_저장한다() {
        when(kindMapper.selectById(7L)).thenReturn(new CodeKindRes(7L, "K", "종류", true, null));
        assertThatThrownBy(() -> service.updateCodes(companyAdmin, List.of(req(-1L, null, LocalDate.now()))))
                .isInstanceOf(BusinessException.class).extracting("errorCode").isEqualTo(ErrorCode.ACCESS_DENIED);

        when(codeMapper.selectNextId()).thenReturn(900L);
        service.updateCodes(sysAdmin, List.of(req(-1L, 30000L, LocalDate.of(2020, 1, 1))));
        verify(codeMapper).insert(new CodeRow(900L, 0L, 7L, "01", "코드", "1", "false", LocalDate.of(2020, 1, 1), null, null));
    }

    @Test
    void 삭제는_회사관리자면_회사_조건을_붙인다() {
        service.deleteCodes(companyAdmin, List.of(1L));
        verify(codeMapper).delete(new CodeDeleteParam(28000L, List.of(1L)));
        service.deleteCodes(sysAdmin, List.of(2L));
        verify(codeMapper).delete(new CodeDeleteParam(null, List.of(2L)));
    }
}
