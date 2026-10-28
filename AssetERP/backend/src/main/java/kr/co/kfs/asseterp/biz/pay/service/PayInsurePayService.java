package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsurePayRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsurePaySaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayInsurePayMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/pay/Pay32_InsurePay.java (selectByPersonId L41 / update L58 / delete L63) — 4대보험 연말정산 납부 (S16) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayInsurePayService {

    private final PayInsurePayMapper mapper;

    /** pay32_insure_pay.selectByPersonId — year·insureCode가 비면 전체("%") */
    public List<PayInsurePayRes> search(UserPrincipal user, Long personId, String insureCode, String year) {
        return mapper.selectByPersonId(user.getCompanyId(), personId, blankToAll(insureCode), blankToAll(year));
    }

    /** AS-IS update (UpdateDataModel) → 저장된 행(요청 순서) */
    @Transactional
    public List<PayInsurePayRes> save(UserPrincipal user, List<PayInsurePaySaveReq> rows) {
        Long companyId = user.getCompanyId();
        for (PayInsurePaySaveReq req : rows) {
            if (req.personId() == null || mapper.countPerson(companyId, req.personId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return rows.stream().map(req -> {
            if (req.insurePayId() != null && mapper.selectById(companyId, req.insurePayId()) != null) {
                mapper.update(companyId, req);
                return mapper.selectById(companyId, req.insurePayId());
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

    private static String blankToAll(String v) {
        return v == null || v.isBlank() ? "%" : v;
    }
}
