package kr.co.kfs.asseterp.biz.chk.dto;

/** Chk02_Edit_DailyList 저장 본문 — 회사는 서버가 채운다 */
public record ChkDailyListSaveReq(
        Long classTreeId,
        String content,
        String explan,
        String cutoff,
        String windowNo,
        Long seq,
        String useYn
) {
}
