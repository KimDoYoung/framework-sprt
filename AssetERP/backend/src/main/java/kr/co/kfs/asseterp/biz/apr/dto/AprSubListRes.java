package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** Apr01_Tab_SubList 그리드 한 행 (G17 건별명세). effectDate는 시행일(일자), docTypeName은 일반/내부통제 */
public record AprSubListRes(Long apprId, LocalDateTime effectDate, String docTypeName, String classTreeNameAllPath, String title,
                            String aprOrgName, String aprPersonName, String statusName) {
}
