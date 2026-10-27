package kr.co.kfs.asseterp.biz.chk.dto;

/** 일일점검내역 확인 화면(R03)의 한 행 — 담당자별 점검내역. reason은 "답변 (사유)" 문장, keyId는 목록 안의 행번호 */
public record ChkDailyListConfirmRes(Long keyId, Long companyId, Long dailyListId, Long classTreeId, String classTreeName,
                                     String content, String explan, String cutoff, String windowNo, Long seq, String useYn,
                                     Long dailyListWriteId, String answerCode, String reason, Long orgId, String orgName,
                                     Long personId, String personName, Long confirmerId, String confirmerName, Boolean confirmYn) {
}
