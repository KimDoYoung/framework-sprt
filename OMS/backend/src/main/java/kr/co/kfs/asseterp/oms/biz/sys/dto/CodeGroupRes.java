package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 공통코드 그룹 행 (AS-IS Sys13_CodeGroupModel). 그룹 정의 행은 codeId = 0, 그룹 구성 코드 행은 codeId = sys09_code_id
 *
 * @param code 구성 코드의 코드값 (sys09_code)
 * @param name 구성 코드의 코드명 (sys09_name)
 */
public record CodeGroupRes(Long codeGroupId, String kindGroupCd, String kindGroupNm, Long codeKindId, Long codeId,
                           String note, String code, String name) {
}
