package kr.co.kfs.asseterp.biz.tdm.dto;

/**
 * 점검상세 창 [점검완료]·[완료취소] (AS-IS tdm.Tdm52_ChckManl.updateComplete) — actionType P(점검완료)·C(완료취소).
 * checkResultName은 점검결과 콤보에 보이는 이름(이력의 처리결과에 그대로 남긴다). C는 점검 값을 서버가 읽은 것으로 쓴다
 */
public record CheckCompleteReq(String actionType, String checkDate, String checkResultCode, String checkResultName, String checkCmnt) {
}
