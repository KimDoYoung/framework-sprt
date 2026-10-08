package kr.co.kfs.asseterp.biz.org.dto;

import java.time.LocalDateTime;

/**
 * 조직 트리 행 (AS-IS Org01_CodeModel + @Path orgInfoModel.*).
 * 조회(selectByParentId_1Bang)는 전위 순서이고 depth(treelevel)로 트리를 만든다. 저장 응답(selectByBaseDate)은 depth·orgHeadList가 없다.
 */
public record OrgCodeRes(
        Long codeId,
        Long parentCodeId,
        Long infoId,
        String orgCd,
        String korNm,
        String levelCd,
        String levelNm,
        String orgHeadList,
        String sortOrder,
        LocalDateTime modDate,
        String modReason,
        LocalDateTime openDate,
        String openReason,
        LocalDateTime closeDate,
        String closeReason,
        String engNm,
        String note,
        String dcrIdWord,
        Integer depth
) {
}
