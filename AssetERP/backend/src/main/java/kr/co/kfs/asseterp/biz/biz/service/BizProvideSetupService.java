package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizProvideSetupRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizProvideSetupSaveReq;
import kr.co.kfs.asseterp.biz.biz.mapper.BizProvideSetupMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS Biz04_Lookup_EmpSetup → server/biz/Biz04_ProvideSetup.java (selectByProvidePurCode L21 / upsert L38) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizProvideSetupService {

    private final BizProvideSetupMapper mapper;

    /** AS-IS 클라이언트가 providePurCode에 목적 코드 + "%"를 넘긴다 */
    public List<BizProvideSetupRes> search(UserPrincipal user, String providePurCode) {
        return mapper.selectByProvidePurCode(user.getCompanyId(), providePurCode + "%");
    }

    /** AS-IS GridUpdate: 바뀐 행마다 upsert */
    @Transactional
    public int save(UserPrincipal user, List<BizProvideSetupSaveReq> rows) {
        return rows.stream().mapToInt(r -> mapper.upsert(user.getCompanyId(), r)).sum();
    }
}
