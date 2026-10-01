package com.asseterp.oms.common.websocket;

import com.asseterp.oms.common.log.MdcKeys;
import com.asseterp.oms.common.websocket.dto.ErrorPayload;
import com.asseterp.oms.common.websocket.dto.WsCategory;
import com.asseterp.oms.common.websocket.dto.WsEnvelope;
import com.asseterp.oms.common.websocket.dto.WsLevel;
import com.asseterp.oms.common.websocket.dto.WsMessage;
import com.asseterp.oms.common.websocket.dto.WsMessageType;
import com.asseterp.oms.common.websocket.dto.WsRoute;
import com.asseterp.oms.common.websocket.dto.WsSender;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class WsMessageTest {

    private final ObjectMapper objectMapper = JsonMapper.builder()
            .findAndAddModules()
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .build();

    @AfterEach
    void tearDown() {
        MDC.clear();
    }

    @Test
    void envelope_필드와_분류_추적ID가_채워진다() throws Exception {
        MDC.put(MdcKeys.TRACE_ID, "abc123");

        WsMessage<ErrorPayload> message = WsMessage.of(WsMessageType.ERROR, WsLevel.ERROR, "제목", "본문",
                new ErrorPayload("WS_DESTINATION_DENIED"), null);
        JsonNode json = objectMapper.readTree(objectMapper.writeValueAsString(message));

        assertThat(json.fieldNames()).toIterable().containsExactly(
                "id", "type", "category", "level", "title", "message", "payload", "sender", "sentAt", "traceId");
        assertThat(json.get("type").asText()).isEqualTo("ERROR");
        assertThat(json.get("category").asText()).isEqualTo(WsCategory.SYSTEM.name());
        assertThat(json.get("payload").get("code").asText()).isEqualTo("WS_DESTINATION_DENIED");
        assertThat(json.get("sender").get("username").asText()).isEqualTo(WsSender.SYSTEM.username());
        assertThat(json.get("sentAt").asText()).contains("T"); // ISO-8601
        assertThat(json.get("traceId").asText()).isEqualTo("abc123");
    }

    @Test
    void 요청_밖에서_만들면_추적ID를_새로_발급한다() {
        WsMessage<Void> message = WsMessage.of(WsMessageType.NOTICE, WsLevel.INFO, "공지", "본문", null, null);

        assertThat(message.traceId()).isNotBlank();
        assertThat(message.category()).isEqualTo(WsCategory.NOTICE);
    }

    @Test
    void Redis_전달_단위는_직렬화_후_복원된다() throws Exception {
        WsMessage<Map<String, String>> message = WsMessage.of(WsMessageType.SESSION_TERMINATED, WsLevel.ERROR,
                "동시 접속 차단", "본문", Map.of("reason", "MULTI_LOGIN"), null);
        WsEnvelope envelope = new WsEnvelope("inst-1", WsRoute.sessionControl(2L, "jti-new"), message);

        WsEnvelope restored = objectMapper.readValue(objectMapper.writeValueAsString(envelope), WsEnvelope.class);

        assertThat(restored.route()).isEqualTo(envelope.route());
        assertThat(restored.message().id()).isEqualTo(message.id());
        assertThat(restored.message().sentAt()).isEqualTo(message.sentAt());
        assertThat(restored.message().payload()).isEqualTo(Map.of("reason", "MULTI_LOGIN"));
    }
}
