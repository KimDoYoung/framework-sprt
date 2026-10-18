package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateIcsRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateSaveReq;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrClassTreeMapper;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrRelateIcsMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS server/dcr/Dcr20_RelateIcs.java (selectByDcrClassTreeId L26 / update L38 / delete L64) — 문서구분에 연결한 법규.
 * admin(0) 회사의 문서구분이면 같은 구분코드로 내려준(admin_yn) 다른 회사 분류에도 같은 연결을 더하고 지운다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrRelateIcsService {

    private final DcrRelateIcsMapper mapper;
    private final DcrClassTreeMapper classTreeMapper;

    public List<DcrRelateIcsRes> search(Long dcrClassTreeId) {
        return mapper.selectByDcrClassTreeId(dcrClassTreeId);
    }

    /** AS-IS update: 새 연결마다 (admin 회사면) 다른 회사 전파 insertAll → UpdateDataModel INSERT(회사 = 로그인 회사) → 저장된 행 */
    @Transactional
    public List<DcrRelateIcsRes> save(UserPrincipal user, List<DcrRelateSaveReq> rows) {
        List<DcrRelateIcsRes> saved = new ArrayList<>();
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

    /** AS-IS delete: 지울 연결마다 (admin 회사면) 다른 회사의 같은 연결 deleteAll → UpdateDataModel.deleteModel → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        for (DcrRelateIcsRes r : mapper.selectByIds(user.getCompanyId(), ids)) {
            DcrClassTreeRes tree = classTreeMapper.selectTreeRowById(r.dcrClassTreeId());
            if (tree != null && tree.companyId() == 0L) {
                for (DcrClassTreeRes copy : classTreeMapper.selectAdminCopiesByCode(tree.classTreeCode())) {
                    mapper.deleteAll(copy.classTreeId(), r.icsClassTreeId(), copy.companyId());
                }
            }
        }
        return mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
