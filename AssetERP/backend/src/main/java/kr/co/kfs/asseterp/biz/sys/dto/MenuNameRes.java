package kr.co.kfs.asseterp.biz.sys.dto;

/** 1차 메뉴 콤보 한 항목 (AS-IS sys.Sys00_Common.selectMenuName: code = 메뉴 ID, name = 메뉴명) */
public record MenuNameRes(String code, String name) {
}
