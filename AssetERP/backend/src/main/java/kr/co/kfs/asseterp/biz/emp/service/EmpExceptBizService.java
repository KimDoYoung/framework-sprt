package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.ExceptBizRes;
import kr.co.kfs.asseterp.biz.emp.dto.ExceptBizSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpExceptBizMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS Emp33_Lookup_ExceptBiz → server/emp/Emp33_ExceptBiz.java (selectByExceptBizCode L22 / update L28 / delete L33).
 * 회사는 로그인 회사로 채우고, 수정·삭제도 로그인 회사 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpExceptBizService {

    private final EmpExceptBizMapper mapper;

    /** AS-IS selectByExceptBizCode */
    public List<ExceptBizRes> search(UserPrincipal user, String exceptBizCode) {
        return mapper.selectByExceptBizCode(user.getCompanyId(), exceptBizCode);
    }

    /** AS-IS update(UpdateDataModel): 고친 행은 고치고(없으면 넣고) 저장된 행으로 돌려준다(요청과 같은 순서) */
    @Transactional
    public List<ExceptBizRes> save(UserPrincipal user, List<ExceptBizSaveReq> rows) {
        Long companyId = user.getCompanyId();
        return rows.stream().map(r -> {
            long id = (r.exceptBizId() == null || r.exceptBizId() <= 0) ? mapper.selectNextId() : r.exceptBizId();
            ExceptBizSaveReq row = new ExceptBizSaveReq(id, r.personId(), r.exceptBizCode(), r.startDate(), r.closeDate(), r.reason(), r.unvisibleYn());
            if (mapper.update(companyId, row) == 0) {
                mapper.insert(companyId, row);
            }
            return mapper.selectById(id, companyId);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids.stream().mapToInt(id -> mapper.deleteById(user.getCompanyId(), id)).sum();
    }
}
