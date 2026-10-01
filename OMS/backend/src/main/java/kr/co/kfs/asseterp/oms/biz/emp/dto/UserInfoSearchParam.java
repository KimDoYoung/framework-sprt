package kr.co.kfs.asseterp.oms.biz.emp.dto;

/**
 * 사용자정보 조회 조건 (AS-IS selectBySearchTextPaging 파라미터 Map)
 *
 * @param companyId  null이면 전체 고객사
 * @param useYn      'true'면 사용 고객사만
 * @param quitYn     'true'면 퇴사자 제외
 */
public record UserInfoSearchParam(Long companyId, String searchText, String useYn, String quitYn, int offset, int limit) {
}
