package kr.co.kfs.asseterp.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 새 메일 시스템(assetMail) 설정 (asseterp.assetmail.*) — AS-IS utils.mail.AssetMailSend:
 * 주소는 환경변수 ASSETMAIL_BASE가 있으면 그것, 없으면 사용자 kfiamuser만 https://talk.k-fs.co.kr:50443/mail, 나머지는 https://dev.mail.k-fs.co.kr.
 * 서비스 토큰은 환경변수 ASSETMAIL_SERVICE_TOKEN. 개발 서버는 tools/ext-simulator를 가리킨다.
 *
 * @param baseUrl      assetMail 주소(끝 / 없이). 원본의 ASSETMAIL_BASE와 같다 — 사용자별 주소 고르기(kfiamuser)는 운영 연동 때 정한다
 * @param serviceToken X-Service-Token 헤더 값. 비면 "assetMail 서비스 토큰이 설정되지 않았습니다." (원본 checkServiceToken)
 */
@ConfigurationProperties(prefix = "asseterp.assetmail")
public record AssetMailProperties(String baseUrl, String serviceToken) {
}
