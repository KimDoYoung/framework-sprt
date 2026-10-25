package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStepRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStepRow;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckOrgBaseRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmChckApprStepMapper;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmCheckOrgMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 부서 점검 승인선 (AS-IS Tdm58_Lookup_ChckApprStep, N21) → server/tdm/Tdm58_ChckApprStep */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmChckApprStepService {

    private final TdmChckApprStepMapper mapper;
    private final TdmCheckOrgMapper orgMapper;

    /** AS-IS tdm.Tdm58_ChckApprStep.selectByChckOrgId — 로그인 회사의 점검부서만 */
    public List<CheckApprStepRes> search(UserPrincipal user, Long chckOrgId) {
        requireOrgOwn(user, chckOrgId);
        return mapper.selectByChckOrgId(chckOrgId);
    }

    /**
     * AS-IS tdm.Tdm58_ChckApprStep.update(UpdateDataModel) — 행마다 ID가 0 이하·없으면 새 ID로 INSERT, 아니면 UPDATE.
     * 요청 행 전부(바뀌지 않은 행 포함)를 보낸다(AS-IS 클라이언트가 순서를 다시 매겨 전체를 보낸다)
     */
    @Transactional
    public void save(UserPrincipal user, List<CheckApprStepRow> rows) {
        for (CheckApprStepRow row : rows) {
            requireOrgOwn(user, row.chckOrgId());
            if (row.chckApprStepId() == null || row.chckApprStepId() <= 0) {
                CheckApprStepRow created = new CheckApprStepRow(mapper.selectNextId(), row.chckOrgId(), row.apprSeq(), row.apprEmpId());
                mapper.insertApprStep(created, user.getName());
            } else {
                requireStepOwn(user, row.chckApprStepId());
                mapper.updateApprStep(row, user.getName());
            }
        }
    }

    /** AS-IS tdm.Tdm58_ChckApprStep.delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> chckApprStepIds) {
        for (Long id : chckApprStepIds) {
            requireStepOwn(user, id);
        }
        return chckApprStepIds.isEmpty() ? 0 : mapper.deleteApprSteps(chckApprStepIds);
    }

    private void requireOrgOwn(UserPrincipal user, Long chckOrgId) {
        CheckOrgBaseRes org = chckOrgId == null ? null : orgMapper.selectById(chckOrgId);
        if (org == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!org.companyId().equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    private void requireStepOwn(UserPrincipal user, Long chckApprStepId) {
        Long companyId = mapper.selectCompanyId(chckApprStepId);
        if (companyId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
