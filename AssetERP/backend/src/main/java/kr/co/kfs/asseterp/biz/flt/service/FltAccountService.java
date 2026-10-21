package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.AccountAdminRes;
import kr.co.kfs.asseterp.biz.flt.dto.AccountCloseReq;
import kr.co.kfs.asseterp.biz.flt.dto.AccountCloseRes;
import kr.co.kfs.asseterp.biz.flt.dto.AccountRes;
import kr.co.kfs.asseterp.biz.flt.dto.AccountSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.AccountStatusRes;
import kr.co.kfs.asseterp.biz.flt.dto.DocClassRes;
import kr.co.kfs.asseterp.biz.flt.mapper.FltAccountMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS server/flt/Flt03_Account.java (selectByPersonId L27 / getItemTypeName L66 / update L96 / delete L110),
 * Flt06_AccountClose.java (selectByPersonId L27 / insert L36 / delete L90), Flt02_Emp.selectByDate, Flt04_Oath.selectByDate,
 * Dcr30_Link.selectByLinkCode — 로그인 사용자(회사·사원) 본인의 임직원 계좌만 다룬다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltAccountService {

    private final FltAccountMapper mapper;

    /** AS-IS Flt03_Account.selectByPersonId(companyId, personId) — 폐쇄된 계좌는 뺀다 */
    public List<AccountRes> search(UserPrincipal user) {
        return mapper.selectByPersonId(user.getCompanyId(), user.getUserId());
    }

    /** AS-IS Flt03_Account.selectByDate L50(companyId, personId=null, setupDate, closeAccountYn) — 계좌신고현황(J01), 회사 전체 */
    public List<AccountAdminRes> searchByDate(UserPrincipal user, String setupDate, boolean closeAccountYn) {
        return mapper.selectByDate(user.getCompanyId(), setupDate, closeAccountYn);
    }

    /** AS-IS update(UpdateDataModel): 계좌번호를 암호화해 저장, ID가 0 이하면 INSERT 아니면 UPDATE → selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<AccountRes> update(UserPrincipal user, List<AccountSaveReq> rows) {
        List<AccountRes> saved = new ArrayList<>();
        for (AccountSaveReq req : rows) {
            String accountNo = req.accountNoDec() == null ? null : mapper.selectEncrypted(req.accountNoDec());
            boolean isNew = req.accountId() == null || req.accountId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.accountId();
            if (isNew) {
                mapper.insertAccount(id, user.getCompanyId(), user.getUserId(), accountNo, req);
            } else if (mapper.updateAccount(user.getCompanyId(), user.getUserId(), accountNo, req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete: 삭제 전 거래내역 체크 → 있으면 실패, 없으면 계좌 행마다 DELETE → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        for (Long id : ids) {
            if (mapper.countTrByAccountId(id) > 0) {
                AccountRes account = mapper.selectById(id);
                String no = account == null ? "" : account.accountNoDec();
                throw new BusinessException(ErrorCode.INVALID_INPUT, "거래내역이 존재합니다. 해당 계좌를 삭제할 수 없습니다. (" + no + ")");
            }
        }
        return mapper.deleteAccounts(user.getCompanyId(), user.getUserId(), ids);
    }

    /** AS-IS Flt03_Account.getItemTypeName */
    public String itemTypeName(UserPrincipal user, String itemType) {
        return mapper.selectItemTypeName(user.getCompanyId(), itemType);
    }

    /** AS-IS Flt02_Emp.selectByDate(보고주기) + Flt04_Oath.selectByDate(서약서) — 없으면 빈 값 */
    public AccountStatusRes status(UserPrincipal user) {
        String cycle = mapper.selectCheckCycle(user.getCompanyId(), user.getUserId());
        AccountStatusRes oath = mapper.selectOath(user.getCompanyId(), user.getUserId());
        return new AccountStatusRes(cycle, oath == null ? null : oath.oathStatusCode(), oath == null ? null : oath.oathStatusName());
    }

    /** AS-IS Dcr30_Link.selectByLinkCode(B05·B06) — 없으면 null */
    public DocClassRes docClass(UserPrincipal user, String linkCode) {
        return mapper.selectDocClassByLinkCode(user.getCompanyId(), linkCode);
    }

    /** AS-IS Flt06_AccountClose.selectByPersonId */
    public List<AccountCloseRes> searchCloses(UserPrincipal user) {
        return mapper.selectCloseByPersonId(user.getCompanyId(), user.getUserId());
    }

    /** AS-IS Flt06_AccountClose.insert: 계좌마다 폐쇄일 잔고(수량 0 아님)가 있으면 실패, 없으면 INSERT */
    @Transactional
    public int createCloses(UserPrincipal user, AccountCloseReq req) {
        if (req.accountIds() == null || req.accountIds().isEmpty() || req.closeDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "폐쇄일을 입력하세요");
        }
        for (Long accountId : req.accountIds()) {
            AccountRes account = mapper.selectById(accountId);
            if (account == null || !user.getCompanyId().equals(account.companyId()) || !user.getUserId().equals(account.personId())) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }
            if (mapper.countBookQty(accountId, req.closeDate()) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "보유중인 금융상품이 존재합니다. (" + account.accountNoDec() + ")");
            }
            mapper.insertAccountClose(accountId, req.closeDate());
        }
        return req.accountIds().size();
    }

    /** AS-IS Flt06_AccountClose.delete(폐쇄취소) → 지운 건수 */
    @Transactional
    public int deleteCloses(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteAccountCloses(user.getCompanyId(), user.getUserId(), ids);
    }
}
