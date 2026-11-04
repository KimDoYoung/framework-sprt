package kr.co.kfs.asseterp.biz.batch.service;

import kr.co.kfs.asseterp.biz.batch.dto.BatchNoticeLogParam;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchNoticeLogMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/** 배치 오류를 sys97_notice_log에 남긴다. 작업이 롤백돼도 로그는 남도록 별도 트랜잭션으로 쓰고, 실패해도 던지지 않는다(AS-IS와 같다). */
@Slf4j
@Service
@RequiredArgsConstructor
public class BatchNoticeLogService {

    private final BatchNoticeLogMapper mapper;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void error(String actionCode, int errorCode, String message) {
        try {
            mapper.insert(new BatchNoticeLogParam("BatchMain." + actionCode, "error(" + errorCode + ")", message, null));
        } catch (RuntimeException e) {
            log.error("배치 알림 로그 저장 실패: actionCode={}, {}", actionCode, e.toString());
        }
    }
}
