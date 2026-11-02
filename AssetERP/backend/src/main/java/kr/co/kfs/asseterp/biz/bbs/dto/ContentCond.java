package kr.co.kfs.asseterp.biz.bbs.dto;

/** bbs31_content.selectByClassTreeIdPaging·Total 파라미터 (searchText는 %…% 완성형) */
public record ContentCond(Long companyId, Long classTreeId, Long personId, String searchText, long limit, long offset) {
}
