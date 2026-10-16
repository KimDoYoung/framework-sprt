package kr.co.kfs.asseterp.biz.sys.dto;

/** 코드 그룹(헤더) 저장 한 행 (codeGroupId가 null/0 이하면 신규) */
public record CodeGroupSaveReq(Long codeGroupId, Long codeKindId, String kindGroupCd, String kindGroupNm) {
}
