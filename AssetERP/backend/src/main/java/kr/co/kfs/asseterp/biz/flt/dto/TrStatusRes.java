package kr.co.kfs.asseterp.biz.flt.dto;

/** 임직원매매현황 메모 (AS-IS Flt15_TrStatusModel · flt15_tr_status, J07 Flt15_Lookup_Note) */
public record TrStatusRes(Long trStatusId, Long personId, String date, String note) {
}
