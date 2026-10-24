package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardMyOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgApprParam;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgApprRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgMgrRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgParam;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgPeriodReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgPeriodRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmDashboardMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManlOrgMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 책무매뉴얼 재생성(AS-IS Tdm42_Tab_ManlManagerAdmin, E13)·부서별 매뉴얼 보고(Tdm42_Tab_ManlOrgAppr, N18) → server/tdm/Tdm42_ManlOrg */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmManlOrgService {

    private final TdmManlOrgMapper mapper;
    private final ManlOrgPdfMaker pdfMaker;
    private final TdmDashboardMapper dashboardMapper;

    /**
     * AS-IS tdm.Tdm42_ManlOrg.selectByText (useYn=false, adminYn=true 고정).
     * 회사: KFS 관리자는 고른 회사(없으면 전체), 그 밖에는 로그인 회사. 일자 범위는 전체보기가 아닐 때만 건다.
     */
    public List<ManlOrgRes> search(UserPrincipal user, Long companyId, Long orgId, String searchText, boolean notPeriodYn, String startDate, String closeDate) {
        Long scope = user.isSysAdmin() ? companyId : user.getCompanyId();
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectByText(new ManlOrgParam(scope, orgId, like, notPeriodYn, startDate, closeDate));
    }

    /**
     * 한 건 재생성 (AS-IS createRd: 파일 확인·삭제 Tdm42_ManlOrg.fileCheck → CreateTdmManlOrg → RD PDF → fileReName → copyFile).
     * 생성기가 없는 동안에는 {@link ManlOrgPdfMaker}가 먼저 거절해 기존 첨부를 지우지 않는다.
     */
    @Transactional
    public void recreate(UserPrincipal user, Long manlOrgId) {
        Long companyId = requireScope(user, manlOrgId);
        pdfMaker.make(manlOrgId, companyId, user);
    }

    /**
     * AS-IS tdm.Tdm42_ManlOrg.selectByText (N18: 로그인 회사 + 로그인 사용자 부서(LoginUser.getOrgCodeId() = dashboard my-org), adminYn·기간 조건 없음).
     * searchText는 '%글자%', useYn은 "사용 & 작성중인 매뉴얼만 조회"
     */
    public List<ManlOrgApprRes> searchAppr(UserPrincipal user, String searchText, boolean useYn) {
        Long orgId = null;
        if (user.getUserId() != null && user.getUserId() > 0) {
            DashboardMyOrgRes myOrg = dashboardMapper.selectMyOrg(user.getCompanyId(), user.getUserId());
            orgId = myOrg == null ? null : myOrg.orgCodeId();
        }
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectByTextAppr(new ManlOrgApprParam(user.getCompanyId(), orgId, like, useYn));
    }

    /**
     * AS-IS tdm.Tdm42_ManlOrg.selectByText (N19 Tdm42_Tab_ManlManager: 로그인 회사 + 화면에서 고른 부서(없으면 전체), adminYn·기간 조건 없음).
     * searchText는 '%글자%', useYn은 "사용 & 작성중인 매뉴얼만 조회"
     */
    public List<ManlOrgMgrRes> searchMgr(UserPrincipal user, Long orgId, String searchText, boolean useYn) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectByTextMgr(new ManlOrgApprParam(user.getCompanyId(), orgId, like, useYn));
    }

    /** AS-IS tdm.Tdm42_ManlOrg.notManlOrgList — 로그인 회사의 부서 책무매뉴얼 중 화면 목록에 없는 것(적용기간 중복 검사용) */
    public List<ManlOrgPeriodRes> notIn(UserPrincipal user, List<Long> manlOrgIds) {
        return mapper.selectNotIn(user.getCompanyId(), manlOrgIds);
    }

    /** AS-IS tdm.Tdm42_ManlOrg.update (UpdateDataModel) — 적용시작일·적용종료일. 로그인 회사 행만, 없으면 DATA_NOT_FOUND */
    @Transactional
    public void savePeriods(UserPrincipal user, List<ManlOrgPeriodReq> rows) {
        for (ManlOrgPeriodReq r : rows) {
            if (mapper.updatePeriod(r.manlOrgId(), user.getCompanyId(), blankToNull(r.startDate()), blankToNull(r.endDate()), user.getName()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
    }

    /** AS-IS tdm.Tdm42_ManlOrg.updateLock — 'P' 잠금 / 'C' 잠금해제. 로그인 회사 행만 */
    @Transactional
    public void updateLock(UserPrincipal user, String actionType, List<Long> manlOrgIds) {
        boolean lockYn;
        if ("P".equals(actionType)) {
            lockYn = true;
        } else if ("C".equals(actionType)) {
            lockYn = false;
        } else {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "정의되지 않은 처리구분자 입니다. 전산팀에 문의하세요");
        }
        for (Long manlOrgId : manlOrgIds) {
            if (mapper.updateLockYn(manlOrgId, user.getCompanyId(), lockYn, user.getName()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s;
    }

    /** 대상 행의 회사를 읽어 KFS 관리자 외에는 로그인 회사 행만 허용한다 */
    Long requireScope(UserPrincipal user, Long manlOrgId) {
        Long companyId = mapper.selectCompanyId(manlOrgId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!user.isSysAdmin() && !companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return companyId;
    }
}
