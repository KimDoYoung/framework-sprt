package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitSaveReq;
import kr.co.kfs.asseterp.biz.biz.mapper.BizLimitMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS Biz90_Tab_Limit → server/biz/Biz90_Limit.java (selectByCompanyId L23 / update L31 / delete L36).
 * 저장·삭제는 UpdateDataModel처럼 필수값 검사 없이 ID가 DB에 있으면 UPDATE, 없으면 INSERT. 로그인 회사의 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizLimitService {

    private final BizLimitMapper mapper;

    /** AS-IS selectByCompanyId(companyId = LoginUser.getCompanyId()) */
    public List<BizLimitRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS update → UpdateDataModel. 저장된 행을 요청과 같은 순서로 돌려준다 */
    @Transactional
    public List<BizLimitRes> save(UserPrincipal user, List<BizLimitSaveReq> rows) {
        Long companyId = user.getCompanyId();
        return rows.stream().map(r -> {
            long id = (r.limitId() == null || r.limitId() <= 0) ? mapper.selectNextId() : r.limitId();
            BizLimitSaveReq row = new BizLimitSaveReq(id, r.startDate(), r.provideRcvType(), r.saleRuleLimit1(), r.saleRuleLimit2(),
                    r.companyLimit1(), r.companyLimit2(), r.companyLimit3());
            if (mapper.update(companyId, row) == 0) {
                mapper.insert(companyId, row);
            }
            return mapper.selectById(companyId, id);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids.stream().mapToInt(id -> mapper.deleteById(user.getCompanyId(), id)).sum();
    }
}
