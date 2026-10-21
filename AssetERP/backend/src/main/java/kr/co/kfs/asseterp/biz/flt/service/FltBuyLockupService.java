package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BuyLockupItemRes;
import kr.co.kfs.asseterp.biz.flt.dto.BuyLockupSaveReq;
import kr.co.kfs.asseterp.biz.flt.mapper.FltBuyLockupMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/flt/Flt08_BuyLockup.java (selectByText L25, update L76, delete L81) — J09 매수제한종목. 로그인 회사의 행만 다룬다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltBuyLockupService {

    private final FltBuyLockupMapper mapper;

    /** AS-IS selectByText: 제한구분은 `%`(전체) 또는 코드, 검색어는 `%…%`(클라이언트가 붙이던 것)로 종목코드+종목명을 찾는다 */
    public List<BuyLockupItemRes> search(UserPrincipal user, String lockupType, String searchText) {
        return mapper.selectByText(user.getCompanyId(), lockupType == null || lockupType.isBlank() ? "%" : lockupType,
                "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS update(UpdateDataModel): 신규(화면 임시 ID 0 이하)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<BuyLockupItemRes> update(UserPrincipal user, List<BuyLockupSaveReq> rows) {
        List<BuyLockupItemRes> saved = new ArrayList<>();
        for (BuyLockupSaveReq req : rows) {
            // 원본은 막지 않지만, 종목이 없으면 저장 뒤 selectById(INNER JOIN com50_item)가 행을 못 찾는다 — 원인이 분명하므로 미리 막는다(05 §6 DB 오류)
            if (req.itemCode() == null || req.itemCode().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "종목을 선택하세요");
            }
            boolean isNew = req.buyLockupId() == null || req.buyLockupId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.buyLockupId();
            if (isNew) {
                mapper.insertBuyLockup(id, user.getCompanyId(), req);
            } else if (mapper.updateBuyLockup(user.getCompanyId(), req) == 0) {
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
        return mapper.deleteBuyLockups(user.getCompanyId(), ids);
    }
}
