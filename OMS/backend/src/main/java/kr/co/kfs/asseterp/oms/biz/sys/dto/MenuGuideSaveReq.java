package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 화면안내 저장 (AS-IS Sys06_Menu.update → UpdateDataModel(sys06_menu) 중 화면안내만) */
public record MenuGuideSaveReq(Long menuId, String note) {
}
