package kr.co.kfs.asseterp.common.notice;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import kr.co.kfs.asseterp.common.config.properties.NoticeProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 알림 시뮬레이터(tools/notice-simulator)로 보내는 구현 — AS-IS와 같은 계약(URL·헤더·본문·응답 해석)이다. 실제 서비스로는 아무것도 가지 않는다.
 * 응답 해석은 AS-IS 그대로: 앱알림은 {ok} · SMS는 {status:"0"} · 메일은 SMTP 성공.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "asseterp.notice.mode", havingValue = "sim")
public class SimNoticeSender implements NoticeSender {

    private final NoticeProperties props;
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();

    @Override
    public NoticeResult sendTalk(String email, String title, String body) {
        try {
            Map<String, Object> json = new LinkedHashMap<>();
            json.put("email", email);
            json.put("title", title);
            json.put("body", body);
            json.put("fromEmail", "erp@k-fs.co.kr");
            HttpResponse<String> res = http.send(HttpRequest.newBuilder(URI.create(props.talkUrl()))
                    .timeout(Duration.ofSeconds(5))
                    .header("Content-Type", "application/json;charset=utf-8")
                    .header("Accept", "application/json")
                    .header("x-api-key", props.talkApiKey())
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(json), StandardCharsets.UTF_8)).build(),
                    HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            JsonNode n = mapper.readTree(res.body());
            if (n.path("ok").asBoolean(false)) {
                return NoticeResult.success();
            }
            return NoticeResult.fail(n.has("error") ? n.get("error").asText() : res.body());
        } catch (Exception e) {
            log.warn("앱알림 발송 실패(sim): {}", e.getMessage());
            return NoticeResult.fail(e.getMessage());
        }
    }

    @Override
    public NoticeResult sendSms(List<String> mobiles, String message) {
        try {
            List<Map<String, String>> receiver = new ArrayList<>();
            for (String m : mobiles) {
                Map<String, String> r = new LinkedHashMap<>();
                r.put("name", "");
                r.put("mobile", m.replace("-", ""));
                r.put("note1", "");
                receiver.add(r);
            }
            Map<String, Object> json = new LinkedHashMap<>();
            json.put("title", "[Asset-ERP 알림]");
            json.put("message", message);
            json.put("sender", props.smsSender());
            json.put("username", props.smsUsername());
            json.put("receiver", receiver);
            json.put("key", props.smsKey());
            json.put("type", "java");
            HttpResponse<String> res = http.send(HttpRequest.newBuilder(URI.create(props.smsUrl()))
                    .timeout(Duration.ofSeconds(5))
                    .header("Cache-Control", "no-cache")
                    .header("Content-Type", "application/json;charset=utf-8")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(json), StandardCharsets.UTF_8)).build(),
                    HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            JsonNode n = mapper.readTree(res.body());
            if (res.statusCode() == 200 && "0".equals(n.path("status").asText())) {
                return NoticeResult.success();
            }
            return NoticeResult.fail(n.path("msg").asText() + " " + n.path("status").asText());
        } catch (Exception e) {
            log.warn("SMS 발송 실패(sim): {}", e.getMessage());
            return NoticeResult.fail(e.getMessage());
        }
    }

    @Override
    public NoticeResult sendMail(String toEmail, String subject, String htmlBody) {
        try {
            JavaMailSenderImpl sender = new JavaMailSenderImpl();
            sender.setHost(props.mailHost());
            sender.setPort(props.mailPort());
            sender.setUsername(props.mailUsername());
            sender.setPassword(props.mailPassword() == null ? "" : props.mailPassword());
            sender.setDefaultEncoding("UTF-8");
            Properties p = sender.getJavaMailProperties();
            p.put("mail.smtp.auth", "true");
            p.put("mail.smtp.connectiontimeout", "3000");
            p.put("mail.smtp.timeout", "5000");
            MimeMessage message = sender.createMimeMessage();
            message.setFrom(new InternetAddress(props.mailFrom(), "Asset-ERP", "UTF-8"));
            message.setRecipient(MimeMessage.RecipientType.TO, new InternetAddress(toEmail));
            message.setSubject(subject, "UTF-8");
            message.setContent(htmlBody, "text/html; charset=utf-8");
            message.setSentDate(new java.util.Date());
            sender.send(message);
            return NoticeResult.success();
        } catch (Exception e) {
            log.warn("메일 발송 실패(sim): {}", e.getMessage());
            return NoticeResult.fail(e.getMessage());
        }
    }
}
