package kr.co.kfs.asseterp.biz.emp.dto;

/** 연관파일 저장 행 (AS-IS UpdateDataModel(emp18_relate_file) — emp18_note, emp18_person_id) */
public record RelateFileSaveReq(Long relateFileId, Long personId, String note) {
}
