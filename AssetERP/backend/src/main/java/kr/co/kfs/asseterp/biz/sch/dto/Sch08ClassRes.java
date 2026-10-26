package kr.co.kfs.asseterp.biz.sch.dto;

/** 스케줄분류 (AS-IS Sch08_ClassModel — sch08_class.selectByPersonId) */
public record Sch08ClassRes(Long classId, Long personId, String className, Long seq, Boolean useYn, String note) {
}
