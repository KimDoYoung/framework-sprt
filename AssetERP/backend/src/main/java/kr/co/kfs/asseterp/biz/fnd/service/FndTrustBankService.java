package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankSaveReq;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndTrustBankMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/fnd/Fnd09_TrustBank.java (selectByCompanyId0 L39 / selectIcamTrustBank L93).
 * 수탁은행정보 관리(관리자)는 공통 회사(0) 전용 화면이라 저장·가져오기는 관리자 회사만 한다(보안 보강, D11과 같음)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndTrustBankService {

    private final FndTrustBankMapper mapper;
    private final FndIcamImporter icamImporter;

    /** AS-IS selectByCompanyId0: 로그인 회사가 0일 때만 행이 나온다(SQL이 company = 0 AND company = 로그인 회사) */
    public List<TrustBankRes> search(UserPrincipal user, String searchText, boolean useYn) {
        return mapper.selectByCompanyId0(user.getCompanyId(), String.valueOf(useYn), searchText == null ? "" : searchText);
    }

    /**
     * AS-IS 화면의 저장은 fnd.Fnd09_TrustBank.insertCheck를 부르는데 원본 서버(Fnd09_TrustBank.java)에 그 메서드가 없다 → 원본에서도 저장이 실패한다.
     * 03 원칙 4·5에 따라 그대로 거절하고, 동작하게 고칠지는 사용자 결정(작업기록 제안)
     */
    @Transactional
    public List<TrustBankRes> save(UserPrincipal user, List<TrustBankSaveReq> rows) {
        requireSysAdmin(user);
        throw new BusinessException(ErrorCode.INVALID_INPUT, "수탁은행 저장 서비스(insertCheck)가 원본 서버에 없어 저장되지 않습니다");
    }

    /** AS-IS selectIcamTrustBank: 공통 회사(0)이면 모든 회사("%") */
    public void importIcam(UserPrincipal user) {
        requireSysAdmin(user);
        icamImporter.importTrustBanks(user.getCompanyId() == 0 ? "%" : String.valueOf(user.getCompanyId()));
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
