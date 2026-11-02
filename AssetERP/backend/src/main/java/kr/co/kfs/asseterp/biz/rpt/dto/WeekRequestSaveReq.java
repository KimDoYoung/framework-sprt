package kr.co.kfs.asseterp.biz.rpt.dto;

import java.util.List;

/** 건의사항 및 기타 요청사항(업무구분 999) 저장 (AS-IS Rpt03_Page_WeekWrite.update → Rpt03_Week.update). weekId가 0 이하면 새 행 */
public record WeekRequestSaveReq(List<WeekSaveReq> items) {
}
