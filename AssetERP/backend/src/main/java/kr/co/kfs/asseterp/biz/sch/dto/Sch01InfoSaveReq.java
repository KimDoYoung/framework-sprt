package kr.co.kfs.asseterp.biz.sch.dto;

/** 업무일정 저장 (AS-IS Sch01_Lookup_Info.update → Sch01_Info.update, 편집기가 바꾸는 열) */
public record Sch01InfoSaveReq(Long classId, String title, String content, Boolean dailyYn, Boolean privateYn, Boolean useYn) {
}
