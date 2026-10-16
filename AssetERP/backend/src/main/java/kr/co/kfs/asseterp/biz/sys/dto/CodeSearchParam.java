package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** AS-IS selectByCodeKind 파라미터. applyDate(기준일)가 null이면 오늘 — AS-IS ComboBoxField.retrieve()도 null이면 서버가 오늘 */
public record CodeSearchParam(Long companyId, String kindCode, LocalDate applyDate) {
    public CodeSearchParam(Long companyId, String kindCode) {
        this(companyId, kindCode, null);
    }
}
