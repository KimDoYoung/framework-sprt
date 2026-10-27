package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankCompanyRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankCompanySaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TrustBankSaveReq;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndTrustBankMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

/**
 * AS-IS server/fnd/Fnd09_TrustBank.java (selectByCompanyId L34 / selectByCompanyId0 L39 / preUpdate L53 / selectIcamTrustBank L93 / update L147 / delete L152).
 * 수탁은행정보 관리(관리자, D13)는 공통 회사(0) 전용이고, 수탁은행정보 관리(R12, #1100)는 로그인 회사별 CRUD 화면이다.
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

    /** AS-IS fnd.Fnd09_TrustBank.selectByText (P05 조회창) — 검색어는 서버가 %…%로 */
    public List<TrustBankRes> lookup(UserPrincipal user, String searchText) {
        return mapper.selectByText(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS fnd.Fnd09_TrustBank.selectByCompanyId (R12 #1100 수탁은행정보 관리) */
    public List<TrustBankCompanyRes> searchCompany(UserPrincipal user, String searchText, boolean useYn) {
        return mapper.selectByCompanyId(user.getCompanyId(), String.valueOf(useYn), searchText == null ? "" : searchText);
    }

    /** AS-IS fnd.Fnd09_TrustBank.preUpdate (L53-91) + update (L147-150, UpdateDataModel) */
    @Transactional
    public List<TrustBankCompanyRes> saveCompany(UserPrincipal user, List<TrustBankCompanySaveReq> rows) {
        Long companyId = user.getCompanyId();
        for (TrustBankCompanySaveReq req : rows) {
            TrustBankCompanyRes found = (req.trustBankId() == null || req.trustBankId() <= 0)
                    ? null : mapper.selectCompanyById(req.trustBankId());
            if (found != null && !found.companyId().equals(companyId)) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }
            boolean checkDup = (found == null) || !Objects.equals(req.trustBankCode(), found.trustBankCode());
            if (checkDup && mapper.countByCd(companyId, req.trustBankCode()) > 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "동일한 수탁은행코드가 존재합니다.");
            }
        }
        return rows.stream().map(req -> {
            TrustBankCompanyRes found = (req.trustBankId() == null || req.trustBankId() <= 0)
                    ? null : mapper.selectCompanyById(req.trustBankId());
            if (found != null) {
                mapper.updateCompanyTrustBank(req, companyId);
                return mapper.selectCompanyById(req.trustBankId());
            }
            long newId = mapper.selectNextId();
            mapper.insertCompanyTrustBank(newId, req, companyId);
            return mapper.selectCompanyById(newId);
        }).toList();
    }

    /** AS-IS fnd.Fnd09_TrustBank.delete (L152-155, UpdateDataModel) */
    @Transactional
    public void deleteCompany(UserPrincipal user, List<Long> trustBankIds) {
        if (trustBankIds == null || trustBankIds.isEmpty()) {
            return;
        }
        mapper.deleteCompanyTrustBanks(user.getCompanyId(), trustBankIds);
    }

    /** AS-IS fnd.Fnd09_TrustBank.selectIcamTrustBank (L93, R12 회사별 화면에서 호출) */
    public void importCompanyIcam(UserPrincipal user) {
        icamImporter.importTrustBanks(user.getCompanyId() == 0 ? "%" : String.valueOf(user.getCompanyId()));
    }
}
