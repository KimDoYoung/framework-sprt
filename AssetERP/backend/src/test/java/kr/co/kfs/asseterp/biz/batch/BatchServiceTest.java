package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.dto.BatchRes;
import kr.co.kfs.asseterp.biz.batch.service.BatchAction;
import kr.co.kfs.asseterp.biz.batch.service.BatchNoticeLogService;
import kr.co.kfs.asseterp.biz.batch.service.BatchService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.function.Function;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

class BatchServiceTest {

    private final BatchNoticeLogService noticeLog = mock(BatchNoticeLogService.class);
    private final BatchReq req = new BatchReq("100", "cron", null, null, null, null, null, null, null);

    private BatchAction action(String code, Function<BatchReq, String> body) {
        return new BatchAction() {
            @Override
            public String actionCode() {
                return code;
            }

            @Override
            public String run(BatchReq r) {
                return body.apply(r);
            }
        };
    }

    @Test
    void actionCode에_맞는_작업을_실행하고_결과_문구를_돌려준다() {
        BatchService service = new BatchService(List.of(action("sch04Insert", r -> "미처리 스케줄 " + r.companyId())), noticeLog);

        BatchRes res = service.run("sch04Insert", req);

        assertThat(res.actionCode()).isEqualTo("sch04Insert");
        assertThat(res.message()).isEqualTo("미처리 스케줄 100");
        verify(noticeLog, never()).error(anyString(), anyInt(), anyString());
    }

    @Test
    void 없는_actionCode는_AS_IS_문구로_거절하고_오류_로그를_남긴다() {
        BatchService service = new BatchService(List.of(), noticeLog);

        assertThatThrownBy(() -> service.run("nope", req))
                .isInstanceOf(BusinessException.class)
                .hasMessage("작업구분(nope)을 확인할 수 없습니다.");
        verify(noticeLog).error("nope", -1, "작업구분(nope)을 확인할 수 없습니다.");
    }

    @Test
    void 작업이_실패하면_오류_로그를_남기고_예외를_그대로_던진다() {
        BusinessException failure = new BusinessException(ErrorCode.INVALID_INPUT, "기준일 형식 오류");
        BatchService service = new BatchService(List.of(action("alarm", r -> {
            throw failure;
        })), noticeLog);

        assertThatThrownBy(() -> service.run("alarm", req)).isSameAs(failure);
        verify(noticeLog).error(eq("alarm"), eq(-1), eq("기준일 형식 오류"));
    }

    @Test
    void 같은_actionCode가_둘이면_기동이_실패한다() {
        assertThatThrownBy(() -> new BatchService(
                List.of(action("dup", r -> "a"), action("dup", r -> "b")), noticeLog))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("dup");
    }
}
