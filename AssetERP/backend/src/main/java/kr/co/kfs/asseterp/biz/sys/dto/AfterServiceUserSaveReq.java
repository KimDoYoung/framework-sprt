package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 사용자 화면 저장 열 (AS-IS userUpdate): 요청자·구분·발생일·본문(HTML)·확인여부. 회사는 로그인한 회사로 넣는다 */
public record AfterServiceUserSaveReq(Long afterServiceId, String regEmpNm, String typeYn, LocalDate happenDate, String happenReason, String confirmYn) {
}
