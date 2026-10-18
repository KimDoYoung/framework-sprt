package kr.co.kfs.asseterp.biz.crd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCompanyRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCompanySaveReq;
import kr.co.kfs.asseterp.biz.crd.mapper.CrdExcelCompanyMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/crd/Crd10_ExcelCompany.java (selectByCompanyId L25 / update L33 / delete L38).
 * 로그인 회사의 행만 다룬다 — 조회는 로그인 회사, 저장·삭제는 회사 조건을 걸어 다른 회사 행을 못 고친다(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrdExcelCompanyService {

    private final CrdExcelCompanyMapper mapper;

    public List<CrdExcelCompanyRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /**
     * AS-IS update(UpdateDataModel): 있는 행은 고치고, 없는 행은 새 id로 넣는다 → 저장된 행(요청 순서).
     * 카드사 필수·중복 검사는 화면이 하고, 서버는 DB 오류(NOT NULL)를 막으려고 필수만 같은 문구로 막는다
     */
    @Transactional
    public List<CrdExcelCompanyRes> save(UserPrincipal user, List<CrdExcelCompanySaveReq> rows) {
        for (CrdExcelCompanySaveReq req : rows) {
            if (req.bankCode() == null || req.bankCode().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "카드사는 필수선택항목입니다.");
            }
        }
        return rows.stream().map(req -> {
            boolean exists = req.excelCompanyId() != null && req.excelCompanyId() > 0 && mapper.selectById(req.excelCompanyId()) != null;
            if (exists) {
                if (mapper.update(user.getCompanyId(), req) == 0) {
                    throw new BusinessException(ErrorCode.ACCESS_DENIED);
                }
                return mapper.selectById(req.excelCompanyId());
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, user.getCompanyId(), req);
            return mapper.selectById(newId);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
