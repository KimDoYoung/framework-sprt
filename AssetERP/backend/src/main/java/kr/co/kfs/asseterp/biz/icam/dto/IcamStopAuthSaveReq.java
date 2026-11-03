package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** 미사용ID 기록관리 [변경] 창 저장 (AS-IS Icam55_Edit_UserStopAuth.update → icam.Icam55_IcamUser.updateEachAuth) */
public record IcamStopAuthSaveReq(LocalDate delDate, LocalDate unstopDate, String note) {
}
