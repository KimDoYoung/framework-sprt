package kr.co.kfs.asseterp.biz.help.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.help.dto.HelpConfigRes;
import kr.co.kfs.asseterp.common.config.properties.HelpProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.util.Base64;
import java.util.regex.Pattern;

/** 온라인 도움말 (AS-IS MainFrame helpAnchor → user_manual.jsp, aman_opener.jsp) */
@Service
@RequiredArgsConstructor
public class HelpService {

    /** aka(화면 식별자)는 URL 경로에 그대로 붙으므로 글자를 제한한다 */
    private static final Pattern AKA = Pattern.compile("[A-Za-z0-9_.\\-]{1,100}");

    private final HelpProperties properties;

    public HelpConfigRes getConfig() {
        return new HelpConfigRes(properties.manualBaseUrl(), isAmanEnabled());
    }

    /**
     * AS-IS aman_opener.jsp L28-62: 토큰 = base64url(payload|서명), payload = 사용자|시각(ms)|요청 IP, 서명 = base64url(HMAC-SHA256(payload)).
     * aka가 있으면 화면별 도움말 {amanUrl}/manual/{aka}, 없으면 전체 매뉴얼 {amanUrl}/docs.
     * 사용자: AS-IS는 personId 파라미터(회사관리자는 "admin", MainFrame L762) → TOBE는 로그인 토큰의 사용자.
     */
    public String getAmanUrl(UserPrincipal user, String aka, String clientIp) {
        if (!isAmanEnabled()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "A-Man 매뉴얼 연결이 설정되지 않았습니다. 관리자에게 문의해주세요");
        }
        if (StringUtils.hasText(aka) && !AKA.matcher(aka).matches()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        String userId = user.getUserId() != null && user.getUserId() > 0 ? String.valueOf(user.getUserId()) : "admin";
        String payload = userId + "|" + System.currentTimeMillis() + "|" + clientIp;
        String token = b64(payload + "|" + b64(hmac(payload)));
        String base = properties.amanUrl();
        return StringUtils.hasText(aka) ? base + "/manual/" + aka + "?token=" + token : base + "/docs?token=" + token;
    }

    private boolean isAmanEnabled() {
        return StringUtils.hasText(properties.amanUrl()) && StringUtils.hasText(properties.amanSecret());
    }

    private byte[] hmac(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(properties.amanSecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("A-Man 토큰 서명 실패", e);
        }
    }

    private static String b64(String s) {
        return b64(s.getBytes(StandardCharsets.UTF_8));
    }

    private static String b64(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
