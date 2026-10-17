package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.ItemTypeCopyReq;
import kr.co.kfs.asseterp.biz.flt.dto.ItemTypeRes;
import kr.co.kfs.asseterp.biz.flt.dto.ItemTypeSaveReq;
import kr.co.kfs.asseterp.biz.flt.mapper.FltItemTypeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS server/flt/Flt05_ItemType.java (selectBySearchText L24 / insertInitData L58 / update L71 / delete L76)
 * — 왼쪽은 로그인 회사, 오른쪽은 고른 고객사(companyId)의 종목유형. 다른 회사를 다루는 것은 관리자 회사만
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltItemTypeService {

    private final FltItemTypeMapper mapper;

    /** AS-IS selectBySearchText: 유형명 LIKE (왼쪽은 "%검색어%", 오른쪽은 "%") */
    public List<ItemTypeRes> search(UserPrincipal user, Long companyId, String searchText) {
        return mapper.selectBySearchText(targetCompany(user, companyId), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS update(UpdateDataModel): 신규(화면 임시 ID 0 이하)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<ItemTypeRes> update(UserPrincipal user, Long companyId, List<ItemTypeSaveReq> rows) {
        Long target = targetCompany(user, companyId);
        List<ItemTypeRes> saved = new ArrayList<>();
        for (ItemTypeSaveReq req : rows) {
            boolean isNew = req.itemTypeId() == null || req.itemTypeId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.itemTypeId();
            if (isNew) {
                mapper.insertItemType(id, target, req);
            } else if (mapper.updateItemType(target, req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 회사 조건을 더했다(05 §6) */
    @Transactional
    public int delete(UserPrincipal user, Long companyId, List<Long> ids) {
        Long target = targetCompany(user, companyId);
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteItemTypes(target, ids);
    }

    /** AS-IS insertInitData: 고른 종목유형을 고객사로 복사(기존 행은 지우지 않는다 — 원본 동작) → 복사한 건수. 관리자 회사만 */
    @Transactional
    public int insertInitData(UserPrincipal user, ItemTypeCopyReq req) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        if (req.companyId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "고객사를 선택해주세요");
        }
        List<Long> ids = req.itemTypeIds() == null ? List.of() : req.itemTypeIds();
        int count = 0;
        for (Long id : ids) {
            count += mapper.insertInitData(req.companyId(), id);
        }
        return count;
    }

    /** 대상 회사: 없거나 로그인 회사면 로그인 회사, 다른 회사는 관리자 회사만(클라이언트 값을 그냥 믿지 않는다) */
    private Long targetCompany(UserPrincipal user, Long companyId) {
        if (companyId == null || companyId.equals(user.getCompanyId())) {
            return user.getCompanyId();
        }
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return companyId;
    }
}
