package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 마감 SQL 공통 파라미터 — AS-IS request.getParam()/Map 대응. 쓰지 않는 값은 null. */
public record CloseParam(Long companyId, LocalDate closeDate, LocalDate startDate, LocalDate stdDate, LocalDate holdDate,
                         Long astClassTreeId, Long keepAccountId) {

    /** 마감 대상 일자(closeDate = holdDate)와 회사만 */
    public static CloseParam of(Long companyId, LocalDate closeDate) {
        return new CloseParam(companyId, closeDate, null, null, closeDate, null, null);
    }

    public CloseParam withStart(LocalDate start) {
        return new CloseParam(companyId, closeDate, start, start, holdDate, astClassTreeId, keepAccountId);
    }
}
