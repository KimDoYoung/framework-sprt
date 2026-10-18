package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepGroupRes;
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
}
