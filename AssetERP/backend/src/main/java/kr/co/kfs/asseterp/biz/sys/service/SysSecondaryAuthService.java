package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sms.service.SmsSender;
import kr.co.kfs.asseterp.biz.sys.mapper.SysLoginManageMapper;
import kr.co.kfs.asseterp.biz.sys.mapper.SysSecondaryAuthMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;

/**
 * 2차 인증 (AS-IS Sys83_Lookup_TempPassword → server/sys/Sys83_SecondaryAuthUser: sendTempPassword·selectByTempPassword, LoginPage.checkExt).
 * AS-IS는 인증번호와 휴대폰 번호를 화면이 만들어 보냈다 — TOBE는 서버가 로그인한 사원의 등록 번호로 만들고 보낸다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysSecondaryAuthService {

    private static final int VALID_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final SysSecondaryAuthMapper mapper;
    private final SysLoginManageMapper loginManageMapper;
    private final SmsSender smsSender;
    private final StringRedisTemplate redis;

    /** LoginPage.checkExt() L594: 회사가 2차 인증을 쓰고 로그인 사용자가 회사관리자가 아니면 필요 */
    public boolean isRequired(UserPrincipal user) {
        return user.getUserId() > 0 && mapper.selectSecondaryAuthYn(user.getCompanyId());
    }

    /** AS-IS open() L46-52 + sendTempPassword: 휴대폰 번호가 없으면 거절, 있으면 6자리를 문자로 보내고 기록 */
    @Transactional
    public void send(UserPrincipal user) {
        SysLoginManageMapper.PersonPhone person = loginManageMapper.selectPersonPhone(user.getUserId());
        if (person == null || person.mobileTelNo() == null || person.mobileTelNo().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "해당 사원의 정보로 존재하는 휴대폰 번호가 없습니다. 관리자에게 문의부탁드립니다");
        }
        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        smsSender.send(user.getCompanyId(), null, person.mobileTelNo(), "[Asset-ERP] 인증번호는 " + code + " 입니다.", person.korNm());
        mapper.insert(user.getCompanyId(), user.getUserId(), person.mobileTelNo(), code);
        redis.delete(attemptKey(user));
    }

    /** AS-IS confirm() L155-176 → selectByTempPassword. 맞으면 true */
    public boolean verify(UserPrincipal user, String code) {
        String key = attemptKey(user);
        Long attempts = redis.opsForValue().increment(key);
        redis.expire(key, Duration.ofMinutes(VALID_MINUTES));
        if (attempts != null && attempts > MAX_ATTEMPTS) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "인증번호 확인 횟수를 초과했습니다. 인증번호를 다시 발급받아주세요");
        }
        boolean ok = code != null && mapper.countValid(user.getCompanyId(), user.getUserId(), code.trim(), VALID_MINUTES) > 0;
        if (ok) {
            redis.delete(key);
        }
        return ok;
    }

    private static String attemptKey(UserPrincipal user) {
        return "sec:attempt:" + user.getUserId();
    }
}
