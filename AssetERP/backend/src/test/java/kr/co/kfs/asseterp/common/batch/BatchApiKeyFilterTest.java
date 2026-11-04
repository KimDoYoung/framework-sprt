package kr.co.kfs.asseterp.common.batch;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import kr.co.kfs.asseterp.common.config.properties.BatchProperties;
import kr.co.kfs.asseterp.common.error.ErrorResponseWriter;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;

class BatchApiKeyFilterTest {

    private static final String KEY = "test-key-1234";

    @AfterEach
    void clear() {
        SecurityContextHolder.clearContext();
    }

    private BatchApiKeyFilter filter(boolean enabled, String apiKey, List<String> ips) {
        BatchProperties props = new BatchProperties(enabled, apiKey, null, ips);
        return new BatchApiKeyFilter(props, new ErrorResponseWriter(new ObjectMapper()));
    }

    private MockHttpServletRequest request(String remoteAddr, String key) {
        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/v1/batch/sch04Insert");
        req.setRemoteAddr(remoteAddr);
        if (key != null) {
            req.addHeader(BatchProperties.DEFAULT_API_KEY_HEADER, key);
        }
        return req;
    }

    /** 필터를 실행하고 (체인이 불렸는지, 체인 안의 인증 정보)를 돌려준다 */
    private record Result(MockHttpServletResponse response, boolean chained, Authentication authInChain) {
    }

    private Result run(BatchApiKeyFilter f, MockHttpServletRequest req) throws Exception {
        MockHttpServletResponse res = new MockHttpServletResponse();
        AtomicReference<Authentication> auth = new AtomicReference<>();
        boolean[] chained = {false};
        FilterChain chain = (rq, rs) -> {
            chained[0] = true;
            auth.set(SecurityContextHolder.getContext().getAuthentication());
        };
        f.doFilter(req, res, chain);
        return new Result(res, chained[0], auth.get());
    }

    @Test
    void 키와_IP가_맞으면_통과하고_ROLE_BATCH_인증이_붙는다() throws Exception {
        Result r = run(filter(true, KEY, List.of("127.0.0.1")), request("127.0.0.1", KEY));

        assertThat(r.chained()).isTrue();
        assertThat(r.response().getStatus()).isEqualTo(200);
        assertThat(r.authInChain()).isNotNull();
        assertThat(r.authInChain().getAuthorities()).extracting(Object::toString).containsExactly("ROLE_BATCH");
        // 체인이 끝나면 인증 정보를 지운다
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    void CIDR로_허용한_대역의_IP는_통과한다() throws Exception {
        Result r = run(filter(true, KEY, List.of("10.0.0.0/24")), request("10.0.0.77", KEY));
        assertThat(r.chained()).isTrue();
    }

    @Test
    void 허용하지_않은_IP는_403() throws Exception {
        Result r = run(filter(true, KEY, List.of("127.0.0.1")), request("10.9.9.9", KEY));
        assertThat(r.chained()).isFalse();
        assertThat(r.response().getStatus()).isEqualTo(403);
    }

    @Test
    void 키가_없거나_틀리면_403() throws Exception {
        BatchApiKeyFilter f = filter(true, KEY, List.of("127.0.0.1"));

        Result none = run(f, request("127.0.0.1", null));
        Result wrong = run(f, request("127.0.0.1", "wrong-key"));
        Result prefix = run(f, request("127.0.0.1", "test-key"));

        assertThat(none.chained()).isFalse();
        assertThat(none.response().getStatus()).isEqualTo(403);
        assertThat(wrong.chained()).isFalse();
        assertThat(wrong.response().getStatus()).isEqualTo(403);
        assertThat(prefix.chained()).isFalse();
    }

    @Test
    void 비활성이면_올바른_키여도_403() throws Exception {
        Result r = run(filter(false, KEY, List.of("127.0.0.1")), request("127.0.0.1", KEY));
        assertThat(r.chained()).isFalse();
        assertThat(r.response().getStatus()).isEqualTo(403);
    }

    @Test
    void 설정이_비어_있으면_모두_거절한다() throws Exception {
        Result noKey = run(filter(true, "", List.of("127.0.0.1")), request("127.0.0.1", ""));
        Result noIps = run(filter(true, KEY, List.of()), request("127.0.0.1", KEY));

        assertThat(noKey.chained()).isFalse();
        assertThat(noKey.response().getStatus()).isEqualTo(403);
        assertThat(noIps.chained()).isFalse();
        assertThat(noIps.response().getStatus()).isEqualTo(403);
    }

    @Test
    void X_Forwarded_For는_믿지_않는다() throws Exception {
        MockHttpServletRequest req = request("10.9.9.9", KEY);
        req.addHeader("X-Forwarded-For", "127.0.0.1");

        Result r = run(filter(true, KEY, List.of("127.0.0.1")), req);

        assertThat(r.chained()).isFalse();
        assertThat(r.response().getStatus()).isEqualTo(403);
    }

    @Test
    void IPv6_루프백도_허용_목록에_있으면_통과한다() throws Exception {
        Result r = run(filter(true, KEY, List.of("::1")), request("0:0:0:0:0:0:0:1", KEY));
        assertThat(r.chained()).isTrue();
    }
}
