package kr.co.kfs.asseterp.biz.emp.dto;

/** 비고(시스템관리자전용) 저장 (AS-IS Emp02_Edit_Note.update → emp.Emp02_Others.modelUpdate) */
public record NoteAdminSaveReq(
        Long othersId,
        String noteAdmin
) {
}
