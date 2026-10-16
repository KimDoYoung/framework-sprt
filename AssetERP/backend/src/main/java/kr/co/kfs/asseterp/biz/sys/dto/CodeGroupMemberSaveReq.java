package kr.co.kfs.asseterp.biz.sys.dto;

/** 그룹에 코드 추가 한 행 (AS-IS Sys13_CodeGroup.insert — 그룹코드·그룹설명은 선택한 그룹 값) */
public record CodeGroupMemberSaveReq(Long codeKindId, String kindGroupCd, String kindGroupNm, Long codeId) {
}
