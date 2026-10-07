package kr.co.kfs.asseterp.biz.auth.service;

import kr.co.kfs.asseterp.biz.auth.mapper.LoginHistoryMapper;
import kr.co.kfs.asseterp.biz.user.dto.LoginAccount;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * AS-IS 로그인 이력(sys26_login) 기록.
 * 로그인 실패는 예외로 끝나 호출한 쪽 트랜잭션이 롤백되므로 별도 트랜잭션으로 커밋한다.
 * 이력 기록 실패가 로그인 자체를 막지 않도록 예외를 삼킨다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LoginHistoryService {

    private final LoginHistoryMapper loginHistoryMapper;

    /**
     * @param statusCode LoginHistoryMapper.STATUS_* (AS-IS 상태코드)
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(LoginAccount account, String statusCode, String clientIp, String userAgent) {
        try {
            loginHistoryMapper.insert(account.accountId(), clientIp, statusCode,
                    LoginHistoryMapper.LOGIN_MODE_PC, userAgent);
        } catch (DataAccessException e) {
            log.error("로그인 이력(sys26_login) 기록 실패 - accountId: {}, status: {}, cause: {}",
                    account.accountId(), statusCode, e.getMessage());
        }
    }
}
