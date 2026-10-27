package kr.co.kfs.asseterp.biz.chk.dto;

/** 일일점검내역 한 행 (AS-IS Chk02_DailyListModel). 사용여부는 'true'/'false' 문자열 */
public record ChkDailyListRes(
        Long dailyListId,
        Long companyId,
        Long classTreeId,
        String classTreeName,
        String content,
        String explan,
        /** AS-IS 그리드 "설명" 열이 보여 주는 속성(chk02_reason) — 테이블에 열이 없어 항상 null (원본 그대로) */
        String reason,
        String cutoff,
        String windowNo,
        Long seq,
        String useYn,
        Long adminDailyListId,
        /** AS-IS getAdminYn(): 회사 0이거나 관리자 점검내역에서 복사된 행 */
        Boolean adminYn,
        /** 담당그룹(R01) — sch22_write_group */
        Long writeGroupId,
        String writeGroupName
) {
}
