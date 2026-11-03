package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpFeeRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpFeeSaveReq;
import kr.co.kfs.asseterp.biz.biz.mapper.BizErpFeeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** AssetERP 계약사별 사용료 Biz52_Lookup_ErpFee (EE22) — AS-IS server/biz/Biz52_ErpFee. 코드값 이름(월청구일·VAT 등)만 로그인 회사를 쓴다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizErpFeeService {

    private final BizErpFeeMapper mapper;

    /** biz.Biz52_ErpFee.selectByErpContCorpId (L23) — 적용시작일 내림차순 */
    public List<BizErpFeeRes> search(UserPrincipal user, Long erpContCorpId) {
        return mapper.selectByErpContCorpId(user.getCompanyId(), erpContCorpId);
    }

    /** biz.Biz52_ErpFee.selectByStartDate (L32) — 기준일 이전에 시작한 가장 최근 사용료, 없으면 null */
    public BizErpFeeRes current(UserPrincipal user, Long erpContCorpId, LocalDate stdDate) {
        return mapper.selectByStartDate(user.getCompanyId(), erpContCorpId, stdDate);
    }

    /** biz.Biz52_ErpFee.update (L53) — UpdateDataModel: 번호가 이미 있으면 UPDATE, 없거나 0 이하면 새 번호로 INSERT. 저장한 행을 요청 순서대로 다시 읽어 돌려준다 */
    @Transactional
    public List<BizErpFeeRes> save(List<BizErpFeeSaveReq> rows) {
        List<BizErpFeeRes> saved = new ArrayList<>();
        for (BizErpFeeSaveReq req : rows) {
            if (req.erpContCorpId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "AssetERP 계약사 정보가 없습니다.");
            }
            long id = req.erpFeeId() == null || req.erpFeeId() <= 0 ? mapper.selectNextId() : req.erpFeeId();
            BizErpFeeSaveReq r = new BizErpFeeSaveReq(id, req.erpContCorpId(), req.startDate(), req.closeDate(), req.erpFee(), req.dataFee(), req.chargeDay(),
                    req.vatCd(), req.depositDueDay(), req.addFeeSmsYn(), req.addFeeServerYn(), req.addFeeUserYn(), req.smsBaseCount(), req.smsAddPrice(),
                    req.serverBaseUsage(), req.serverAddUnit(), req.serverAddPrice(), req.userBaseCount(), req.userAddPrice(), req.userCountStdCd(),
                    req.chargeCalcMonthType());
            if (mapper.countById(id) > 0) {
                mapper.updateErpFee(r);
            } else {
                mapper.insertErpFee(r);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** biz.Biz52_ErpFee.delete (L58) → 지운 건수 */
    @Transactional
    public int delete(List<Long> erpFeeIds) {
        int n = 0;
        for (Long id : erpFeeIds) {
            n += mapper.deleteById(id);
        }
        return n;
    }
}
