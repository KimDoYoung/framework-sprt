package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** 권한정지 신청서 엑셀 한 행 (AS-IS ExcelUpload.icamUserStopUpload) */
public record IcamStopExcelRow(LocalDate regDate, String companyName, String userId, String userName, String email, Long regEmpId) {
}
