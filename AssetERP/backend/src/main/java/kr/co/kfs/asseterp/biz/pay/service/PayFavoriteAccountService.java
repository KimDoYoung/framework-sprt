package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.FavoriteAccountRes;
import kr.co.kfs.asseterp.biz.pay.dto.FavoriteAccountSeqReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayFavoriteAccountMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/pay/Pay52_FavoriteAccount.java (selectByCompanyId L24·insert L30·update L52·delete L57) — 자주 쓰는 계정과목 (U03) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayFavoriteAccountService {

    private final PayFavoriteAccountMapper mapper;

    private static String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }

    /** pay52_favorite_account.selectByCompanyId — 계정속성 콤보의 "전체"가 '%' */
    public List<FavoriteAccountRes> search(UserPrincipal user, String attributeCode, String searchText, boolean allAccountYn) {
        return mapper.selectByCompanyId(user.getCompanyId(), attributeCode == null ? "%" : attributeCode, like(searchText), allAccountYn);
    }

    /** AS-IS insert — 이미 등록된 계정과목은 건너뛴다. 다른 회사의 계정코드는 받지 않는다(TOBE 추가) */
    @Transactional
    public int insert(UserPrincipal user, List<Long> accountCodeIds) {
        int added = 0;
        for (Long accountCodeId : accountCodeIds) {
            if (mapper.countAccountCode(user.getCompanyId(), accountCodeId) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            if (mapper.countByAccountCodeId(user.getCompanyId(), accountCodeId) != 0) {
                continue; //이미 등록되어 있는 계정과목임. Skip~!!
            }
            mapper.insert(mapper.selectNextId(), user.getCompanyId(), accountCodeId);
            added++;
        }
        return added;
    }

    /** AS-IS update (UpdateDataModel) — 조회순서 */
    @Transactional
    public int updateSeq(UserPrincipal user, List<FavoriteAccountSeqReq> rows) {
        for (FavoriteAccountSeqReq row : rows) {
            if (mapper.updateSeq(user.getCompanyId(), row.favoriteAccountId(), row.seq()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return rows.size();
    }

    /** AS-IS delete */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
