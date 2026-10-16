package kr.co.kfs.asseterp.biz.sys.dto;

/** 관리자 유저 한 행 (AS-IS Sys80_AdminUserListModel). 임시 비밀번호는 화면에 없어 내리지 않는다 */
public record AdminUserListRes(Long adminUserListId, String userPhone, String userName, String note) {
}
