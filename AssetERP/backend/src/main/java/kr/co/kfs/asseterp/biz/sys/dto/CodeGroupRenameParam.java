package kr.co.kfs.asseterp.biz.sys.dto;

/** AS-IS sys13_code_group.update — 옛 그룹코드·설명이 같은 모든 행을 새 값으로 */
public record CodeGroupRenameParam(Long codeKindId, String oriKindGroupCd, String oriKindGroupNm,
                                   String kindGroupCd, String kindGroupNm) {
}
