package kr.co.kfs.asseterp.biz.bbs.dto;

/** bbs02_notice.selectByPersonIdPaging·Total 파라미터 (searchText는 %…% 완성형, startDate·closeDate는 YYYY-MM-DD 또는 null) */
public record NoticePersonCond(Long companyId, Long personId, String noticeType, String noticeDetailCode, String searchText,
                               String startDate, String closeDate, long limit, long offset) {
}
