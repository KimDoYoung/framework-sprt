package kr.co.kfs.asseterp.biz.batch.service;

import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.dto.BatchRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AS-IS BatchMain.service()의 actionCode 분기를 대신한다. actionCode로 BatchAction을 찾아 실행하고,
 * 실패하면 AS-IS처럼 sys97_notice_log에 'BatchMain.{actionCode}' 오류를 남긴다.
 * 트랜잭션은 각 BatchAction이 필요한 만큼 선언한다(이 클래스는 걸지 않는다 — 오류 로그가 작업 롤백에 묻히지 않게).
 */
@Slf4j
@Service
public class BatchService {

    private final Map<String, BatchAction> actions = new HashMap<>();
    private final BatchNoticeLogService noticeLogService;

    public BatchService(List<BatchAction> batchActions, BatchNoticeLogService noticeLogService) {
        this.noticeLogService = noticeLogService;
        for (BatchAction action : batchActions) {
            BatchAction previous = actions.put(action.actionCode(), action);
            if (previous != null) {
                throw new IllegalStateException("배치 actionCode가 중복됩니다: " + action.actionCode());
            }
        }
        log.info("배치 작업 {}개 등록: {}", actions.size(), actions.keySet());
    }

    public BatchRes run(String actionCode, BatchReq req) {
        BatchAction action = actions.get(actionCode);
        if (action == null) {
            String message = "작업구분(" + actionCode + ")을 확인할 수 없습니다.";
            noticeLogService.error(actionCode, -1, message);
            throw new BusinessException(ErrorCode.INVALID_INPUT, message);
        }

        log.info("배치 시작: actionCode={}, req={}", actionCode, req);
        try {
            String message = action.run(req);
            log.info("배치 끝: actionCode={}, result={}", actionCode, message);
            return new BatchRes(actionCode, message);
        } catch (RuntimeException e) {
            log.error("배치 실패: actionCode={}", actionCode, e);
            noticeLogService.error(actionCode, -1, e.getMessage());
            throw e;
        }
    }
}
