package kr.co.kfs.asseterp.biz.pay.dto;

/** pay.Pay50_Expense.selectExpenseAccountSum — 사업비발생현황 한 줄(계정과목별 1~12월·계). expenseId는 행 구분용 순번 */
public record ExpenseAccountSumRes(
        Long expenseId,
        String accountName,
        Long month01Amt,
        Long month02Amt,
        Long month03Amt,
        Long month04Amt,
        Long month05Amt,
        Long month06Amt,
        Long month07Amt,
        Long month08Amt,
        Long month09Amt,
        Long month10Amt,
        Long month11Amt,
        Long month12Amt,
        Long yearAmt
) {
}
