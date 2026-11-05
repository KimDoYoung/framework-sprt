package kr.co.kfs.asseterp.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 온라인 도움말 (asseterp.help.*)
 *
 * @param manualBaseUrl 사용자 매뉴얼 주소 (AS-IS idms-*.properties manualBaseUrl, user_manual.jsp: {manualBaseUrl}/{화면 클래스}.html)
 * @param amanUrl       A-Man 매뉴얼 서버 (AS-IS aman_opener.jsp AMAN_BASE_URL)
 * @param amanSecret    A-Man 토큰 서명 키 (HMAC-SHA256, A-Man 서버와 같아야 한다). 소스에 두지 않는다 → 환경변수 ASSETERP_AMAN_SECRET. 비우면 A-Man을 쓰지 않는다
 */
@ConfigurationProperties(prefix = "asseterp.help")
public record HelpProperties(String manualBaseUrl, String amanUrl, String amanSecret) {
}
