package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/**
 * [상신] — 선택한 행의 ID(그리드 순서)와 화면의 기준연도, 고른 문서분류.
 * AS-IS는 행 모델 전체를 보냈지만 TOBE는 서버가 같은 조회 SQL로 다시 읽는다.
 */
public record UnLeaveApprReq(String stdYear, Long classTreeId, List<Long> ids) {
}
