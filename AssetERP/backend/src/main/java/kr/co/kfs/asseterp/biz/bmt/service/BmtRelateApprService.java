package kr.co.kfs.asseterp.biz.bmt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtRelateApprRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtRelateApprSaveReq;
import kr.co.kfs.asseterp.biz.bmt.mapper.BmtRelateApprMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS Bmt20_Lookup_RelateAppr → server/bmt/Bmt20_RelateAppr.java (selectByInfoId L25 / modelUpdate L34 / delete L52) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BmtRelateApprService {

    private final BmtRelateApprMapper mapper;

    public List<BmtRelateApprRes> search(UserPrincipal user, Long infoId) {
        return mapper.selectByInfoId(user.getCompanyId(), infoId);
    }

    /** AS-IS modelUpdate → 새 ID로 INSERT(같은 문서를 또 연결해도 막지 않는다 — 원본 그대로) */
    @Transactional
    public Long create(UserPrincipal user, BmtRelateApprSaveReq req) {
        if (req.infoId() == null || req.apprId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "연결할 문서를 선택해주세요.");
        }
        long id = mapper.selectNextId();
        mapper.insert(id, user.getCompanyId(), req.infoId(), req.apprId());
        return id;
    }

    @Transactional
    public int delete(UserPrincipal user, List<Long> relateApprIds) {
        if (relateApprIds == null || relateApprIds.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(user.getCompanyId(), relateApprIds);
    }
}
