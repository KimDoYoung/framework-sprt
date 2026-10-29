package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.ExpenseFormRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/pay/mapper/pay51_expense_form.xml — 지출요청 상세양식 (U03 양식관리) */
@Mapper
public interface PayExpenseFormMapper {
    /** AS-IS selectByCompanyId */
    List<ExpenseFormRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS Pay51_ExpenseForm.formCheck 의 sys09_code.selectByExpenseForm — 아직 양식이 없는 코드 */
    List<String> selectNewFormCodes(@Param("companyId") Long companyId, @Param("kindCode") String kindCode);

    Long selectNextId();

    /** AS-IS insert */
    int insert(@Param("expenseFormId") Long expenseFormId, @Param("companyId") Long companyId, @Param("formCode") String formCode);

    /** AS-IS UpdateDataModel(pay51_expense_form) → 화면이 바꾸는 열은 content */
    int updateContent(@Param("companyId") Long companyId, @Param("expenseFormId") Long expenseFormId, @Param("content") String content);
}
