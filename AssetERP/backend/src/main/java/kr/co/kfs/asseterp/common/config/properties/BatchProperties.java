package kr.co.kfs.asseterp.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/**
 * 배치 API 설정 (asseterp.batch.*) — AS-IS BatchMain 서블릿을 외부 cron이 부르던 것을 서버 간 호출로 바꾼다.
 * JWT가 아니라 API key + 호출 IP 제한으로 인증한다. 키는 소스에 두지 않고 환경변수로 넣는다.
 *
 * @param enabled      false면 모든 배치 호출을 거절한다
 * @param apiKey       서버 간 API key. 비어 있으면 모든 호출을 거절한다(기본 거절)
 * @param apiKeyHeader API key를 담는 요청 헤더 이름
 * @param allowedIps   호출을 허용할 IP 또는 CIDR 목록(예: 10.0.0.5, 10.0.0.0/24). 비어 있으면 모든 호출을 거절한다
 */
@ConfigurationProperties(prefix = "asseterp.batch")
public record BatchProperties(
        boolean enabled,
        String apiKey,
        String apiKeyHeader,
        List<String> allowedIps
) {
    public static final String DEFAULT_API_KEY_HEADER = "X-Batch-Api-Key";

    public BatchProperties {
        if (apiKeyHeader == null || apiKeyHeader.isBlank()) {
            apiKeyHeader = DEFAULT_API_KEY_HEADER;
        }
        allowedIps = allowedIps == null ? List.of() : List.copyOf(allowedIps);
    }
}
