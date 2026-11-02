package kr.co.kfs.asseterp.biz.bbs.dto;

/** bbs02_notice.selectByCompanyIdPaging·Total 파라미터 (searchText는 %…% 완성형, systemNoticeYn은 불러오기 창만 true) */
public record NoticeMngCond(Long companyId, Long personId, String noticeType, String noticeDetail, String searchText,
                            boolean systemNoticeYn, long limit, long offset) {
}
