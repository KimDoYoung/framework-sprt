package kr.co.kfs.asseterp.biz.sys.dto;

/** 특정화면 사용요청 저장 한 행 (specificMenuRequestId가 null/0 이하면 신규). 화면이 바꾸는 열: 특정업무·결재문서 */
public record SpecificMenuRequestSaveReq(Long specificMenuRequestId, String specificWorkCd, Long apprId) {
}
