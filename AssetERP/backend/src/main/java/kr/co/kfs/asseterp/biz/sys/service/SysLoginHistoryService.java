package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.LoginHistoryRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysLoginHistoryMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/sys/Sys26_Login.java (selectByLoginDate L21 / delete L31) — 관리자 화면(고객사 전체) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysLoginHistoryService {

    private final SysLoginHistoryMapper sysLoginHistoryMapper;

    /** AS-IS Sys26_Tab_LoginHistory.retrieve() L133-167: 회사·접속구분 '전체'·'%'면 '%' */
    public List<LoginHistoryRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String companyId, String loginMode) {
        requireSysAdmin(user);
        return sysLoginHistoryMapper.selectByLoginDate(startDate, closeDate, likeOrAll(companyId), likeOrAll(loginMode));
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return sysLoginHistoryMapper.deleteLoginHistories(ids);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    private static String likeOrAll(String value) {
        return value == null || value.isEmpty() ? "%" : value;
    }
}
