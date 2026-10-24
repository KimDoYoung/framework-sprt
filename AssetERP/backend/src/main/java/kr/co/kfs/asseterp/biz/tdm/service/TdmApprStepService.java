package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ApprStepChildRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ApprStepRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ApprStepRow;
import kr.co.kfs.asseterp.biz.tdm.dto.ApprStepSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ApprStepSeqReq;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmApprStepMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 직책별 부서승인선 등록 (AS-IS server/tdm/Tdm09_ApprStep) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmApprStepService {

    private final TdmApprStepMapper mapper;

    /** AS-IS tdm.Tdm09_ApprStep.selectByCompanyId (typeCode 'C', searchText는 '%…%'로 감싼다) */
    public List<ApprStepRes> search(UserPrincipal user, String searchText) {
        return mapper.selectByCompanyId(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS tdm.Tdm09_ApprStep.selectByParentId (typeCode 'T') */
    public List<ApprStepChildRes> searchChildren(UserPrincipal user, Long apprStepId) {
        return mapper.selectByParentId(user.getCompanyId(), apprStepId);
    }

    /**
     * AS-IS Tdm09_ApprStep.update: 행마다 하위 승인자의 직책·부서를 같이 바꾸고(updateByParentId) UpdateDataModel로 INSERT/UPDATE.
     * ID ≤ 0이면 INSERT. 저장한 행을 요청 순서로 돌려준다
     */
    @Transactional
    public List<ApprStepRes> save(UserPrincipal user, List<ApprStepSaveReq> rows) {
        for (ApprStepSaveReq row : rows) {
            if (row.roleId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "직책을 선택하세요");
            }
            if (row.orgId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "부서를 선택하세요");
            }
        }
        for (ApprStepSaveReq row : rows) {
            if (row.apprStepId() != null && row.apprStepId() > 0) {
                checkCompany(user, row.apprStepId());
                mapper.updateChildrenRoleOrg(row.apprStepId(), row.roleId(), row.orgId());
            }
        }
        List<Long> ids = new ArrayList<>();
        for (ApprStepSaveReq row : rows) {
            if (row.apprStepId() == null || row.apprStepId() <= 0) {
                Long newId = mapper.selectNextId();
                mapper.insertStep(newId, user.getCompanyId(), row, user.getName());
                ids.add(newId);
            } else {
                mapper.updateStep(row, user.getName());
                ids.add(row.apprStepId());
            }
        }
        return ids.stream().map(mapper::selectSavedById).toList();
    }

    /** AS-IS Tdm09_ApprStep.deleteByParentId: 하위 승인자를 먼저 지우고 직책-부서 행을 지운다 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> apprStepIds) {
        if (apprStepIds == null || apprStepIds.isEmpty()) {
            return 0;
        }
        for (Long id : apprStepIds) {
            checkCompany(user, id);
        }
        for (Long id : apprStepIds) {
            mapper.deleteByParentId(id);
        }
        return mapper.deleteSteps(user.getCompanyId(), apprStepIds);
    }

    /**
     * AS-IS Tdm09_ApprStep.modelUpdate: 고른 사원마다 승인자 행을 만든다. 직책·부서는 상위 행 값,
     * 승인순서는 지금 승인자 수 + 1부터 (AS-IS는 화면 그리드의 행 수에서 시작)
     */
    @Transactional
    public int addChildren(UserPrincipal user, Long parentId, List<Long> personIds) {
        ApprStepRow parent = checkCompany(user, parentId);
        int seq = mapper.countChildren(user.getCompanyId(), parentId);
        for (Long personId : personIds) {
            seq++;
            mapper.insertChild(mapper.selectNextId(), user.getCompanyId(), parent.roleId(), parent.orgId(), parentId,
                    String.valueOf(seq), personId, user.getName());
        }
        return personIds.size();
    }

    /** AS-IS Tdm09_ApprStep.inUpdateData: 위로·아래로 뒤 승인자 순서 저장 */
    @Transactional
    public int saveChildOrder(UserPrincipal user, List<ApprStepSeqReq> rows) {
        for (ApprStepSeqReq row : rows) {
            checkCompany(user, row.apprStepId());
        }
        for (ApprStepSeqReq row : rows) {
            mapper.updateSeq(row.apprStepId(), row.apprSeq(), user.getName());
        }
        return rows.size();
    }

    /** AS-IS Tdm09_ApprStep.delete (UpdateDataModel.deleteModel): 승인자 행 삭제 */
    @Transactional
    public int deleteChildren(UserPrincipal user, List<Long> apprStepIds) {
        if (apprStepIds == null || apprStepIds.isEmpty()) {
            return 0;
        }
        for (Long id : apprStepIds) {
            checkCompany(user, id);
        }
        return mapper.deleteSteps(user.getCompanyId(), apprStepIds);
    }

    /** 승인선 행이 로그인 회사 것이어야 한다 */
    private ApprStepRow checkCompany(UserPrincipal user, Long apprStepId) {
        ApprStepRow row = mapper.selectRow(apprStepId);
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!row.companyId().equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return row;
    }
}
