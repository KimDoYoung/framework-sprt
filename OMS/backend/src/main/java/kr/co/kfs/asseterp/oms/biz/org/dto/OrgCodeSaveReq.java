package kr.co.kfs.asseterp.oms.biz.org.dto;

import java.time.LocalDate;

/**
 * 조직 등록·수정 (AS-IS Org01_Edit_OrgCode 등록, Org02_Edit_Info 수정).
 * 수정 시 infoId는 편집 중인 이력 행, modDate가 그 이력의 변경일과 다르면 새 이력을 만든다.
 */
public record OrgCodeSaveReq(
        Long infoId,
        Long parentCodeId,
        String orgCd,
        String korNm,
        String engNm,
        String levelCd,
        String sortOrder,
        LocalDate modDate,
        String modReason,
        LocalDate openDate,
        String openReason,
        LocalDate closeDate,
        String closeReason,
        String note
) {
}
