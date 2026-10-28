package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayAccountRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayAccountSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayAccountMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/pay/Pay03_Account.java (selectByCompanyId L22 / selectByStartDate L28 / update L37 / delete L42) — 급여출금계좌 (S18) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayAccountService {

    private final PayAccountMapper mapper;

    /** pay03_account.selectByCompanyId */
    public List<PayAccountRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** pay03_account.selectByStartDate — 없으면 null (상신 전 "급여출금계좌를 먼저 지정해주세요" 검사) */
    public PayAccountRes current(UserPrincipal user, LocalDate startDate) {
        return mapper.selectByStartDate(user.getCompanyId(), startDate);
    }

    /** AS-IS update (UpdateDataModel) → 저장된 행(요청 순서). 다른 회사의 행은 고칠 수 없다(TOBE 추가) */
    @Transactional
    public List<PayAccountRes> save(UserPrincipal user, List<PayAccountSaveReq> rows) {
        Long companyId = user.getCompanyId();
        return rows.stream().map(req -> {
            if (req.accountId() != null && req.accountId() > 0) {
                if (mapper.update(companyId, req) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
                return mapper.selectById(companyId, req.accountId());
            }
            long id = mapper.selectNextId();
            mapper.insert(id, companyId, req);
            return mapper.selectById(companyId, id);
        }).toList();
    }

    /** AS-IS delete → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
