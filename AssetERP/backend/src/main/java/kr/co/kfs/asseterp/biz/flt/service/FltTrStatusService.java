package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.TrStatusRes;
import kr.co.kfs.asseterp.biz.flt.dto.TrStatusSaveReq;
import kr.co.kfs.asseterp.biz.flt.mapper.FltTrStatusMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/flt/Flt15_TrStatus.java (selectByPersonId L23, update L38) — 임직원매매현황 메모 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltTrStatusService {

    private final FltTrStatusMapper mapper;

    /** AS-IS selectByPersonId — 그 사원·기준일의 행이 없으면 만들어서(insert) 다시 읽는다 */
    @Transactional
    public TrStatusRes get(UserPrincipal user, Long personId, String stdDate) {
        TrStatusRes row = mapper.selectByPersonId(user.getCompanyId(), personId, stdDate);
        if (row == null) {
            mapper.insert(user.getCompanyId(), personId, stdDate);
            row = mapper.selectByPersonId(user.getCompanyId(), personId, stdDate);
        }
        return row;
    }

    /** AS-IS update — note를 저장하고 저장된 행을 돌려준다 */
    @Transactional
    public TrStatusRes update(UserPrincipal user, TrStatusSaveReq req) {
        if (mapper.updateNote(user.getCompanyId(), req.trStatusId(), req.note()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(user.getCompanyId(), req.trStatusId());
    }
}
