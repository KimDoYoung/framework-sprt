package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.ExpenseRequestRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseRes;
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
}
