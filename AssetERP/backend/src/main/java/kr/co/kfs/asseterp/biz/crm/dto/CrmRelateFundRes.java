package kr.co.kfs.asseterp.biz.crm.dto;

/** 업무활동내역 연결펀드 한 줄 (AS-IS Crm13_RelateFundModel — crm13.selectByWorkDetailId) */
public record CrmRelateFundRes(Long relateFundId, Long workDetailId, Long fundId, String fundCode, String fundName) {
}
