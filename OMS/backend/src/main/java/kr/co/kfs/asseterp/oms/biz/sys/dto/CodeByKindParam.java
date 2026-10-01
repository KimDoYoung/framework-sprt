package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.time.LocalDate;

/** 콤보 코드 조회 조건 (AS-IS ComboBoxField → sys09_code.selectByCodeKind) */
public record CodeByKindParam(Long companyId, String kindCd, LocalDate applyDate) {
}
