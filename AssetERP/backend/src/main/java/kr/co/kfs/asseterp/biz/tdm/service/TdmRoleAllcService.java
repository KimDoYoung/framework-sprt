package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcCreateReq;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcDetailKey;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcDetailSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcExctRow;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcTaskDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcTaskRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcUpdateReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmRoleAllcMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 임원별 직책배정 (AS-IS server/tdm/Tdm30_RoleAllc·Tdm34_RoleAllcDetail·Tdm35_RoleAllcTask·Tdm31_RoleDesc 일부) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmRoleAllcService {

    private final TdmRoleAllcMapper mapper;

    /** AS-IS tdm.Tdm30_RoleAllc.selectByText (searchText는 '%…%'로 감싼다) */
    public List<RoleAllcRes> search(UserPrincipal user, LocalDate baseDate, boolean allYn, String searchText) {
        return mapper.selectByText(user.getCompanyId(), baseDate, allYn, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS tdm.Tdm30_RoleAllc.notInRoleAllcIdList — 겹침 검사용으로 고른 행을 뺀 회사의 직책배정 */
    public List<RoleAllcRes> searchOthers(UserPrincipal user, List<Long> excludeIds) {
        return mapper.notInRoleAllcIdList(user.getCompanyId(), excludeIds);
    }

    /**
     * AS-IS Tdm30_Edit_RoleAllc.update → updateRoleAllcDetail: 직책배정(tdm30)을 만들고 책무배분일(tdm34) 한 건을 같이 만든다.
     * AS-IS는 두 번의 서비스 호출이지만 여기서는 한 트랜잭션이다
     */
    @Transactional
    public RoleAllcRes create(UserPrincipal user, RoleAllcCreateReq req) {
        Long roleAllcId = mapper.selectNextId();
        mapper.insertRoleAllc(roleAllcId, user.getCompanyId(), req.roleId(), req.personId(), String.valueOf(req.addTitleYn()),
                req.startDate(), null, user.getName());
        mapper.insertDetail(mapper.selectNextId(), roleAllcId, req.roleAllcDate(), req.regReason(), req.deputyEmpName(), user.getName());
        return mapper.selectById(roleAllcId);
    }

    /** AS-IS Tdm30_Edit_RoleAllcModify.update → Tdm30_RoleAllc.modelUpdate */
    @Transactional
    public RoleAllcRes update(UserPrincipal user, Long roleAllcId, RoleAllcUpdateReq req) {
        checkRoleAllc(user, roleAllcId);
        mapper.updateRoleAllc(roleAllcId, user.getCompanyId(), req.roleId(), req.personId(), String.valueOf(req.addTitleYn()),
                req.startDate(), req.endDate(), user.getName());
        return mapper.selectById(roleAllcId);
    }

    /** AS-IS Tdm30_RoleAllc.delete: 책무배분일(tdm34)을 먼저 지우고 직책배정을 지운다 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> roleAllcIds) {
        if (roleAllcIds == null || roleAllcIds.isEmpty()) {
            return 0;
        }
        for (Long id : roleAllcIds) {
            checkRoleAllc(user, id);
        }
        for (Long id : roleAllcIds) {
            mapper.deleteDetailsByRoleAllcId(id);
        }
        return mapper.deleteRoleAllcs(user.getCompanyId(), roleAllcIds);
    }

    /** AS-IS tdm.Tdm34_RoleAllcDetail.selectByRoleAllcId */
    public List<RoleAllcDetailRes> searchDetails(UserPrincipal user, Long roleAllcId) {
        checkRoleAllc(user, roleAllcId);
        return mapper.selectDetailsByRoleAllcId(roleAllcId);
    }

    /** AS-IS Tdm34_RoleAllcDetail.update: ID ≤ 0이면 INSERT. 저장 뒤 목록을 다시 돌려준다 */
    @Transactional
    public List<RoleAllcDetailRes> saveDetails(UserPrincipal user, Long roleAllcId, List<RoleAllcDetailSaveReq> rows) {
        checkRoleAllc(user, roleAllcId);
        for (RoleAllcDetailSaveReq row : rows) {
            if (row.roleAllcDetailId() == null || row.roleAllcDetailId() <= 0) {
                mapper.insertDetail(mapper.selectNextId(), roleAllcId, row.roleAllcDate(), row.regReason(), row.deputyEmpName(), user.getName());
            } else {
                checkDetail(user, row.roleAllcDetailId());
                mapper.updateDetail(row.roleAllcDetailId(), row.roleAllcDate(), row.regReason(), row.deputyEmpName(), user.getName());
            }
        }
        return mapper.selectDetailsByRoleAllcId(roleAllcId);
    }

    /** AS-IS Tdm34_RoleAllcDetail.delete */
    @Transactional
    public int deleteDetails(UserPrincipal user, List<Long> roleAllcDetailIds) {
        if (roleAllcDetailIds == null || roleAllcDetailIds.isEmpty()) {
            return 0;
        }
        for (Long id : roleAllcDetailIds) {
            checkDetail(user, id);
        }
        return mapper.deleteDetails(roleAllcDetailIds);
    }

    /** AS-IS tdm.Tdm35_RoleAllcTask.selectTask */
    public List<RoleAllcTaskRes> searchTasks(UserPrincipal user, Long roleAllcDetailId) {
        checkDetail(user, roleAllcDetailId);
        return mapper.selectTask(roleAllcDetailId);
    }

    /** AS-IS tdm.Tdm35_RoleAllcTask.selectTaskDetail */
    public List<RoleAllcTaskDetailRes> searchTaskDetails(UserPrincipal user, Long roleAllcDetailId, Long taskId) {
        checkDetail(user, roleAllcDetailId);
        return mapper.selectTaskDetail(roleAllcDetailId, taskId);
    }

    /**
     * AS-IS tdm.Tdm35_RoleAllcTask.deleteInsert: 책무배분일 기준일로 그 임원의 직책배정을 읽어,
     * 상신 전(99 임시저장·40 반려)인 것만 확정책무(tdm35)를 지우고 다시 만든다
     */
    @Transactional
    public void rebuildTasks(UserPrincipal user, Long roleAllcDetailId) {
        RoleAllcDetailKey key = checkDetail(user, roleAllcDetailId);
        for (RoleAllcExctRow row : mapper.selectByExctId(key.companyId(), key.roleAllcDate(), key.personId())) {
            if ("99".equals(row.apprStatusCode()) || "40".equals(row.apprStatusCode())) {
                mapper.deleteTasksByDetailId(row.roleAllcDetailId());
                mapper.insertTasksByDetailId(row.roleAllcDetailId(), user.getName());
            }
        }
    }

    /** AS-IS tdm.Tdm31_RoleDesc.getRollAllcDetailId: 승인 완료된 책무기술서 ID (없으면 null) */
    public Long searchRoleDescId(UserPrincipal user, Long roleAllcDetailId) {
        RoleAllcDetailKey key = checkDetail(user, roleAllcDetailId);
        return mapper.selectRoleDescId(user.getCompanyId(), key.roleAllcDate(), roleAllcDetailId);
    }

    /** 직책배정이 로그인 회사 것이어야 한다 */
    private void checkRoleAllc(UserPrincipal user, Long roleAllcId) {
        Long companyId = mapper.selectCompanyId(roleAllcId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    /** 책무배분일이 속한 직책배정이 로그인 회사 것이어야 한다 */
    private RoleAllcDetailKey checkDetail(UserPrincipal user, Long roleAllcDetailId) {
        RoleAllcDetailKey key = mapper.selectDetailKey(roleAllcDetailId);
        if (key == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!key.companyId().equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return key;
    }
}
