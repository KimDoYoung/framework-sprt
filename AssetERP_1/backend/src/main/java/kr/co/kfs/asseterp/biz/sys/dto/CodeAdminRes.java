package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 코드 관리 한 행 (AS-IS Sys09_CodeModel). lastDate = 같은 코드의 다음 시작일 전날(그리드에는 없음) */
public record CodeAdminRes(Long codeId, Long codeKindId, Long companyId, String code, String name, String seq,
                           String closeYn, LocalDate applyDate, LocalDate closeDate, String note, LocalDate lastDate) {
}
