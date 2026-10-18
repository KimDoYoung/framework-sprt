package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateDocTypeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateDocTypeSaveReq;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrRelateDocTypeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/dcr/Dcr06_RelateDocType.java (selectByClassTreeId L32 / update L42 / delete L47) — 문서구분에 연결한 문서양식 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrRelateDocTypeService {

    private final DcrRelateDocTypeMapper mapper;

    public List<DcrRelateDocTypeRes> search(Long classTreeId) {
        return mapper.selectByClassTreeId(classTreeId);
    }

    /** AS-IS update(UpdateDataModel): 새 행(임시 ID 0 이하)은 INSERT(회사 = 로그인 회사), 아니면 UPDATE → 저장된 행(요청 순서) */
    @Transactional
    public List<DcrRelateDocTypeRes> save(UserPrincipal user, List<DcrRelateDocTypeSaveReq> rows) {
        List<DcrRelateDocTypeRes> saved = new ArrayList<>();
        for (DcrRelateDocTypeSaveReq req : rows) {
            boolean isNew = req.relateDocTypeId() == null || req.relateDocTypeId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.relateDocTypeId();
            if (isNew) {
                mapper.insert(id, user.getCompanyId(), req);
            } else if (mapper.update(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 회사 조건을 더했다(05 §6) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
