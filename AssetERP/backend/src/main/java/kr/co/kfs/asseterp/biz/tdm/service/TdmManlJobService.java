package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuSearchService;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardMyOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlJobParam;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlJobRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlJobSaveReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmDashboardMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManlJobMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 매뉴얼 작업대상 선정(AS-IS Tdm40_Tab_ManlJob, N15) → server/tdm/Tdm40_ManlJob */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmManlJobService {

    private final TdmManlJobMapper mapper;
    private final TdmDashboardMapper dashboardMapper;

    /**
     * AS-IS tdm.Tdm40_ManlJob.selectByText — 로그인 회사만. searchText는 '%글자%'. checkYn(N17)이면 로그인 사용자 부서가 확정(책무매뉴얼 부서)된 작업만 —
     * 부서는 AS-IS LoginUser.getOrgCodeId()와 같은 값(dashboard my-org).
     * createDutyYn: 서버 AS-IS는 안 보내면 true(관리의무가 생성된 작업만) — 작업대상 선정(N15)은 false를, 부서지정(N16) 등은 true를 보낸다
     */
    public List<ManlJobRes> search(UserPrincipal user, String searchText, boolean writingYn, boolean checkYn, boolean createDutyYn) {
        String text = "%" + (searchText == null ? "" : searchText) + "%";
        Long orgId = null;
        if (checkYn && user.getUserId() != null && user.getUserId() > 0) {
            DashboardMyOrgRes myOrg = dashboardMapper.selectMyOrg(user.getCompanyId(), user.getUserId());
            orgId = myOrg == null ? null : myOrg.orgCodeId();
        }
        return mapper.selectByText(new ManlJobParam(user.getCompanyId(), orgId, text, writingYn, checkYn, createDutyYn));
    }

    /** AS-IS Tdm40_ManlJob.update(UpdateDataModel): manlJobId가 없거나 ≤ 0이면 INSERT, 아니면 UPDATE */
    @Transactional
    public void save(UserPrincipal user, List<ManlJobSaveReq> rows) {
        for (ManlJobSaveReq r : rows) {
            if (r.manlJobId() == null || r.manlJobId() <= 0) {
                mapper.insertManlJob(mapper.selectNextId(), user.getCompanyId(), r.regDate(), r.jobName(), r.manlApplyStartDate(),
                        r.roleId(), r.orgId(), r.jobReason(), r.startDate(), r.endDate(), user.getName());
            } else {
                requireOwn(user, r.manlJobId());
                mapper.updateManlJob(r.manlJobId(), user.getCompanyId(), r.regDate(), r.jobName(), r.manlApplyStartDate(),
                        r.roleId(), r.orgId(), r.jobReason(), r.startDate(), r.endDate(), user.getName());
            }
        }
    }

    /** AS-IS Tdm40_ManlJob.delete (UpdateDataModel.deleteModel) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> manlJobIds) {
        if (manlJobIds == null || manlJobIds.isEmpty()) {
            return 0;
        }
        for (Long id : manlJobIds) {
            requireOwn(user, id);
        }
        return mapper.deleteManlJobs(user.getCompanyId(), manlJobIds);
    }

    /** AS-IS tdm41Chk(tdm.Tdm41_ManlDuty.selectByManlJobId) — 작성내역(관리의무)이 있는 작업인가 */
    public boolean hasDuties(UserPrincipal user, Long manlJobId) {
        requireOwn(user, manlJobId);
        return mapper.countDuties(manlJobId) > 0;
    }

    /** AS-IS tdm.Tdm43_Manl.countByManlJobId — 작성된 점검항목 수 */
    public int countManls(UserPrincipal user, Long manlJobId) {
        requireOwn(user, manlJobId);
        return mapper.countManls(manlJobId);
    }

    /** AS-IS tdm.Tdm40_ManlJob.deleteAll — 매뉴얼·매뉴얼 부서·관리의무 부서·관리의무를 이 순서로 지운다 */
    @Transactional
    public void deleteAll(UserPrincipal user, Long manlJobId) {
        requireOwn(user, manlJobId);
        mapper.deleteManlsByJob(manlJobId);
        mapper.deleteManlOrgsByJob(manlJobId);
        mapper.deleteDutyOrgsByJob(manlJobId);
        mapper.deleteDutiesByJob(manlJobId);
    }

    /** AS-IS tdm.Tdm40_ManlJob.createDuty — AS-IS는 화면의 모델을 보냈지만 저장된 행(화면은 저장 전 변경이 있으면 막는다)을 읽어 쓴다 */
    @Transactional
    public void createDuty(UserPrincipal user, Long manlJobId) {
        requireOwn(user, manlJobId);
        ManlJobRes job = mapper.selectById(manlJobId);
        mapper.insertDuties(manlJobId, user.getCompanyId(), job.roleId(), job.manlApplyStartDate(), user.getName());
        if (job.orgId() != null) {
            mapper.insertDutyOrgs(manlJobId, job.orgId(), user.getName());
        }
    }

    /**
     * AS-IS tdm.Tdm40_ManlJob.createDirectManl — actionName(REDEFINE_BY_ROLE·REMAKE_FROM_LATEST)을 DB 함수에 넘긴다.
     * 버튼이 관리자에게만 보이므로(AS-IS LoginUser.getIsManager) 서버도 관리자만 허용한다
     */
    @Transactional
    public void createDirectManl(UserPrincipal user, Long manlJobId, String actionName) {
        if (!SysMenuSearchService.isManager(user)) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        requireOwn(user, manlJobId);
        String resultYn;
        try {
            resultYn = mapper.createDirectManl(actionName, user.getCompanyId(), manlJobId, user.getName());
        } catch (DataAccessException e) {
            log.warn("createDirectManl 실패 manlJobId={} actionName={}: {}", manlJobId, actionName, e.getMessage());
            throw new BusinessException(ErrorCode.INVALID_INPUT, "매뉴얼 생성 실패. 관리자에게 문의하여 주십시오");
        }
        if (!"Y".equals(resultYn)) {
            // AS-IS result.fail(-1, resultYn): DB 함수가 돌려준 메시지를 그대로 보여 준다
            throw new BusinessException(ErrorCode.INVALID_INPUT, resultYn);
        }
    }

    /** 작업 행이 로그인 회사 것이어야 한다 */
    private void requireOwn(UserPrincipal user, Long manlJobId) {
        Long companyId = mapper.selectCompanyId(manlJobId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
