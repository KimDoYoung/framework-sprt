package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.OpenMenuLogRes;
import kr.co.kfs.asseterp.biz.sys.dto.OpenMenuLogSearchParam;
import kr.co.kfs.asseterp.biz.sys.mapper.SysOpenMenuLogMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/sys/Sys96_OpenMenuLog.java selectByTextAdminPaging L33 (목록 + 전체 건수) — 전 고객사를 보는 관리자 화면 → sys admin만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysOpenMenuLogService {

    private final SysOpenMenuLogMapper sysOpenMenuLogMapper;

    /** LIKE '%사원명%'는 서버가 만든다(05 §6). companyId null = 전체, className 빈 값 = '%'(전체 매뉴) */
    public PageRes<OpenMenuLogRes> search(UserPrincipal user, Long companyId, String searchText, String className, boolean useYn, int offset, int limit) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        OpenMenuLogSearchParam param = new OpenMenuLogSearchParam(companyId, "%" + (searchText == null ? "" : searchText) + "%",
                className == null || className.isEmpty() ? "%" : className, useYn, Math.max(offset, 0), limit > 0 ? limit : 100);
        return new PageRes<>(sysOpenMenuLogMapper.selectByTextAdminPagingTotal(param), sysOpenMenuLogMapper.selectByTextAdminPaging(param));
    }
}
