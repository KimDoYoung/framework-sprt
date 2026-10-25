package kr.co.kfs.asseterp.biz.tdm.dto;

/** 점검(승인) 이력 한 건 (AS-IS tdm55_chck_record.insert 의 인자 — 결과·의견은 N22 점검 처리에서만 채운다) */
public record CheckRecordParam(Long companyId, String stdDate, Long relateTableId, String relateTable,
                               String procType, Long personId, String procResult, String resultCmnt, String reportCmnt) {

    /** N20·N21: 결과·의견이 모두 null */
    public CheckRecordParam(Long companyId, String stdDate, Long relateTableId, String relateTable,
                            String procType, Long personId) {
        this(companyId, stdDate, relateTableId, relateTable, procType, personId, null, null, null);
    }
}
