package kr.co.kfs.asseterp.biz.bbs.dto;

/** bbs02_notice.selectByPublicYnPaging·Total 파라미터 (companyId는 KFS 공지라 0, searchText는 %…% 완성형, startDate·closeDate는 YYYY-MM-DD 또는 null) */
public record NoticeAdminCond(Long companyId, String openYn, String noticeType, String noticeDetail, String typeCode, String searchText,
                              String startDate, String closeDate, long limit, long offset) {
}
