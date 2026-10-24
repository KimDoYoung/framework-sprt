package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyChangeOrgReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyGroupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyOrgAssignReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyParam;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyRegParam;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyRegRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyTaskOrgRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManlDutyMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManlJobMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 매뉴얼 부서지정(AS-IS Tdm41_Tab_ManlDutyOrg, N16) → server/tdm/Tdm41_ManlDuty
 * + Tdm42_ManlOrg(confirmChk·insertManlOrg·deleteByManlJobId, 확정/확정취소) + Tdm44_ManlDutyOrg.insert(부서 일괄지정)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmManlDutyService {

    private final TdmManlDutyMapper mapper;
    private final TdmManlJobMapper jobMapper;
    private final TdmManlOrgService manlOrgService;

    /** AS-IS tdm.Tdm41_ManlDuty.groupByManlJobId — 직책별 책무·관리의무 건수 */
    public List<ManlDutyGroupRes> groups(UserPrincipal user, Long manlJobId, Long roleId, Long taskId) {
        requireJob(user, manlJobId);
        return mapper.groupByManlJobId(manlJobId, roleId, taskId);
    }

    /** AS-IS tdm.Tdm41_ManlDuty.selectByTextPaging — searchText는 '%글자%', 합계(selectByTextPagingTotal)와 한 쌍 */
    public PageRes<ManlDutyRes> search(UserPrincipal user, Long manlJobId, Long roleId, Long taskId, boolean unRegYn, String searchText, long offset, long limit) {
        requireJob(user, manlJobId);
        ManlDutyParam param = new ManlDutyParam(manlJobId, roleId, taskId, unRegYn, "%" + (searchText == null ? "" : searchText) + "%", limit, offset);
        return new PageRes<>(mapper.selectByTextPagingTotal(param), mapper.selectByTextPaging(param));
    }

    /**
     * AS-IS tdm.Tdm41_ManlDuty.selectByOrgIdPaging (+Total) — 매뉴얼(점검항목) 작성(N17) 위 그리드.
     * orgId는 화면에서 고른 부서(책무관리자만 바꾼다), searchText는 '%글자%'
     */
    public PageRes<ManlDutyRegRes> searchByOrg(UserPrincipal user, Long manlJobId, Long roleId, Long taskId, Long orgId, String searchText, long offset, long limit) {
        requireJob(user, manlJobId);
        ManlDutyRegParam param = new ManlDutyRegParam(manlJobId, roleId, taskId, orgId, "%" + (searchText == null ? "" : searchText) + "%", limit, offset);
        return new PageRes<>(mapper.selectByOrgIdPagingTotal(param), mapper.selectByOrgIdPaging(param));
    }

    /**
     * AS-IS tdm.Tdm41_ManlDuty.updateEndYn — 점검항목 작성완료(endYn true)·작성취소(false).
     * 작성취소는 부서 책무매뉴얼이 잠겨 있으면 못 한다(AS-IS status -1 → 화면 "잠겨진 매뉴얼입니다")
     */
    @Transactional
    public void updateEnd(UserPrincipal user, Long manlDutyId, Long manlOrgId, Long orgId, boolean endYn) {
        Long companyId = manlOrgService.requireScope(user, manlOrgId);
        if (!companyId.equals(mapper.selectDutyCompanyId(manlDutyId))) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!endYn && mapper.countLockedByManlOrgId(manlOrgId) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "잠겨진 매뉴얼입니다");
        }
        mapper.updateDutyOrgEnd(manlDutyId, orgId, endYn, user.getUserId(), user.getName());
    }

    /** AS-IS tdm.Tdm41_ManlDuty.selectTaskAndOrg — 부서변경 창 */
    public List<ManlDutyTaskOrgRes> taskOrgs(UserPrincipal user, Long manlJobId, Long roleId) {
        requireJob(user, manlJobId);
        return mapper.selectTaskAndOrg(manlJobId, roleId);
    }

    /** AS-IS tdm.Tdm44_ManlDutyOrg.insert — 부서마다 관리의무마다, 같은 관리의무-부서가 없을 때만 넣는다 */
    @Transactional
    public void assignOrgs(UserPrincipal user, ManlDutyOrgAssignReq req) {
        for (Long manlDutyId : req.manlDutyIds()) {
            Long companyId = mapper.selectDutyCompanyId(manlDutyId);
            if (companyId == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            if (!companyId.equals(user.getCompanyId())) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }
        }
        for (Long orgId : req.orgIds()) {
            for (Long manlDutyId : req.manlDutyIds()) {
                if (mapper.countDutyOrg(manlDutyId, orgId) == 0) {
                    mapper.insertDutyOrg(manlDutyId, orgId, user.getName());
                }
            }
        }
    }

    /** AS-IS tdm.Tdm41_ManlDuty.changeOrgId2 — 직책(manlJobId·roleId)의 고른 책무·담당부서를 새 부서로 옮긴다 */
    @Transactional
    public void changeOrg(UserPrincipal user, ManlDutyChangeOrgReq req) {
        requireJob(user, req.manlJobId());
        // 책무매뉴얼 상신시 처리불가!!
        if (mapper.countLockByRoleId(req.manlJobId(), req.roleId()) != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "책무매뉴얼이 잠겨진 상태입니다");
        }
        for (ManlDutyChangeOrgReq.Item item : req.items()) {
            // tdm42: 새 부서의 직책 확정 행이 없으면 만든다(exctId는 기존 부서의 행에서)
            Long manlOrgId = mapper.selectManlOrgId(req.manlJobId(), req.roleId(), req.orgId());
            if (manlOrgId == null) {
                manlOrgId = mapper.selectNextId();
                Long exctId = mapper.selectExctId(req.manlJobId(), req.roleId(), item.orgId());
                mapper.insertManlOrg(manlOrgId, user.getCompanyId(), req.orgId(), exctId, req.roleId(), req.manlJobId(), user.getName());
            }
            // tdm43 → tdm44 순서 (tdm43의 대상 검색이 tdm44의 기존 부서를 쓴다)
            mapper.updateManlOrgByTask(req.manlJobId(), req.roleId(), item.taskId(), item.orgId(), req.orgId(), manlOrgId, user.getName());
            mapper.updateDutyOrgByTask(req.manlJobId(), req.roleId(), item.taskId(), item.orgId(), req.orgId(), user.getName());
        }
        // tdm42 정리 : tdm43이 없는 tdm42는 delete
        mapper.deleteEmptyManlOrgs(req.manlJobId(), req.roleId());
    }

    /**
     * AS-IS tdm.Tdm42_ManlOrg.confirmChk(type I) + insertManlOrg — 확정. AS-IS는 두 번 부르지만(검사 → 확정) 한 트랜잭션으로 합쳤다.
     * 작성시작일이 비어 있으면 AS-IS는 insert 뒤에 실패 처리하므로 TOBE는 insert 전에 막는다(결과는 같고 반쯤 들어간 행이 없다)
     */
    @Transactional
    public void confirm(UserPrincipal user, Long manlJobId) {
        requireJob(user, manlJobId);
        if (mapper.countManlOrgs(manlJobId) != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "확정된 매뉴얼작업입니다");
        }
        if (mapper.countNullOrgId(manlJobId) != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "담당부서가 지정되지 않은 관리의무가 존재합니다.");
        }
        if (mapper.selectJobStartDate(manlJobId) == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "매뉴얼작업 작성시작일을 확인해주세요");
        }
        mapper.insertManlOrgsByJob(manlJobId, user.getCompanyId(), user.getName());
    }

    /** AS-IS tdm.Tdm42_ManlOrg.confirmChk(type D) + deleteByManlJobId — 확정취소 */
    @Transactional
    public void cancel(UserPrincipal user, Long manlJobId) {
        requireJob(user, manlJobId);
        if (mapper.countManlOrgs(manlJobId) == 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "확정전 매뉴얼작업입니다");
        }
        if (mapper.countLockedManlOrgs(manlJobId) != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "잠겨진 매뉴얼작업입니다");
        }
        if (jobMapper.countManls(manlJobId) != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "작성중인 점검항목이 존재합니다. 점검항목 정리 후 확정취소할 수 있습니다");
        }
        mapper.clearEndYn(manlJobId, user.getName());
        jobMapper.deleteManlsByJob(manlJobId);
        jobMapper.deleteManlOrgsByJob(manlJobId);
    }

    /** 매뉴얼 작업이 로그인 회사 것이어야 한다 */
    private void requireJob(UserPrincipal user, Long manlJobId) {
        Long companyId = jobMapper.selectCompanyId(manlJobId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
