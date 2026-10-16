package kr.co.kfs.asseterp.biz.sys.dto;

/** AS-IS selectByTextAdminPaging 조건: companyId null = 전체, searchText = '%사원명%', className = '%' 또는 클래스명, useYn = 실사용 건만 */
public record OpenMenuLogSearchParam(Long companyId, String searchText, String className, boolean useYn, int offset, int limit) {
}
