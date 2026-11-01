package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/**
 * Y04 반복등록 (AS-IS Emp54_Errand.modelUpdate — Emp54_Edit_Errand.update)
 * cycleName: none/D/W/M/Y, cycleOption: 주(W) 2~6(월~금)·월(M) 1~3, 그 밖 9999
 */
public record ErrandCycleReq(String errandCode, LocalDate date, String departTime, String returnTime, String reason, String venue,
                             String host, String cycleName, Long cycleNum, LocalDate cycleDate, Boolean holidayYn, Integer cycleOption) {
}
