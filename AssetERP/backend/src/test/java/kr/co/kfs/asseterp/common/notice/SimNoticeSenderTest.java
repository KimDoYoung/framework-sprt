package kr.co.kfs.asseterp.common.notice;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.kfs.asseterp.common.config.properties.NoticeProperties;

/** AA01 SimNoticeSender가 알림 시뮬레이터 계약(URL·헤더·본문)대로 보내는지 — 시뮬레이터가 떠 있을 때만 돈다(tools/run-notice-server.sh start) */
class SimNoticeSenderTest {

    private static final String BASE = "http://127.0.0.1:5161";
    private final HttpClient http = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();
    private SimNoticeSender sender;

    private JsonNode get(String path) throws Exception {
        return mapper.readTree(http.send(HttpRequest.newBuilder(URI.create(BASE + path)).GET().build(), HttpResponse.BodyHandlers.ofString()).body());
    }

    @BeforeEach
    void setUp() throws Exception {
        boolean up;
        try {
            up = get("/__health").path("ok").asBoolean(false);
        } catch (Exception e) {
            up = false;
        }
        assumeTrue(up, "알림 시뮬레이터가 안 떠 있어 건너뜀");
        get("/__reset");
        NoticeProperties p = new NoticeProperties("sim", BASE + "/talk/api/sendmsg", "sim-talk-key", BASE + "/index.php/api_v2/sms_change_word",
                "sim-sms", "sim-sms-key", "027858100", "127.0.0.1", 2525, "erp.sender@k-fs.co.kr", "sim", "erp.sender@k-fs.co.kr", List.of(), List.of());
        sender = new SimNoticeSender(p);
    }

    @Test
    void 세_종류가_시뮬레이터에_계약대로_도착한다() throws Exception {
        assertThat(sender.sendTalk("a@k-fs.co.kr", "상신문서(결재순서)", "본문 하나").ok()).isTrue();
        assertThat(sender.sendSms(List.of("010-1234-5678"), "문자 본문").ok()).isTrue();
        assertThat(sender.sendMail("b@k-fs.co.kr", "[알림] Asset-ERP 전자결재", "<b>메일</b> 본문").ok()).isTrue();

        JsonNode calls = get("/__calls");
        assertThat(calls).hasSize(3);
        for (JsonNode c : calls) {
            assertThat(c.path("problems")).as(c.toString()).isEmpty();      // 계약에서 어긋난 것 없음
            assertThat(c.path("result").asText()).isEqualTo("ok");
        }
        assertThat(calls.get(0).path("kind").asText()).isEqualTo("talk");
        assertThat(calls.get(0).path("from").asText()).isEqualTo("erp@k-fs.co.kr");
        assertThat(calls.get(1).path("to").asText()).isEqualTo("01012345678");     // 하이픈 제거
        assertThat(calls.get(2).path("title").asText()).isEqualTo("[알림] Asset-ERP 전자결재");
        assertThat(calls.get(2).path("from").asText()).contains("erp.sender@k-fs.co.kr");
        assertThat(calls.get(2).path("body").asText()).contains("메일");
    }

    @Test
    void 키가_다르면_앱알림이_실패로_돌아온다() throws Exception {
        NoticeProperties p = new NoticeProperties("sim", BASE + "/talk/api/sendmsg", "wrong", BASE + "/x", "u", "k", "1", "127.0.0.1", 2525, "u", "p", "f@k", List.of(), List.of());
        NoticeResult r = new SimNoticeSender(p).sendTalk("a@k", "t", "b");
        assertThat(r.ok()).isFalse();
        assertThat(r.message()).contains("x-api-key");
    }
}
