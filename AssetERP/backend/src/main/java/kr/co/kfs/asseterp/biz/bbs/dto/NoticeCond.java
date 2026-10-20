package kr.co.kfs.asseterp.biz.bbs.dto;

/** bbs02_notice.selectByNoticeDetailCodePaging 파라미터 (searchText는 %…% 완성형) */
public record NoticeCond(Long companyId, String noticeType, String noticeDetailCode, String searchText, long limit, long offset) {
}
