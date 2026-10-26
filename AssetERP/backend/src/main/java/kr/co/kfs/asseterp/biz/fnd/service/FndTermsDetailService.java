package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.FundTermsDetailRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsRevisionRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsRevisionSaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsUpdateReq;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsViewRes;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndTermsDetailMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/fnd/Fnd26_TermsDetail.java · Fnd25_Terms.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndTermsDetailService {

    private final FndTermsDetailMapper mapper;

    /** AS-IS fnd.Fnd26_TermsDetail.selectByTermsId L37 (P07 규약 내용 조회창) */
    public List<FundTermsDetailRes> searchByTermsId(UserPrincipal user, Long termsId) {
        return mapper.selectByTermsId(termsId, user.getCompanyId());
    }

    /** AS-IS fnd.Fnd26_TermsDetail.selectBySearchText L27 (P12 왼쪽 규약 목록). 검색어는 클라이언트가 %…%로 만든다 → 서버가 감싼다, 구분은 비면 % */
    public List<TermsRes> searchTerms(UserPrincipal user, String termsType, String searchText) {
        return mapper.selectBySearchText(user.getCompanyId(), termsType == null || termsType.isBlank() ? "%" : termsType,
                "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS fnd.Fnd26_TermsDetail.selectBySearchTextManager L32 (P12 오른쪽 개정 목록) */
    public List<TermsRevisionRes> searchRevisions(UserPrincipal user, Long termsId, String searchText) {
        return mapper.selectBySearchTextManager(user.getCompanyId(), termsId, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS fnd.Fnd25_Terms.selectBySearchTextManager L22 (P13 펀드규약 조회). 검색어는 클라이언트가 %…%로 만든다 → 서버가 감싼다, 구분은 비면 % */
    public List<TermsViewRes> searchTermsView(UserPrincipal user, String termsType, String searchText) {
        return mapper.selectViewBySearchText(user.getCompanyId(), termsType == null || termsType.isBlank() ? "%" : termsType,
                "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS dbConfig.getSeq (편집 창이 열릴 때 새 개정 ID를 미리 받는다 — 첨부파일을 저장 전에 올리기 위해) */
    @Transactional
    public long nextId() {
        return mapper.selectNextId();
    }

    /**
     * AS-IS fnd.Fnd26_TermsDetail.update (mode insert/new/copy/edit) — 클라이언트의 ksdFundCheck(fnd.Fnd25_Terms.selectByFundId)를 같은 트랜잭션의 앞에 둔다.
     * 개정회차 검사(RevisionNoCheck) → 규약(fnd25) upsert → 개정(fnd26) upsert. insert는 새 규약 ID를 만든다
     */
    @Transactional
    public void saveRevision(UserPrincipal user, TermsRevisionSaveReq req) {
        Long companyId = user.getCompanyId();
        checkFundNotUsed(req.fundId(), req.originFundId());

        boolean edit = "edit".equals(req.mode());
        Long termsId = req.termsId();
        if (edit || termsId != null) {
            if (mapper.countRevisionNo(termsId, req.revisionNo(), edit ? req.originRevisionNo() : null) > 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사용중인 개정회차입니다.");
            }
        } else {
            termsId = mapper.selectNextId();
        }

        Long termsCompanyId = mapper.selectTermsCompanyId(termsId);
        if (termsCompanyId == null) {
            mapper.insertTerms(companyId, termsId, req, user.getName());
        } else if (!termsCompanyId.equals(companyId) || mapper.updateTermsByRevision(companyId, termsId, req, user.getName()) == 0) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Long detailId = req.termsDetailId() == null ? mapper.selectNextId() : req.termsDetailId();
        if (mapper.selectTermsIdOfDetail(detailId) == null) {
            mapper.insertTermsDetail(detailId, termsId, req, user.getName());
        } else if (mapper.updateTermsDetail(companyId, detailId, termsId, req, user.getName()) == 0) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    /** AS-IS fnd.Fnd26_TermsDetail.update mode fnd25update (P12 예탁원코드 창): 규약(fnd25)의 구분·순서·펀드·종료일만 */
    @Transactional
    public void updateTerms(UserPrincipal user, Long termsId, TermsUpdateReq req) {
        checkFundNotUsed(req.fundId(), req.originFundId());
        if (mapper.updateTerms(user.getCompanyId(), termsId, req, user.getName()) == 0) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    /** AS-IS fnd.Fnd26_TermsDetail.delete (deleteModel) — 로그인 회사 규약의 개정만 */
    @Transactional
    public void deleteRevisions(UserPrincipal user, List<Long> termsDetailIds) {
        if (termsDetailIds == null || termsDetailIds.isEmpty()) {
            return;
        }
        mapper.deleteRevisions(user.getCompanyId(), termsDetailIds);
    }

    /** AS-IS fnd.Fnd26_TermsDetail.deleteAll: 개정 전부와 규약을 지운다 */
    @Transactional
    public void deleteTerms(UserPrincipal user, Long termsId) {
        Long termsCompanyId = mapper.selectTermsCompanyId(termsId);
        if (termsCompanyId == null) {
            return;
        }
        if (!termsCompanyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        mapper.deleteDetailsByTermsId(termsId);
        mapper.deleteTermsById(termsId);
    }

    /** AS-IS fnd.Fnd25_Terms.selectByFundId: 이미 다른 규약이 쓰는 펀드(예탁원코드)면 막는다 */
    private void checkFundNotUsed(Long fundId, Long originFundId) {
        if (fundId != null && mapper.countByFundId(fundId, originFundId) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사용중인 예탁원코드입니다.");
        }
    }
}
