package kr.co.kfs.asseterp.biz.adv.service;

import kr.co.kfs.asseterp.biz.adv.dto.AccountRes;
import kr.co.kfs.asseterp.biz.adv.dto.AccountSaveReq;
import kr.co.kfs.asseterp.biz.adv.dto.AccountSearchParam;
import kr.co.kfs.asseterp.biz.adv.mapper.AdvAccountMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/adv/Adv02_Account (Q01 일임계좌 등록) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdvAccountService {

    private final AdvAccountMapper mapper;

    /** AS-IS adv.Adv02_Account.selectByManageNamePaging(목록 + …PagingTotal 건수). LIKE '%검색어%'는 서버가 만든다(05 §6) */
    public PageRes<AccountRes> searchAccounts(UserPrincipal user, String searchText, int offset, int limit) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        AccountSearchParam param = new AccountSearchParam(user.getCompanyId(), like, Math.max(offset, 0), limit > 0 ? limit : 500);
        return new PageRes<>(mapper.selectByManageNamePagingTotal(param), mapper.selectByManageNamePaging(param));
    }

    /**
     * AS-IS adv.Adv02_Account.update L44: 같은 회사에 같은 관리코드의 다른 계좌가 있으면 "이미 사용중인 관리코드입니다".
     * 새 행은 accountId가 없어 원본의 `adv02_account_id != NULL` 검사가 0건이 된다(원본 그대로 — 작업기록 제안).
     * 회사는 로그인 회사, 저장된 행을 되돌린다.
     */
    @Transactional
    public AccountRes saveAccount(UserPrincipal user, AccountSaveReq req) {
        Long companyId = user.getCompanyId();
        boolean isNew = req.accountId() == null || req.accountId() <= 0;
        Long checkId = isNew ? null : req.accountId();
        if (mapper.checkManageCode(checkId, companyId, req.manageCode()) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 사용중인 관리코드입니다");
        }
        Long accountId = req.accountId();
        if (isNew) {
            accountId = mapper.selectNextId();
            mapper.insertAccount(accountId, companyId, req);
        } else {
            if (mapper.updateAccount(companyId, req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "일임계좌를 찾을 수 없습니다.");
            }
        }
        return mapper.selectById(accountId, companyId);
    }
}
