package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.FundInfoCond;
import kr.co.kfs.asseterp.biz.fnd.dto.FundInfoRes;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndFundInfoMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/fnd/Fnd02_FundInfo.java (P08 펀드 변경이력) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndFundInfoService {

    private final FndFundInfoMapper mapper;

    /** AS-IS selectByPaging L35 → selectByNamePaging + selectByNameTotal. 회사는 로그인 회사 */
    public PageRes<FundInfoRes> searchPaging(UserPrincipal user, String fundCode, long offset, long limit) {
        FundInfoCond cond = new FundInfoCond(user.getCompanyId(), fundCode, limit, offset);
        return new PageRes<>(mapper.selectByNameTotal(cond), mapper.selectByNamePaging(cond));
    }
}
