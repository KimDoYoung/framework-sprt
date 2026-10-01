package kr.co.kfs.asseterp.oms.biz.org.dto;

import java.time.LocalDate;

/**
 * 기준일 조직 트리 행 (AS-IS Org01_CodeModel + Org02_InfoModel, org01_code.selectByParentId_1Bang). 깊이 우선 순서
 *
 * @param infoId      기준일에 유효한 조직정보 이력(org02_info_id)
 * @param level       최상위 = 0 (AS-IS treelevel - 1)
 * @param orgHeadList 조직 장 (기준일 재직, 쉼표 구분)
 * @param note        주요업무/비고 (org02_note)
 */
public record OrgCodeRes(
        Long codeId,
        Long infoId,
        Long parentCodeId,
        int level,
        String orgCd,
        String korNm,
        String engNm,
        String levelCd,
        String levelNm,
        String orgHeadList,
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
