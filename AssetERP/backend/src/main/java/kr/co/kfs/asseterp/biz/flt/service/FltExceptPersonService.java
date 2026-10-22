package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.ExceptPersonRes;
import kr.co.kfs.asseterp.biz.flt.dto.ExceptPersonSaveReq;
import kr.co.kfs.asseterp.biz.flt.mapper.FltExceptPersonMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/flt/Flt16_ExceptPerson.java (selectByCompanyId L25, update L31, delete L51) — J09 예외사원. 로그인 회사의 행만 다룬다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltExceptPersonService {

    private final FltExceptPersonMapper mapper;

    public List<ExceptPersonRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS update L31-49: 행마다 사원 중복을 검사하고(하나라도 있으면 전체 중단) UpdateDataModel처럼 저장한 뒤 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<ExceptPersonRes> update(UserPrincipal user, List<ExceptPersonSaveReq> rows) {
        for (ExceptPersonSaveReq req : rows) {
            if (req.personId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사원을 선택하세요");
            }
            long selfId = req.exceptPersonId() == null ? 0L : req.exceptPersonId();
            if (mapper.countByPersonId(user.getCompanyId(), req.personId(), selfId) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "[" + req.personName() + "] 사원은 이미 등록되어 있습니다");
            }
        }
        List<ExceptPersonRes> saved = new ArrayList<>();
        for (ExceptPersonSaveReq req : rows) {
            boolean isNew = req.exceptPersonId() == null || req.exceptPersonId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.exceptPersonId();
            if (isNew) {
                mapper.insertExceptPerson(id, user.getCompanyId(), req);
            } else if (mapper.updateExceptPerson(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 회사 조건을 더했다(05 §6) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteExceptPersons(user.getCompanyId(), ids);
    }
}
