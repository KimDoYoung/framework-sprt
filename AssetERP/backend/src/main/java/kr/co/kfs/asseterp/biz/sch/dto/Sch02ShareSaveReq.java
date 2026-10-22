package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** 공유 저장 (AS-IS Sch02_Share.update → UpdateDataModel): 새 행(id 0 이하)은 구분·직원·부서까지 넣고, 있는 행은 적용기간만 고친다 */
public record Sch02ShareSaveReq(Long shareId, String shareCode, Long personId, Long orgId, LocalDate startDate, LocalDate closeDate) {
}
