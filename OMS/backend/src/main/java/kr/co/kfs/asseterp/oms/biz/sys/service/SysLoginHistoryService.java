package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.sys.dto.LoginHistoryRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.LoginHistorySearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysLoginHistoryMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 로그인내역 조회 (AS-IS server/sys/Sys26_Login.selectByLoginDate). AS-IS의 삭제 버튼은 툴바에 붙어 있지 않아 옮기지 않는다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysLoginHistoryService {

    private final SysLoginHistoryMapper sysLoginHistoryMapper;

    public List<LoginHistoryRes> searchLoginHistories(LocalDate startDate, LocalDate closeDate, Long companyId, String loginMode) {
        if (startDate == null || closeDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "조회기간을 입력하세요.");
        }
        return sysLoginHistoryMapper.searchByLoginDate(new LoginHistorySearchParam(startDate, closeDate,
                companyId == null ? "%" : String.valueOf(companyId),
                loginMode == null || loginMode.isBlank() ? "%" : loginMode));
    }
}
