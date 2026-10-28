package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayBasicSetupRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayBasicSetupSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayBasicSetupMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 급여공제 기본설정 pay30_Popup_BasicSetup (S28) — AS-IS pay.Pay30_BasicSetup */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayBasicSetupService {

    private final PayBasicSetupMapper mapper;

    /** pay.Pay30_BasicSetup.selectByCompanyId — 설정이 없으면 null */
    public PayBasicSetupRes get(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** pay.Pay30_BasicSetup.modelUpdate — 회사의 행이 없으면 등록, 있으면 수정 (회사는 로그인 사용자) */
    @Transactional
    public PayBasicSetupRes save(UserPrincipal user, PayBasicSetupSaveReq req) {
        if (req.withHoldRate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "원천징수비율은 필수 선택사항입니다");
        }
        if (req.hiDivPayCode() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "건강보험은 필수 선택사항입니다");
        }
        if (req.eiDivPayCode() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "고용보험은 필수 선택사항입니다");
        }
        Long companyId = user.getCompanyId();
        if (mapper.selectByCompanyId(companyId) == null) {
            mapper.insertBasicSetup(mapper.selectNextId(), companyId, req);
        } else {
            mapper.updateBasicSetup(companyId, req);
        }
        return mapper.selectByCompanyId(companyId);
    }
}
