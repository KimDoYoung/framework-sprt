package kr.co.kfs.asseterp.biz.sys.dto;

/** 특정매뉴 저장 한 행 (specificMenuId가 null/0 이하면 신규) */
public record SpecificMenuSaveReq(Long specificMenuId, String specificWorkCd, Long menuId, String note) {
}
