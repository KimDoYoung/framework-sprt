package kr.co.kfs.asseterp.biz.auth.service;

import kr.co.kfs.asseterp.biz.auth.dto.PasswordChangeReq;
import kr.co.kfs.asseterp.biz.auth.dto.PasswordCodeReq;
import kr.co.kfs.asseterp.biz.auth.dto.PasswordTarget;
import kr.co.kfs.asseterp.biz.auth.dto.PasswordVerifyReq;
import kr.co.kfs.asseterp.biz.auth.mapper.AuthPasswordMapper;
import kr.co.kfs.asseterp.biz.sms.service.SmsSender;
import kr.co.kfs.asseterp.biz.sys.mapper.SysPasswordMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.List;

/**
 * 로그인 전 비밀번호 처리 (AS-IS Sys25_Lookup_Password · Sys25_Lookup_Reset → server/sys/Sys25_Password: getCode·checkPassword·checkPasswordRule·insert·extension).
 * <p>AS-IS와 다른 보안 보강 (인증 없이 부르는 API라서): 인증번호는 서버가 들고 있고(클라이언트에 주지 않는다) 확인 횟수·시간을 제한하며,
 * 비밀번호를 바꾸거나 연장할 때 현재 비밀번호(또는 인증번호 확인)를 서버가 검사하고, 틀리면 로그인 실패와 같은 잠금 횟수에 센다.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthPasswordService {

    private static final Duration CODE_TTL = Duration.ofSeconds(60);      // AS-IS Sys25_Lookup_Reset 타이머 60초
    private static final Duration VERIFIED_TTL = Duration.ofMinutes(10);  // 인증번호 확인 뒤 비밀번호를 바꿀 수 있는 시간
    private static final int MAX_VERIFY_ATTEMPTS = 5;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final AuthPasswordMapper mapper;
    private final SysPasswordMapper sysPasswordMapper;
    private final SmsSender smsSender;
    private final StringRedisTemplate redis;
    private final LoginLockService loginLockService;

    /** AS-IS getCode: 정보가 한 명과 맞으면 6자리 인증번호를 문자로 보낸다. 맞지 않으면 "일치하는 정보가 없습니다" */
    public void sendCode(PasswordCodeReq req) {
        List<PasswordTarget> list = mapper.selectByPhone(req.companyCode(), req.empNo(), req.phone());
        if (list.size() != 1) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "일치하는 정보가 없습니다");
        }
        PasswordTarget t = list.get(0);
        String code = String.valueOf(100000 + RANDOM.nextInt(900000));
        // 문자 발송 연동이 없으면(DisabledSmsSender) 여기서 예외 — 번호를 저장하지 않는다
        smsSender.send(t.companyId(), null, t.mobileTelNo(), "[Asset-ERP] 비밀번호 재설정 인증번호는 '" + code + "' 입니다.", t.korNm());
        redis.opsForValue().set(codeKey(req.companyCode(), req.empNo()), code, CODE_TTL);
        redis.delete(attemptKey(req.companyCode(), req.empNo()));
    }

    /** AS-IS Sys25_Lookup_Reset.resetPassword() L172-183: 인증번호가 맞으면 비밀번호 변경(init)을 열 수 있게 표시한다 */
    public void verifyCode(PasswordVerifyReq req) {
        String ck = codeKey(req.companyCode(), req.empNo());
        String code = redis.opsForValue().get(ck);
        if (code == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "인증번호 6자리를 다시 확인해주세요");
        }
        String ak = attemptKey(req.companyCode(), req.empNo());
        Long attempts = redis.opsForValue().increment(ak);
        redis.expire(ak, CODE_TTL);
        if (attempts != null && attempts > MAX_VERIFY_ATTEMPTS) {
            redis.delete(ck);
            throw new BusinessException(ErrorCode.INVALID_INPUT, "인증번호 확인 횟수를 초과했습니다. 인증번호를 다시 받아주세요");
        }
        if (req.code() == null || !code.equals(req.code().trim())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "인증번호 6자리를 다시 확인해주세요");
        }
        redis.delete(ck);
        redis.delete(ak);
        redis.opsForValue().set(verifiedKey(req.companyCode(), req.empNo()), "1", VERIFIED_TTL);
    }

    /** AS-IS Sys25_Lookup_Password.insertChcek() L205-281 → checkPassword · checkPasswordRule · insert */
    @Transactional
    public void change(PasswordChangeReq req) {
        PasswordTarget t = requireTarget(req.companyCode(), req.loginId());
        String vk = verifiedKey(req.companyCode(), req.loginId());
        boolean verified = Boolean.TRUE.equals(redis.hasKey(vk));
        boolean hasPassword = mapper.countCurrentPassword(t.personId()) > 0;
        if (!verified && hasPassword) {
            requireCurrentPassword(t, req.companyCode(), req.loginId(), req.currentPassword());
            // L218-220
            if (req.newPassword() != null && req.newPassword().equals(req.currentPassword())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "현재 비밀번호와 동일한 비밀번호는 사용하실 수 없습니다.");
            }
        }
        // L222-244 checkPasswordRule — 통과가 아니면 사유가 메시지
        String rule = mapper.checkPasswordRule(req.newPassword());
        if (!"Y".equals(rule)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, rule);
        }
        // L283-302 insert: 가장 최근 순번이 있으면 바꾸고 없으면 새 순번
        Long seq = sysPasswordMapper.selectLastSeq(t.companyId(), t.personId());
        if (seq != null) {
            sysPasswordMapper.updatePassword(t.companyId(), t.personId(), seq, req.newPassword());
        } else {
            sysPasswordMapper.insertPassword(t.companyId(), t.personId(), req.newPassword());
        }
        redis.delete(vk);
        loginLockService.resetFailures(t.personId());
        log.info("[보안] 비밀번호 변경: personId={}, 방식={}", t.personId(), verified ? "인증번호" : hasPassword ? "현재 비밀번호" : "최초 설정");
    }

    /** AS-IS Sys25_Lookup_Password.extension() L305-322: 비밀번호 만료를 3개월 늦춘다 (현재 비밀번호 확인이 더해졌다) */
    @Transactional
    public void extension(String companyCode, String loginId, String currentPassword) {
        PasswordTarget t = requireTarget(companyCode, loginId);
        requireCurrentPassword(t, companyCode, loginId, currentPassword);
        mapper.extension(t.personId());
        log.info("[보안] 비밀번호 만료 연장: personId={}", t.personId());
    }

    private PasswordTarget requireTarget(String companyCode, String loginId) {
        List<PasswordTarget> list = mapper.selectByLoginId(companyCode, loginId);
        if (list.size() != 1) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "처리중 오류발생. 전산팀에 문의하여 주십시오.");
        }
        return list.get(0);
    }

    /** 현재 비밀번호 확인. 틀리면 로그인 실패와 같은 횟수로 세어 잠근다 */
    private void requireCurrentPassword(PasswordTarget t, String companyCode, String loginId, String current) {
        if ("true".equals(t.lockYn())) {
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
        }
        if (current == null || current.isEmpty()) {
            // 비워 둔 채 누른 것은 추측이 아니므로 실패 횟수에 세지 않는다
            throw new BusinessException(ErrorCode.INVALID_INPUT, "현재 비밀번호를 확인해주세요");
        }
        if ("Y".equals(mapper.checkPassword(companyCode, loginId, current))) {
            return;
        }
        LoginLockService.FailureResult failure = loginLockService.recordFailure(t.personId());
        if (failure.locked()) {
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
        }
        throw new BusinessException(ErrorCode.INVALID_INPUT, "현재 비밀번호를 확인해주세요");
    }

    private static String codeKey(String companyCode, String empNo) { return "pwd:code:" + companyCode + ":" + empNo; }

    private static String attemptKey(String companyCode, String empNo) { return "pwd:attempt:" + companyCode + ":" + empNo; }

    private static String verifiedKey(String companyCode, String empNo) { return "pwd:verified:" + companyCode + ":" + empNo; }
}
