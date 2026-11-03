package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;
import java.util.List;

/** 선택내역 일괄반영 (AS-IS Icam55_IcamUser.updateResult — 처리자는 서버가 로그인 사원으로 채운다) */
public record IcamUserResultBatchReq(List<Long> ids, String procStateCode, LocalDate procDate, String procNote) {
}
