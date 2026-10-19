package kr.co.kfs.asseterp.biz.sys.dto;

/** 화면 찾기 (Sys06_MenuModel) — bookmark는 이 사용자의 북마크 ID(없으면 null), 관리자용 조회는 parentPathNm·bookmark가 null */
public record MenuSearchRes(Long menuId, Long bookmark, String parentPathNm, String menuNm, String menuNo, String note, String className, String menuFullNm) {
}
