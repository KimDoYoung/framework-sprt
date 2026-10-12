package kr.co.kfs.asseterp.biz.emp.dto;

/** 비고(시스템관리자전용) 팝업 (AS-IS Emp02_Edit_Note — Emp02_OthersModel 중 noteAdmin) */
public record NoteAdminRes(
        Long othersId,
        Long personId,
        String noteAdmin
) {
}
