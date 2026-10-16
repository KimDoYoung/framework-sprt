package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 관리자 화면 저장 열 (AS-IS adminUpdate): 담당자·완료예정·완료여부·처리방안(HTML)·비고 */
public record AfterServiceAdminSaveReq(Long afterServiceId, String worker, LocalDate dueDate, String stateCd, String happenRemedy, String remarks) {
}
