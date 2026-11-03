package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** 처리결과 그리드 저장 한 줄 (AS-IS Icam55_IcamUser.update UpdateDataModel — 화면이 바꾸는 네 열) */
public record IcamUserResultSaveReq(Long icamUserId, String procStateCode, LocalDate procDate, String procNote, Long procEmpId) {
}
