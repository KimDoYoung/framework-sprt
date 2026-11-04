package kr.co.kfs.asseterp.biz.ics.dto;

/** 기본 확인자 (AS-IS ics.Ics30_Compliance.selectConfirmer → ics31_confirmer_id · ics30_confirmer_nm). 정할 수 없으면 둘 다 null */
public record IcsComplianceConfirmerRes(Long confirmerId, String confirmerName) {
}
