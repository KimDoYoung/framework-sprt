package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.ExpenseNewRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseRequestRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettleApprRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettleApprRowRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettleInitRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettleRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettleSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseUpdateReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/pay/mapper/pay50_expense.xml — 지출결의서(경영관리) U03 */
@Mapper
public interface PayExpenseMapper {
    /** AS-IS selectExpenseAppr */
    List<ExpenseRes> selectExpenseAppr(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                       @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                       @Param("statusCheckYn") boolean statusCheckYn, @Param("expenseCode") String expenseCode,
                                       @Param("payMethodCode") String payMethodCode, @Param("searchText") String searchText,
                                       @Param("managerYn") boolean managerYn, @Param("limit") Integer limit);

    /** AS-IS selectExpenseRequest */
    List<ExpenseRequestRes> selectExpenseRequest(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    /** AS-IS selectById */
    ExpenseRes selectById(@Param("companyId") Long companyId, @Param("expenseId") Long expenseId);

    /** AS-IS apr01_appr.selectByApprId3 에서 상태 코드만 */
    String selectApprStatusCode(@Param("apprId") Long apprId);

    Long selectNextId();

    /** AS-IS UpdateDataModel(pay50_expense) → updateModel 중 화면이 바꾸는 열 */
    int update(@Param("companyId") Long companyId, @Param("expenseId") Long expenseId, @Param("req") ExpenseUpdateReq req);

    /** AS-IS updateRejectReason */
    int updateRejectReason(@Param("companyId") Long companyId, @Param("expenseId") Long expenseId, @Param("rejectReason") String rejectReason);

    /** AS-IS updateApprEmpId */
    int updateApprEmpId(@Param("companyId") Long companyId, @Param("expenseId") Long expenseId, @Param("apprEmpId") Long apprEmpId);

    /** AS-IS insertRequest (화환신청 → 사업비요청내역) */
    int insertRequest(@Param("expenseId") Long expenseId, @Param("companyId") Long companyId, @Param("row") ExpenseRequestRes row,
                      @Param("apprEmpId") Long apprEmpId);

    /** AS-IS updateContent */
    int updateContent(@Param("companyId") Long companyId, @Param("expenseId") Long expenseId, @Param("content") String content);

    /** AS-IS initExpense */
    int initExpense(@Param("companyId") Long companyId, @Param("expenseId") Long expenseId);

    /** AS-IS deleteById */
    int deleteById(@Param("companyId") Long companyId, @Param("expenseId") Long expenseId);

    // ── U07 자금집행결의서 작성(Pay50_Tab_ExpensePayWrite) · U08 조회(Pay50_Tab_ExpensePay) ──

    /** AS-IS selectExpensePay */
    List<ExpenseSettleRes> selectExpensePay(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                            @Param("closeDate") LocalDate closeDate, @Param("expenseCode") String expenseCode,
                                            @Param("payYnCode") String payYnCode, @Param("statusCheckYn") boolean statusCheckYn,
                                            @Param("searchText") String searchText);

    /** AS-IS selectNewExpenseAppr (targetType = SETTLE) */
    List<ExpenseNewRes> selectNewExpenseAppr(@Param("companyId") Long companyId, @Param("targetType") String targetType,
                                             @Param("expenseCode") String expenseCode, @Param("searchText") String searchText);

    /** AS-IS selectBySettleDate */
    List<ExpenseSettleApprRes> selectBySettleDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                                  @Param("closeDate") LocalDate closeDate, @Param("statusCheckYn") boolean statusCheckYn,
                                                  @Param("searchText") String searchText);

    /** AS-IS selectBySettleApprId */
    List<ExpenseSettleApprRowRes> selectBySettleApprId(@Param("companyId") Long companyId, @Param("settleApprId") Long settleApprId);

    /** initExpenseSettle가 읽는 값(구분·전표·집행결의서 상신) */
    ExpenseSettleInitRes selectSettleInitInfo(@Param("companyId") Long companyId, @Param("expenseId") Long expenseId);

    /** AS-IS ast07_settle.countByExpenseId */
    int countSettleByExpenseId(@Param("expenseId") Long expenseId);

    /** AS-IS UpdateDataModel(pay50_expense) → 이 화면이 바꾸는 열 5개 */
    int updateSettle(@Param("companyId") Long companyId, @Param("req") ExpenseSettleSaveReq req);

    /** AS-IS updateSettleEmpId */
    int updateSettleEmpId(@Param("companyId") Long companyId, @Param("expenseId") Long expenseId, @Param("settleEmpId") Long settleEmpId);

    /** AS-IS insertExpense */
    int insertExpense(@Param("expenseId") Long expenseId, @Param("companyId") Long companyId, @Param("row") ExpenseNewRes row,
                      @Param("settleEmpId") Long settleEmpId);

    /** AS-IS ast06_tr.updateExpenseId */
    int updateTrExpenseId(@Param("companyId") Long companyId, @Param("trId") Long trId, @Param("expenseId") Long expenseId);

    /** AS-IS updateDepositId */
    int updateDepositId(@Param("companyId") Long companyId, @Param("expenseId") Long expenseId, @Param("settleDate") LocalDate settleDate,
                        @Param("depositId") Long depositId);

    /** AS-IS initExpenseSettle */
    int initExpenseSettle(@Param("companyId") Long companyId, @Param("expenseId") Long expenseId);

    /** AS-IS sys99_print.deleteByPersonId */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** AS-IS sys99_print.insert (insertRdExpensePay가 채우는 열) */
    int insertSettlePrint(@Param("printId") Long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                          @Param("windowClassName") String windowClassName, @Param("groupId") Long groupId,
                          @Param("row") ExpenseSettleRes row, @Param("mark") String mark);
}
