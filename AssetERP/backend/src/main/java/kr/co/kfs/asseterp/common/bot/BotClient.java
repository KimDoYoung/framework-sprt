package kr.co.kfs.asseterp.common.bot;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.kfs.asseterp.common.config.properties.BotProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * AS-IS myApp/server/utils/bot/BotService.call(map) L26-129 — AI 서버에 JSON을 POST 하고 {success, content, error}를 읽는다.
 * 헤더(Cache-Control·Content-Type·Accept)와 본문 키는 원본 그대로. 주소는 asseterp.bot.url(개발은 tools/ext-simulator).
 * 원본과 다른 점: 원본은 시간 제한이 없다. TOBE는 연결 10초·응답 120초(새 메일 연동 AssetMailSend와 같은 값)로 둔다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class BotClient {

    /** resultMap {resultStatus 1|-1, content, errorMsg} */
    public record BotResult(boolean ok, String content, String errorMsg) {
    }

    private final BotProperties props;
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

    public BotResult call(String userPrompt, String taskType) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("user_prompt", userPrompt);
        body.put("task_type", taskType);
        try {
            HttpResponse<String> res = http.send(HttpRequest.newBuilder(URI.create(props.url()))
                    .timeout(Duration.ofSeconds(120))
                    .header("Cache-Control", "no-cache")
                    .header("Content-Type", "application/json;charset=utf-8")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body), StandardCharsets.UTF_8)).build(),
                    HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            // L64-89: 2xx면 본문을 성공 응답으로, 400 이상이면 본문 전체가 실패 사유
            if (res.statusCode() >= 400) {
                return new BotResult(false, null, res.body());
            }
            JsonNode n = mapper.readTree(res.body());
            boolean success = n.path("success").asBoolean(false);
            String content = n.path("content").isNull() || n.path("content").isMissingNode() ? null : n.path("content").asText();
            String error = n.path("error").isNull() || n.path("error").isMissingNode() ? null : n.path("error").asText();
            return success ? new BotResult(true, content, null) : new BotResult(false, null, error);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return new BotResult(false, null, e.getMessage());
        } catch (Exception e) {
            // L119-126: 예외 문구를 errorMsg로
            log.warn("AI 서버 호출 실패: {}", e.getMessage());
            return new BotResult(false, null, e.getMessage());
        }
    }
}
