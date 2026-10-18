package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateIcrRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateSaveReq;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrClassTreeMapper;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrRelateIcrMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS server/dcr/Dcr21_RelateIcr.java (selectByDcrClassTreeId L26 / update L38 / delete L64) — 문서구분에 연결한 내규.
 * Dcr20_RelateIcs와 같은 구조(admin 회사의 문서구분이면 다른 회사 분류에도 전파)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrRelateIcrService {

    private final DcrRelateIcrMapper mapper;
    private final DcrClassTreeMapper classTreeMapper;

    public List<DcrRelateIcrRes> search(Long dcrClassTreeId) {
        return mapper.selectByDcrClassTreeId(dcrClassTreeId);
    }

    @Transactional
    public List<DcrRelateIcrRes> save(UserPrincipal user, List<DcrRelateSaveReq> rows) {
        List<DcrRelateIcrRes> saved = new ArrayList<>();
        for (DcrRelateSaveReq req : rows) {
            DcrClassTreeRes tree = classTreeMapper.selectTreeRowById(req.dcrClassTreeId());
            if (tree == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            if (tree.companyId() == 0L) {
                for (DcrClassTreeRes copy : classTreeMapper.selectAdminCopiesByCode(tree.classTreeCode())) {
                    mapper.insert(mapper.selectNextId(), copy.classTreeId(), req.targetClassTreeId(), copy.companyId(), null);
                }
            }
            Long id = mapper.selectNextId();
            mapper.insert(id, req.dcrClassTreeId(), req.targetClassTreeId(), user.getCompanyId(), req.note());
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        for (DcrRelateIcrRes r : mapper.selectByIds(user.getCompanyId(), ids)) {
            DcrClassTreeRes tree = classTreeMapper.selectTreeRowById(r.dcrClassTreeId());
            if (tree != null && tree.companyId() == 0L) {
                for (DcrClassTreeRes copy : classTreeMapper.selectAdminCopiesByCode(tree.classTreeCode())) {
                    mapper.deleteAll(copy.classTreeId(), r.icrClassTreeId(), copy.companyId());
                }
            }
        }
        return mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
