package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;
import java.util.List;

/** [일괄저장] — 고른 행의 자금집행일·출금계좌를 한꺼번에 (AS-IS updateDeposit) */
public record ExpenseDepositReq(List<Long> ids, LocalDate settleDate, Long depositId) {
}
