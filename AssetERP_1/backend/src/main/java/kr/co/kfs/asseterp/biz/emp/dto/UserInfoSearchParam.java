package kr.co.kfs.asseterp.biz.emp.dto;

/**
 * 사용자정보 조회 조건 (AS-IS Emp01_Tab_UserInfo.retrieve → GridPagingLoader 파라미터)
 *
 * @param companyId  고객사 (null = 전체)
 * @param searchText '%검색어%' (서비스가 만든다)
 * @param useYn      'true' = 사용고객만 보기
 * @param quitYn     'true' = 퇴사자 제외
 * @param offset     페이지 시작 행 (row_num &gt; offset)
 * @param limit      페이지 크기 (AS-IS setToolBar(100))
 */
public record UserInfoSearchParam(
        Long companyId,
        String searchText,
        String useYn,
        String quitYn,
        int offset,
        int limit
) {
}
