package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 그룹(코드종류 + 그룹코드 + 그룹설명) 단위 조건 (AS-IS sys13_code_group.update/delete, selectByKindGroupCode)
 *
 * @param oriKindGroupCd 변경 전 그룹코드 (update)
 * @param oriKindGroupNm 변경 전 그룹설명 (update)
 * @param companyId      구성 코드 조회 회사 (selectByKindGroupCode)
 */
public record CodeGroupKey(Long codeKindId, String kindGroupCd, String kindGroupNm,
                           String oriKindGroupCd, String oriKindGroupNm, Long companyId) {
}
