package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/**
 * 월별 법규조회 한 행 (AS-IS Ics01_ClassTreeModel 중 Ics01_Tab_PeriodList 그리드 열, H04).
 * rowNo = 그리드 행 키(AS-IS ics01_class_tree_id 자리의 ROW_NUMBER), realClassTreeId = 진짜 법규 id (상세·서식파일 창이 쓴다)
 */
public record IcsLawPeriodRes(Long rowNo, Long realClassTreeId, LocalDate closeDate, String level1Name, String level2Name,
                              String classTreeNameAddAppr, String submitTo, String cycleName, String relatedLaw,
                              String fileCount, String advisYn) {
}
