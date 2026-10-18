package kr.co.kfs.asseterp.biz.com.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.com.dto.Com50ItemRes;
import kr.co.kfs.asseterp.biz.com.dto.Com50ItemSaveReq;
import kr.co.kfs.asseterp.biz.com.mapper.ComItemMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/com/Com50_Item.java (selectByTextPaging L30 / update L37 / delete L57) — 종목정보. 쓰기(등록 모드)는 관리자 회사만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ComItemService {

    private final ComItemMapper mapper;

    /** AS-IS selectByTextPaging + selectByTextPagingTotal: 화면이 itemType(2010 주식)과 "%검색어%"를 보낸다 */
    public PageRes<Com50ItemRes> searchPaging(String itemType, String searchText, int limit, int offset) {
        String text = "%" + (searchText == null ? "" : searchText) + "%";
        return new PageRes<>(mapper.selectByTextPagingTotal(itemType, text), mapper.selectByTextPaging(itemType, text, limit, offset));
    }

    /** AS-IS update: 종목코드가 이미 있으면 "이미 등록된 종목코드 입니다 [코드]"로 막고(원본은 한 행씩 검사), UpdateDataModel처럼 저장하고 다시 읽는다 */
    @Transactional
    public List<Com50ItemRes> update(UserPrincipal user, List<Com50ItemSaveReq> rows) {
        requireAdminCompany(user);
        for (Com50ItemSaveReq req : rows) {
            if (mapper.checkItemCode(req.itemId() == null ? 0L : req.itemId(), req.itemCode()) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 등록된 종목코드 입니다 [" + req.itemCode() + "]");
            }
        }
        List<Com50ItemRes> saved = new ArrayList<>();
        for (Com50ItemSaveReq req : rows) {
            boolean isNew = req.itemId() == null || req.itemId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.itemId();
            if (isNew) {
                mapper.insertItem(id, req);
            } else if (mapper.updateItem(req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireAdminCompany(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteItems(ids);
    }

    private static void requireAdminCompany(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
