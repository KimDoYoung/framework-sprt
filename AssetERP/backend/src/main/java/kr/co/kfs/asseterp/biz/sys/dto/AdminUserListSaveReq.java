package kr.co.kfs.asseterp.biz.sys.dto;

/** 관리자 유저 저장 행 — 화면이 바꾸는 컬럼(휴대폰·성명·비고)만. 새 행은 ID가 0 이하 */
public record AdminUserListSaveReq(Long adminUserListId, String userPhone, String userName, String note) {
}
