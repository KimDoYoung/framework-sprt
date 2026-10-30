package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** ast06_tr.selectByAccrued 한 행 (미수/미지급 결제 위 그리드, U11) — trId는 trCode 9100이면 지출결의서 ID */
public record SettleAccruedRes(Long trId, Long companyId, LocalDate date, String trCode, Long amt, Long corpId, String corpName,
                               String rcvPayCode, Double accruedAmt, String note) {
}
