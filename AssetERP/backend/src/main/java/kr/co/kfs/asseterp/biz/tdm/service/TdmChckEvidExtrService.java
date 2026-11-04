package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckEvidExtrReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckEvidExtrRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmChckEvidExtrMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/tdm/Tdm64_ChckEvidExtr.java (EE49 외부보관 증빙자료 — 이행점검·미흡 조치기록에 달린 타 시스템 문서정보) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmChckEvidExtrService {

    private final TdmChckEvidExtrMapper mapper;

    /** AS-IS selectByTargetId */
    public List<ChckEvidExtrRes> search(UserPrincipal user, Long targetId) {
        requireTarget(user, targetId);
        return mapper.selectByTargetId(targetId);
    }

    /** AS-IS update(UpdateDataModel): ID가 0 이하면 INSERT, 아니면 UPDATE → 다시 읽은 목록 */
    @Transactional
    public List<ChckEvidExtrRes> save(UserPrincipal user, Long targetId, List<ChckEvidExtrReq> rows) {
        requireTarget(user, targetId);
        List<Long> owned = mapper.selectIdsByTargetId(targetId);
        for (ChckEvidExtrReq r : rows) {
            if (r.chckEvidExtrId() == null || r.chckEvidExtrId() <= 0) {
                mapper.insertEvid(mapper.selectNextId(), targetId, r, user.getName());
            } else if (!owned.contains(r.chckEvidExtrId()) || mapper.updateEvid(targetId, r, user.getName()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return mapper.selectByTargetId(targetId);
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, Long targetId, List<Long> ids) {
        requireTarget(user, targetId);
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteEvids(targetId, ids);
    }

    private void requireTarget(UserPrincipal user, Long targetId) {
        if (targetId == null || mapper.countTarget(user.getCompanyId(), targetId) == 0) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
