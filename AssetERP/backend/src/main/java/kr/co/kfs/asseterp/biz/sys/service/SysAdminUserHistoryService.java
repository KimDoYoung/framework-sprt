package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserHistoryRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysAdminUserHistoryMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/sys/Sys81_AdminUserHistory.java (selectByDate L25) — 관리자 메뉴 화면이라 sys admin만. 테이블에 회사 컬럼이 없다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysAdminUserHistoryService {

    private final SysAdminUserHistoryMapper mapper;

    public List<AdminUserHistoryRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return mapper.selectByDate(startDate, closeDate);
    }
}
