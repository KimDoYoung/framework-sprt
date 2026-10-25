package kr.co.kfs.asseterp.biz.tdm.dto;

/** 조치대상조회(변화관리) 한 행 (AS-IS tdm02_hr_record.selectChangeList → Tdm02_HrRecordModel changeData·note) */
public record ChangeListRes(String changeData, String note) {
}
