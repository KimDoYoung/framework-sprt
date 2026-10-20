package kr.co.kfs.asseterp.biz.org.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.org.dto.OrgRoleStampRes;
import kr.co.kfs.asseterp.biz.org.dto.OrgRoleStampSaveReq;
import kr.co.kfs.asseterp.biz.org.mapper.OrgRoleStampMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/org/Org10_RoleStamp.java (G07 Org10_Lookup_RoleStamp 부서별 사용권한). 수정·삭제도 로그인 회사의 인감 행만(보안 보강) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrgRoleStampService {

    private final OrgRoleStampMapper mapper;

    /** AS-IS selectByStampId */
    public List<OrgRoleStampRes> search(UserPrincipal user, Long stampId) {
        return mapper.selectByStampId(user.getCompanyId(), stampId);
    }

    /** AS-IS update(UpdateDataModel): 새 행(roleStampId 없음·0 이하)은 새 ID로 INSERT, 아니면 UPDATE. 저장한 행을 요청과 같은 순서로 돌려준다 */
    @Transactional
    public List<OrgRoleStampRes> save(UserPrincipal user, List<OrgRoleStampSaveReq> rows) {
        Long companyId = user.getCompanyId();
        return rows.stream().map(r -> {
            boolean isNew = r.roleStampId() == null || r.roleStampId() <= 0;
            long id = isNew ? mapper.selectNextId() : r.roleStampId();
            OrgRoleStampSaveReq row = new OrgRoleStampSaveReq(id, r.stampId(), r.orgCodeId(), r.useYn());
            int n = isNew ? mapper.insertRoleStamp(companyId, row) : mapper.updateRoleStamp(companyId, row);
            if (n == 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "인감을 찾을 수 없습니다");
            }
            return mapper.selectById(id);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids.stream().mapToInt(id -> mapper.deleteRoleStamp(user.getCompanyId(), id)).sum();
    }
}
