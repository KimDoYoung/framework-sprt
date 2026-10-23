package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizRelateApprRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizRelateApprMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS Biz05_Lookup_RelateAppr·Biz01_Tab_Card(상신 상태) → server/biz/Biz05_RelateAppr.java (selectByPromoId L26 / selectByPersonId L62 / selectFileCount L92 / delete L213) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizRelateApprService {

    private final BizRelateApprMapper mapper;

    /** AS-IS selectByPersonId(companyId, dataYm, linkCode, personId = LoginUser) — 정확히 한 건일 때만 그 행, 아니면 null(미상신) */
    public BizRelateApprRes getByPerson(UserPrincipal user, String dataYm, String linkCode) {
        List<BizRelateApprRes> list = mapper.selectByPersonId(user.getCompanyId(), dataYm, linkCode, user.getUserId());
        return list.size() == 1 ? list.get(0) : null;
    }

    public List<BizRelateApprRes> searchByPromo(UserPrincipal user, Long promoId) {
        return mapper.selectByPromoId(user.getCompanyId(), promoId);
    }

    /** AS-IS selectFileCount → 'n건' */
    public String getFileCount(Long promoId) {
        return mapper.selectFileCount(promoId);
    }

    /** AS-IS delete(연결제거) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> relateApprIds) {
        return relateApprIds.stream().mapToInt(id -> mapper.deleteById(user.getCompanyId(), id)).sum();
    }
}
