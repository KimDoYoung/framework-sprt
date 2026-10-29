package kr.co.kfs.asseterp.biz.att.service;

import kr.co.kfs.asseterp.biz.att.dto.AttWorkPolicyRes;
import kr.co.kfs.asseterp.biz.att.dto.AttWorkPolicySaveReq;
import kr.co.kfs.asseterp.biz.att.mapper.AttWorkPolicyMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS Att01_Lookup_WorkPolicy(T06) → server/att/Att01_WorkPolicy.java (getModel L46 / update L57 / delete L62).
 * 저장·삭제는 로그인 회사 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttWorkPolicyService {

    private final AttWorkPolicyMapper mapper;

    /** AS-IS selectByCompanyId */
    public List<AttWorkPolicyRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS getModel(useYn "true"): 쓰는 정책들 — 한 건일 때만 기본 시각으로 쓴다 */
    public List<AttWorkPolicyRes> active(UserPrincipal user) {
        return mapper.selectActive(user.getCompanyId());
    }

    /** AS-IS update (UpdateDataModel) → 저장된 행(요청 순서) */
    @Transactional
    public List<AttWorkPolicyRes> save(UserPrincipal user, List<AttWorkPolicySaveReq> rows) {
        Long companyId = user.getCompanyId();
        return rows.stream().map(req -> {
            if (req.workPolicyId() != null && req.workPolicyId() > 0) {
                if (mapper.update(companyId, req) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                return mapper.selectById(companyId, req.workPolicyId());
            }
            long id = mapper.selectNextId();
            mapper.insert(companyId, id, req);
            return mapper.selectById(companyId, id);
        }).toList();
    }

    /** AS-IS delete → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
