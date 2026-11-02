package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS Ast33_FundTransModel — 이관펀드 한 건(목록 행·저장 응답). journalId는 이관(출)의 분개 */
public record FundTransRes(Long fundTransId, Long companyId, String fundTransCode, LocalDate date, Long corpId, String fundCode,
                           Long fee, Double forFee, String curCode, String note, Long trId,
                           String fundTransName, String corpCode, String corpName, String fundName, Long journalId) {
}
