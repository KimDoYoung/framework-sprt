package kr.co.kfs.asseterp.common.log;

import kr.co.kfs.asseterp.common.config.properties.LogProperties;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;

class MdcLoggingFilterTest {

    private final MdcLoggingFilter filter = new MdcLoggingFilter(
            new LogProperties("X-Trace-Id", new LogProperties.RequestLog(true, List.of("/assets/**"))));

    @Test
    void 요청_중에는_MDC에_추적ID와_IP가_있고_응답헤더와_같으며_요청_후에는_비워진다() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/test/ping");
        request.setRemoteAddr("10.0.0.7");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicReference<String> traceIdInChain = new AtomicReference<>();
        AtomicReference<String> ipInChain = new AtomicReference<>();

        filter.doFilter(request, response, new MockFilterChain() {
            @Override
            public void doFilter(jakarta.servlet.ServletRequest req, jakarta.servlet.ServletResponse res) {
                traceIdInChain.set(MDC.get(MdcKeys.TRACE_ID));
                ipInChain.set(MDC.get(MdcKeys.CLIENT_IP));
                MDC.put(MdcKeys.USER_ID, "user1");
            }
        });

        assertThat(traceIdInChain.get()).hasSize(16).matches("[0-9a-f]+");
        assertThat(response.getHeader("X-Trace-Id")).isEqualTo(traceIdInChain.get());
        assertThat(ipInChain.get()).isEqualTo("10.0.0.7");
        assertThat(MDC.getCopyOfContextMap()).isNullOrEmpty();
    }

    @Test
    void 요청마다_다른_추적ID를_발급한다() {
        assertThat(MdcLoggingFilter.newTraceId()).isNotEqualTo(MdcLoggingFilter.newTraceId());
    }
}
