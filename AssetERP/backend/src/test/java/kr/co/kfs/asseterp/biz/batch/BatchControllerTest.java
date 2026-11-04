package kr.co.kfs.asseterp.biz.batch;

import com.fasterxml.jackson.databind.ObjectMapper;
import kr.co.kfs.asseterp.biz.batch.controller.BatchController;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.biz.batch.service.BatchService;
import kr.co.kfs.asseterp.common.batch.BatchApiKeyFilter;
import kr.co.kfs.asseterp.common.config.properties.BatchProperties;
import kr.co.kfs.asseterp.common.error.ErrorResponseWriter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** 컨트롤러 바인딩(AS-IS 파라미터 이름, GET·POST)과 API key 필터를 함께 확인한다. SecurityConfig의 체인 순서는 배포본에서 확인한다. */
class BatchControllerTest {

    private static final String KEY = "k-1";
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        BatchAction echo = new BatchAction() {
            @Override
            public String actionCode() {
                return "echo";
            }

            @Override
            public String run(BatchReq r) {
                return "company=" + r.companyId() + ",worker=" + r.worker() + ",stdDate=" + r.stdDate();
            }
        };
        BatchService service = new BatchService(List.of(echo), mock(BatchNoticeLogService.class));
        BatchApiKeyFilter filter = new BatchApiKeyFilter(
                new BatchProperties(true, KEY, null, List.of("127.0.0.1")),
                new ErrorResponseWriter(new ObjectMapper()));
        mvc = MockMvcBuilders.standaloneSetup(new BatchController(service))
                .addFilters(filter)
                .build();
    }

    @Test
    void GET으로_AS_IS_파라미터_이름을_받는다() throws Exception {
        mvc.perform(get("/api/v1/batch/echo")
                        .param("companyId", "100").param("worker", "cron").param("stdDate", "20261104")
                        .header("X-Batch-Api-Key", KEY)
                        .with(r -> {
                            r.setRemoteAddr("127.0.0.1");
                            return r;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.actionCode").value("echo"))
                .andExpect(jsonPath("$.data.message").value("company=100,worker=cron,stdDate=20261104"));
    }

    @Test
    void POST도_받는다() throws Exception {
        mvc.perform(post("/api/v1/batch/echo").param("companyId", "7")
                        .header("X-Batch-Api-Key", KEY)
                        .with(r -> {
                            r.setRemoteAddr("127.0.0.1");
                            return r;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.message").value("company=7,worker=null,stdDate=null"));
    }

    @Test
    void 키가_없으면_403() throws Exception {
        mvc.perform(get("/api/v1/batch/echo").with(r -> {
                    r.setRemoteAddr("127.0.0.1");
                    return r;
                }))
                .andExpect(status().isForbidden());
    }
}
