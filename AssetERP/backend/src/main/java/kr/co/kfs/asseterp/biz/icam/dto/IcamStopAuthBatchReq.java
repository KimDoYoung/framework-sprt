package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;
import java.util.List;

/** 미사용ID 기록관리 선택내역 일괄반영 (AS-IS Icam55_Lookup_UserStopAuth.update → icam.Icam55_IcamUser.updateMultiAuth) */
public record IcamStopAuthBatchReq(List<Long> ids, LocalDate delDate, LocalDate unstopDate, String note) {
}
