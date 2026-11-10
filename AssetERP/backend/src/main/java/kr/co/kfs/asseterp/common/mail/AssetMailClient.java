package kr.co.kfs.asseterp.common.mail;

import java.net.ConnectException;
import java.net.URI;
import java.net.URL;
import java.net.UnknownHostException;
import java.net.http.HttpClient;
import java.net.http.HttpConnectTimeoutException;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.net.ssl.SSLException;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.kfs.asseterp.common.config.properties.AssetMailProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * AS-IS myApp/server/utils/mail/AssetMailSend.openMailWrite L129-253 (VERSION 0.182.888) — 새 메일 시스템(assetMail)에 메일 쓰기창을 만들고 그 주소(open_url)를 받는다.
 * 요청 본문·헤더·오류 문구('[assetMail] …')는 원본 그대로. 주소는 asseterp.assetmail.base-url(개발은 tools/ext-simulator).
 * 원본과 다른 점: open_url 검사에서 원본은 https만 받는다. TOBE는 호출한 주소와 같은 scheme만 받는다(운영 주소가 https면 같은 검사, 시뮬레이터는 http).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AssetMailClient {

    private final AssetMailProperties props;
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

    public String openMailWrite(Long refKey, String header, String content, String fileKey, Long personId,
                                List<String> fileList, String ssoToken) {
        // checkServiceToken L71-75
        if (isBlank(props.serviceToken())) {
            throw fail("assetMail 서비스 토큰이 설정되지 않았습니다.");
        }
        if (personId == null) {
            throw fail("메일 발송 사용자 정보가 없습니다.");
        }
        if (isBlank(ssoToken)) {
            throw fail("assetMail SSO 토큰이 없습니다.");
        }
        String selectUrl = props.baseUrl() == null ? "" : props.baseUrl().trim().replaceAll("/+$", "");

        Map<String, Object> req = new LinkedHashMap<>();
        req.put("refKey", refKey);
        req.put("personId", personId);
        req.put("header", header);
        req.put("content", content);
        req.put("fileKey", fileKey);
        req.put("fileList", fileList);
        req.put("sso_token", ssoToken);

        String step = "연결";
        try {
            HttpRequest httpReq = HttpRequest.newBuilder(URI.create(selectUrl + "/api/erp/mail-write"))
                    .timeout(Duration.ofSeconds(120))
                    .header("Content-Type", "application/json; charset=UTF-8")
                    .header("Accept", "application/json")
                    .header("X-Service-Token", props.serviceToken())
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(req), StandardCharsets.UTF_8))
                    .build();
            HttpResponse<String> res = http.send(httpReq, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            step = "응답 확인";
            int statusCode = res.statusCode();
            JsonNode json;
            try {
                String body = res.body();
                json = mapper.readTree(body == null || body.isBlank() ? "{}" : body);
                if (json == null || !json.isObject()) {
                    throw new IllegalStateException("assetMail 응답 JSON 형식이 올바르지 않습니다.");
                }
            } catch (Exception e) {
                if (statusCode < 200 || statusCode >= 300) {
                    throw fail("[assetMail] 메일 쓰기창 생성 실패 (HTTP " + statusCode + ")");
                }
                throw fail("[assetMail] 응답을 해석할 수 없습니다.");
            }
            if (statusCode < 200 || statusCode >= 300) {
                throw fail(errorText(json, statusCode, "메일 쓰기창 생성에 실패했습니다."));
            }
            String openUrl = text(json, "open_url");
            if (isBlank(openUrl)) {
                throw fail("[assetMail] 응답에 메일 작성 화면 주소(open_url)가 없습니다.");
            }
            URI uri;
            try {
                uri = URI.create(openUrl);
            } catch (IllegalArgumentException e) {
                throw fail("[assetMail] 메일 작성 화면 주소 형식이 올바르지 않습니다: " + openUrl);
            }
            URL base = URI.create(selectUrl).toURL();
            String expectedHost = base.getHost();
            if (!base.getProtocol().equalsIgnoreCase(uri.getScheme())
                    || uri.getHost() == null
                    || !expectedHost.equalsIgnoreCase(uri.getHost())
                    || uri.getUserInfo() != null) {
                throw fail("[assetMail] 메일 작성 화면 주소가 호출한 주소와 다릅니다 — 호출: " + expectedHost
                        + " / 응답: " + uri.getHost() + " (assetMail .env MAIL_PUBLIC_BASE 또는 ERP ASSETMAIL_BASE 확인)");
            }
            return openUrl;
        } catch (BusinessException e) {
            throw e;
        } catch (HttpConnectTimeoutException e) {
            throw fail("[assetMail] 연결 시간이 초과되었습니다(10초) — " + selectUrl);
        } catch (HttpTimeoutException e) {
            throw fail("[assetMail] 응답 시간이 초과되었습니다(120초) — " + selectUrl);
        } catch (UnknownHostException e) {
            throw fail("[assetMail] 서버 주소를 찾을 수 없습니다(DNS) — " + selectUrl);
        } catch (ConnectException e) {
            throw fail("[assetMail] 서버에 연결할 수 없습니다(꺼져 있거나 방화벽) — " + selectUrl);
        } catch (SSLException e) {
            throw fail("[assetMail] 보안 연결(SSL 인증서)에 실패했습니다 — " + selectUrl + " · " + e.getMessage());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw fail("[assetMail] 통신 오류(" + step + ") — " + e.getMessage());
        } catch (Exception e) {
            log.warn("assetMail 호출 실패: {}", e.toString());
            throw fail("[assetMail] 통신 오류(" + step + ") — " + e.getMessage());
        }
    }

    /** errorText L65-69: assetMail 오류 문구를 그대로 쓴다(이미 '[assetMail] …' 형식) */
    private String errorText(JsonNode json, int statusCode, String fallback) {
        String m = text(json, "message");
        if (isBlank(m)) {
            return "[assetMail] " + fallback + " (HTTP " + statusCode + ")";
        }
        return m.startsWith("[assetMail]") ? m : "[assetMail] " + m;
    }

    private static String text(JsonNode json, String key) {
        JsonNode n = json.get(key);
        return n == null || n.isNull() ? null : n.asText();
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private static BusinessException fail(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }
}
