package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseFormRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PayExpenseFormMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/pay/Pay51_ExpenseForm.java (selectByCompanyId L27·formCheck L35·modelUpdate L72) — 지출요청 상세양식 (U03 양식관리) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayExpenseFormService {

    private static final String KIND_CODE = "ExpenseDetailType";

    private final PayExpenseFormMapper mapper;

    /** pay51_expense_form.selectByCompanyId */
    public List<ExpenseFormRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS formCheck — 코드(ExpenseDetailType)에 새로 생겼는데 양식이 없는 것을 빈 양식으로 만든다. 열 때마다 부른다 */
    @Transactional
    public int check(UserPrincipal user) {
        List<String> codes = mapper.selectNewFormCodes(user.getCompanyId(), KIND_CODE);
        for (String code : codes) {
            mapper.insert(mapper.selectNextId(), user.getCompanyId(), code);
        }
        return codes.size();
    }

    /** AS-IS modelUpdate (UpdateDataModel) — 화면이 바꾸는 열은 내용 */
    @Transactional
    public void updateContent(UserPrincipal user, Long expenseFormId, String content) {
        if (mapper.updateContent(user.getCompanyId(), expenseFormId, content) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}
