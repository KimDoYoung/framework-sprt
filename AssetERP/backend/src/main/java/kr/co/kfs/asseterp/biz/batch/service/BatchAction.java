package kr.co.kfs.asseterp.biz.batch.service;

import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;

/**
 * 배치 작업 하나 = AS-IS BatchMain의 actionCode 분기 하나.
 * 구현체는 @Component로 등록하면 BatchService가 actionCode로 모은다. 같은 actionCode가 둘이면 기동이 실패한다.
 */
public interface BatchAction {

    /** AS-IS actionCode (예: "sch04Insert") */
    String actionCode();

    /**
     * 작업을 실행하고 AS-IS가 응답에 쓰던 결과 문구를 돌려준다.
     * 실패하면 BusinessException(또는 RuntimeException)을 던진다 — 이때 BatchService가 sys97_notice_log에 오류를 남긴다.
     */
    String run(BatchReq req);
}
