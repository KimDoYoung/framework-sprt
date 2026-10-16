package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.AccountRes;
import kr.co.kfs.asseterp.biz.emp.dto.AccountSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpAccountMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/emp/Emp14_Account.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpAccountService {

    private final EmpAccountMapper empAccountMapper;

    /** AS-IS Emp14_Account.selectByPersonId */
    public List<AccountRes> getAccounts(UserPrincipal user, Long personId) {
        return empAccountMapper.selectAccounts(user.getCompanyId(), personId);
    }

    /**
     * AS-IS Emp14_Account.update → UpdateDataModel(emp14_account)
     * ID ≤ 0: INSERT (f_create_seq). ID > 0: UPDATE.
     * accountNoDec 있으면 TO_ENCRYPTS, 없으면 기존 값 유지.
     */
    @Transactional
    public List<AccountRes> updateAccounts(UserPrincipal user, List<AccountSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<Long> resultIds = new ArrayList<>();
        for (AccountSaveReq req : rows) {
            if (req.accountId() == null || req.accountId() <= 0) {
                Long newId = empAccountMapper.selectNextAccountId();
                empAccountMapper.insertAccount(newId, companyId, req.personId(), req);
                resultIds.add(newId);
            } else {
                int cnt = empAccountMapper.updateAccount(req.accountId(), companyId, req);
                if (cnt == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                resultIds.add(req.accountId());
            }
        }
        return resultIds.stream()
                .map(id -> empAccountMapper.selectAccountById(id, companyId))
                .toList();
    }

    /** AS-IS Emp14_Account.delete → UpdateDataModel(emp14_account).deleteModel */
    @Transactional
    public int deleteAccounts(UserPrincipal user, List<Long> accountIds) {
        if (accountIds == null || accountIds.isEmpty()) return 0;
        return empAccountMapper.deleteAccounts(accountIds, user.getCompanyId());
    }
}
