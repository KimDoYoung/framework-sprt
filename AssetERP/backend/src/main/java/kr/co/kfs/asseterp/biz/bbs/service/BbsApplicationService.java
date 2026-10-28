package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationRes;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsApplicationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/bbs/Bbs11_Application.java (selectByAppStatus) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsApplicationService {

    private final BbsApplicationMapper mapper;

    /** AS-IS selectByAppStatus(companyId, appStatus) */
    public List<ApplicationRes> searchByAppStatus(UserPrincipal user, String appStatus) {
        return mapper.selectByAppStatus(user.getCompanyId(), appStatus);
    }
}
