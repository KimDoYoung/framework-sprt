package kr.co.kfs.asseterp.biz.sys.dto;

/** 코드 그룹 한 행 (AS-IS Sys13_CodeGroupModel). codeId 0 = 그룹 헤더, 아니면 소속 코드(code·name) */
public record CodeGroupRes(Long codeGroupId, String kindGroupCd, String kindGroupNm, Long codeKindId, Long codeId,
                           String code, String name) {
}
