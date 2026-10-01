package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.util.List;

/**
 * 접속 중 사원 조회 조건 (AS-IS selectByLoginUserPaging 파라미터)
 *
 * @param personIds  접속 중 사원 ID (AS-IS loginList — TOBE는 presence)
 * @param companyId  회사 ID 문자열 LIKE ('%'면 전체)
 * @param searchText 고객사명/사원명/전화 LIKE 패턴
 */
public record OnlinePersonParam(List<Long> personIds, String companyId, String searchText) {
}
