package kr.co.kfs.asseterp.biz.opr.dto;

import java.time.LocalDate;

/** 운용계획서 한 줄 (AS-IS Opr01_CreateModel — opr01_create.selectByLookupTitle, EE100). AS-IS 그리드의 부서·완료일 열은 이 SQL에 값이 없어 항상 빈칸 */
public record OprCreateRes(Long createId, String title, String year, String termName, String korName, String posName, LocalDate startDate) {
}
