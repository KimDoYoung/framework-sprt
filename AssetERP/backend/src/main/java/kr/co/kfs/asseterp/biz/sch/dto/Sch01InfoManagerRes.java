package kr.co.kfs.asseterp.biz.sch.dto;

/** 담당자 변경 창의 일정 (AS-IS Sch01_InfoModel — sch01_info.selectByManagerId·selectByIdList 열만) */
public record Sch01InfoManagerRes(Long infoId, Long companyId, String title, String content, String report, Long managerId, String note, Boolean useYn,
                                  Long dcrClassTreeId, Boolean privateYn, Boolean dailyYn, Long classId, String className) {
}
