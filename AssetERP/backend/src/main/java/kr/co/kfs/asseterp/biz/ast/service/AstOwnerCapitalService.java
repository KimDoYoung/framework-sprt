package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.OwnerCapitalRes;
import kr.co.kfs.asseterp.biz.ast.dto.OwnerCapitalSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstOwnerCapitalMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/ast/Ast40_OwnerCapital.java (selectByDate L34 / update L44 / delete L49) — 자기자본 등록 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstOwnerCapitalService {

    private final AstOwnerCapitalMapper mapper;

    /** AS-IS selectByDate: 기준연도(yyyy)의 자기자본 */
    public List<OwnerCapitalRes> search(UserPrincipal user, String stdYear) {
        return mapper.selectByDate(user.getCompanyId(), stdYear == null ? "" : stdYear);
    }

    /** AS-IS update(UpdateDataModel): 있는 행은 고치고, 없는 행은 새 id로 넣는다 → 저장된 행(요청 순서). 기준일·금액은 NOT NULL이라 서버도 막는다 */
    @Transactional
    public List<OwnerCapitalRes> save(UserPrincipal user, List<OwnerCapitalSaveReq> rows) {
        for (OwnerCapitalSaveReq req : rows) {
            if (req.stdDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "기준일은 필수입력 항목입니다.");
            }
            if (req.amt() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "자기자본금은 필수입력 항목입니다.");
            }
        }
        return rows.stream().map(req -> {
            boolean exists = req.ownerCapitalId() != null && req.ownerCapitalId() > 0
                    && mapper.selectById(user.getCompanyId(), req.ownerCapitalId()) != null;
            if (exists) {
                mapper.update(user.getCompanyId(), req);
                return mapper.selectById(user.getCompanyId(), req.ownerCapitalId());
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, user.getCompanyId(), req);
            return mapper.selectById(user.getCompanyId(), newId);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
