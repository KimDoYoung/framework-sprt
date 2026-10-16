package kr.co.kfs.asseterp.biz.sms.dto;

/** selectByText 파라미터 (searchText는 LIKE 패턴까지 만든 값) */
public record GroupSendHistoryParam(Long groupSendId, Long companyId, String searchText) {
}
