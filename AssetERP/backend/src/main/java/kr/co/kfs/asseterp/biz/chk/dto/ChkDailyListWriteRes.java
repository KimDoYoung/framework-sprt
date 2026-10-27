package kr.co.kfs.asseterp.biz.chk.dto;

/** 일일점검내역 작성 화면의 한 행 (AS-IS Chk02_DailyListModel + chk03_daily_list_write 열). 답변 코드 Y(예)·N(아니오)·X(해당없음) */
public record ChkDailyListWriteRes(
        Long dailyListId,
        Long classTreeId,
        String classTreeName,
        String content,
        /** 상세보기 창(Chk02_Edit_DailyList.open)이 보여 주는 설명·조회순서·사용여부 */
        String explan,
        String cutoff,
        String windowNo,
        Long seq,
        String useYn,
        Long dailyListWriteId,
        String answerCode,
        String reason,
        String note,
        Boolean confirmYn
) {
}
