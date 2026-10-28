package kr.co.kfs.asseterp.biz.emp.dto;

/** [생성] — 연차 탭은 기준년도·구분(unLeaveCode), 월차 탭은 기준년도만 (AS-IS Emp21_UnLeave.insert·insert2) */
public record UnLeaveCreateReq(String stdYear, String unLeaveCode) {
}
