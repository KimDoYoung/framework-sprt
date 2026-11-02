package kr.co.kfs.asseterp.biz.mkt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.dto.MktFavoriteAddReq;
import kr.co.kfs.asseterp.biz.mkt.mapper.MktFavoriteMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Z05 Mkt01_Lookup_Favorite → server/mkt/Mkt06_Favorite.java (modelUpdate L32, deleteList L51) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MktFavoriteService {

    private final MktFavoriteMapper mapper;

    /** AS-IS mkt.Mkt06_Favorite.modelUpdate 반복 — 사원은 로그인 사용자, 중복 검사는 원본에도 없다. 등록 건수 */
    @Transactional
    public int add(UserPrincipal user, List<MktFavoriteAddReq> items) {
        int count = 0;
        for (MktFavoriteAddReq item : items) {
            if (item.managerId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "담당자만 선택 가능합니다.");
            }
            mapper.insertOne(mapper.selectNextId(), user.getUserId(), item.targetCompanyId(), item.managerId());
            count++;
        }
        return count;
    }

    /** AS-IS mkt.Mkt06_Favorite.deleteList(deleteFavoriteId) — 내 즐겨찾기만. 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> favoriteIds) {
        return favoriteIds == null || favoriteIds.isEmpty() ? 0 : mapper.deleteByIds(user.getUserId(), favoriteIds);
    }
}
