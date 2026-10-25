package kr.co.kfs.asseterp.biz.tdm.dto;

/** 점검(승인) 이력 한 건 (AS-IS tdm55_chck_record.insert 의 인자 — 결과·의견은 N21에서 모두 null) */
public record CheckRecordParam(Long companyId, String stdDate, Long relateTableId, String relateTable,
                               String procType, Long personId) {
}
