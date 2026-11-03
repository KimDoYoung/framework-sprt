package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepGroupRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepGroupSaveReq;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprStepGroupMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/apr/Apr30_ApprStepGroup.java selectByCompanyId L21 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprStepGroupService {

    private final AprApprStepGroupMapper mapper;

    public List<AprApprStepGroupRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS Apr30_ApprStepGroup.update(UpdateDataModel) → selectById. 저장된 행을 요청 순서로 돌려준다 */
    @Transactional
    public List<AprApprStepGroupRes> save(UserPrincipal user, List<AprApprStepGroupSaveReq> rows) {
        Long companyId = user.getCompanyId();
        return rows.stream().map(r -> {
            long id = (r.apprStepGroupId() == null || r.apprStepGroupId() <= 0) ? mapper.selectNextId() : r.apprStepGroupId();
            AprApprStepGroupSaveReq row = new AprApprStepGroupSaveReq(id, r.apprStepGroupName(), r.note());
            if (mapper.update(companyId, row) == 0) {
                mapper.insert(companyId, row);
            }
            return mapper.selectById(companyId, id);
        }).toList();
    }

    /** AS-IS Apr30_ApprStepGroup.delete(UpdateDataModel.deleteModel) → 지운 건수 (멤버는 원본처럼 지우지 않는다) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids.stream().mapToInt(id -> mapper.deleteById(user.getCompanyId(), id)).sum();
    }
}
