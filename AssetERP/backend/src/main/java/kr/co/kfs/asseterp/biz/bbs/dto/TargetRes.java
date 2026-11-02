package kr.co.kfs.asseterp.biz.bbs.dto;

/** 개별 공지 대상자 한 줄 (AS-IS Bbs03_TargetModel). 조직·직책은 공지일 기준 */
public record TargetRes(Long targetId, Long noticeId, Long personId, String orgName, String titleName, String empNo, String empName) {
}
