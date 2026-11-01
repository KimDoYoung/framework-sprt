package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** Y04 그리드 저장 한 줄 (AS-IS Emp54_Errand.update UpdateDataModel — errandId 0 이하는 새 행) */
public record ErrandSaveReq(Long errandId, String errandCode, LocalDate date, String departTime, String returnTime, String reason,
                            String venue, String host, String note, Boolean publicYn) {
}
