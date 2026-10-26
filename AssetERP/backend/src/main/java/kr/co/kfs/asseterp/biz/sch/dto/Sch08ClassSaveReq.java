package kr.co.kfs.asseterp.biz.sch.dto;

/** 스케줄분류 저장 (AS-IS Sch08_Class.update → UpdateDataModel): classId가 없거나 0 이하면 새 행 */
public record Sch08ClassSaveReq(Long classId, String className, Long seq, Boolean useYn, String note) {
}
