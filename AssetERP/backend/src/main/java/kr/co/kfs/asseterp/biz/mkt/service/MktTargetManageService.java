package kr.co.kfs.asseterp.biz.mkt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.dto.MktFavoriteRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktItemTypeRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktTargetCompanyRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktTargetCompanySaveReq;
import kr.co.kfs.asseterp.biz.mkt.mapper.MktTargetManageMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import kr.co.kfs.asseterp.common.util.Texts;

/**
 * Z05 Mkt01_Tab_TargetCompany·Mkt01_Grid_TargetCompany·Mkt01_Lookup_TargetCompany·Mkt01_Lookup_SelectCompany·Mkt01_Lookup_Favorite
 * → server/mkt/Mkt01_TargetCompany.java (selectById L18, selectByCompanyIdPaging L28, selectFavoritePaging L52, updateOne L58, delete L71),
 *   Mkt03_History.checkByTargetCompanyId L34, sys.Sys09_Code.selectByCode L100, sys.Sys99_Print.insertRdTargetCompany L4945
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MktTargetManageService {

    /** AS-IS 원본이 `"%" + "Mkt01" + "%"`를 창 이름으로 보낸다(LIKE에도, 저장 값에도 그대로) */
    private static final String PRINT_WINDOW = "%Mkt01%";

    private final MktTargetManageMapper mapper;

    /** AS-IS Mkt01_Tab_TargetCompany.retrieve → sys.Sys09_Code.selectByCode(companyId, "CrmItemTypeCode") */
    public List<MktItemTypeRes> searchItemTypes(UserPrincipal user) {
        return mapper.selectItemTypes(user.getCompanyId(), "CrmItemTypeCode");
    }

    /** AS-IS Mkt01_Grid_TargetCompany 생성자 L108 — erpProductCode가 A1인 회사만 아래에 업무활동내역을 둔다 */
    public boolean historyEnabled(UserPrincipal user) {
        return mapper.selectHistoryEnabled(user.getCompanyId());
    }

    /** AS-IS getSeq — 새 활동처를 열 때 받는 ID */
    @Transactional
    public long nextId() {
        return mapper.selectNextId();
    }

    /** AS-IS mkt.Mkt01_TargetCompany.selectByCompanyIdPaging (itemTypeCode `%`면 전체) */
    public PageRes<MktTargetCompanyRes> search(UserPrincipal user, String itemTypeCode, boolean unUseYn, String searchText, long offset, long limit) {
        String type = itemTypeCode == null || itemTypeCode.isEmpty() ? "%" : itemTypeCode;
        String text = Texts.like(searchText);
        return new PageRes<>(mapper.selectByCompanyIdTotal(user.getCompanyId(), type, unUseYn, text),
                mapper.selectByCompanyIdPaging(user.getCompanyId(), type, unUseYn, text, offset, limit));
    }

    /** AS-IS mkt.Mkt01_TargetCompany.selectById */
    public MktTargetCompanyRes get(UserPrincipal user, Long id) {
        MktTargetCompanyRes res = mapper.selectById(user.getCompanyId(), id);
        if (res == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return res;
    }

    /** AS-IS mkt.Mkt01_TargetCompany.updateOne (UpdateDataModel: 있으면 UPDATE, 없으면 INSERT) → selectById */
    @Transactional
    public MktTargetCompanyRes save(UserPrincipal user, MktTargetCompanySaveReq req) {
        if (req.targetCompanyId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "활동처 ID가 없습니다.");
        }
        if (req.itemTypeCode() == null || req.itemTypeCode().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "활동처구분을 선택하세요");
        }
        if (req.targetCompanyName() == null || req.targetCompanyName().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "활동처를 입력하세요");
        }
        MktTargetCompanySaveReq row = new MktTargetCompanySaveReq(req.targetCompanyId(), req.itemTypeCode(), req.targetCompanyName().trim(),
                req.addr(), req.tel(), req.note(), req.unuseYn());
        if (mapper.updateOne(user.getCompanyId(), row) == 0) {
            mapper.insertOne(user.getCompanyId(), row);
        }
        return get(user, req.targetCompanyId());
    }

    /** AS-IS mkt.Mkt03_History.checkByTargetCompanyId — 업무활동내역이 있는 활동처 수(0이면 지워도 된다) */
    public int checkHistories(UserPrincipal user, List<Long> ids) {
        int count = 0;
        for (Long id : ids) {
            if (mapper.countHistories(user.getCompanyId(), id) != 0) {
                count++;
            }
        }
        return count;
    }

    /** AS-IS mkt.Mkt01_TargetCompany.delete — 담당자·공유 정보를 먼저 지우고 활동처 삭제. 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        int count = 0;
        for (Long id : ids) {
            mapper.deleteManagersByTarget(user.getCompanyId(), id);
            mapper.deleteSharesByParent(user.getCompanyId(), id);
            count += mapper.deleteTarget(user.getCompanyId(), id);
        }
        return count;
    }

    /** AS-IS mkt.Mkt01_TargetCompany.selectFavoritePaging·selectFavoriteTotal */
    public PageRes<MktFavoriteRes> searchFavorites(UserPrincipal user, String searchText, long offset, long limit) {
        return new PageRes<>(mapper.selectFavoriteTotal(user.getCompanyId(), user.getUserId()),
                mapper.selectFavoritePaging(user.getCompanyId(), user.getUserId(), Texts.like(searchText), offset, limit));
    }

    /** AS-IS sys.Sys99_Print.insertRdTargetCompany L4945 → 새 groupId */
    @Transactional
    public String insertRdDownload(UserPrincipal user) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), PRINT_WINDOW);
        mapper.insertPrint(user.getCompanyId(), user.getUserId(), PRINT_WINDOW, groupId);
        return String.valueOf(groupId);
    }
}
