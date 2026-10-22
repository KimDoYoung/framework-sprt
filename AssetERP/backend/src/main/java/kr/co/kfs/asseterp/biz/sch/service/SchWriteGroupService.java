package kr.co.kfs.asseterp.biz.sch.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch22WriteGroupRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch22WriteGroupSaveReq;
import kr.co.kfs.asseterp.biz.sch.mapper.SchWriteGroupMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS Sch22_Lookup_WriteGroup·Sch02_Page_Share → server/sch/Sch22_WriteGroup.java (selectByCompanyId L23 / update L52 / delete L57 / checkByWriteGroupId L47)
 * + Sch02_Share.java (selectByInfoId2 L45 / update L90 / delete L95 / checkWriteGroup L78 / deleteByInfoId L69). 회사는 로그인 회사로 채우고 조회·수정·삭제도 그 회사 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchWriteGroupService {

    private final SchWriteGroupMapper mapper;

    /** AS-IS Sch22_WriteGroup.selectByCompanyId */
    public List<Sch22WriteGroupRes> search(UserPrincipal user) {
        return mapper.selectByCompanyId(user.getCompanyId());
    }

    /** AS-IS Sch22_WriteGroup.update(UpdateDataModel): id가 없는(≤ 0) 행은 INSERT, 있으면 UPDATE. 저장한 행을 요청 순서로 돌려준다 */
    @Transactional
    public List<Sch22WriteGroupRes> save(UserPrincipal user, List<Sch22WriteGroupSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<Sch22WriteGroupRes> saved = new ArrayList<>();
        for (Sch22WriteGroupSaveReq req : rows) {
            Long id = req.writeGroupId();
            if (id == null || id <= 0) {
                id = mapper.selectNextId();
                mapper.insertGroup(companyId, id, req.writeGroupName(), req.confirmerId());
            } else {
                requireGroup(companyId, id);
                mapper.updateGroup(companyId, id, req.writeGroupName(), req.confirmerId());
            }
            saved.add(mapper.selectById(companyId, id));
        }
        return saved;
    }

    /** AS-IS checkByWriteGroupId: 일일점검·체크리스트에서 쓰는 그룹이면 true */
    public boolean inUse(Long writeGroupId) {
        return mapper.countUse(writeGroupId) > 0;
    }

    /** AS-IS delete(): 그룹의 공유(deleteByInfoId)를 먼저 지우고 그룹을 지운다 → 지운 그룹 수 */
    @Transactional
    public int delete(UserPrincipal user, Long writeGroupId) {
        mapper.deleteSharesByInfoId(user.getCompanyId(), writeGroupId);
        return mapper.deleteGroup(user.getCompanyId(), writeGroupId);
    }

    /** AS-IS Sch02_Share.selectByInfoId2 */
    public List<Sch02ShareRes> searchShares(UserPrincipal user, Long writeGroupId) {
        return mapper.selectSharesByInfoId(user.getCompanyId(), writeGroupId);
    }

    /** AS-IS Sch02_Share.update(UpdateDataModel): 새 행(≤ 0)은 INSERT(구분·직원·부서·적용기간), 있는 행은 적용기간 UPDATE. 저장한 행을 요청 순서로 */
    @Transactional
    public List<Sch02ShareRes> saveShares(UserPrincipal user, Long writeGroupId, List<Sch02ShareSaveReq> rows) {
        Long companyId = user.getCompanyId();
        requireGroup(companyId, writeGroupId);
        List<Sch02ShareRes> saved = new ArrayList<>();
        for (Sch02ShareSaveReq req : rows) {
            Long shareId = req.shareId();
            if (shareId == null || shareId <= 0) {
                shareId = mapper.selectNextId();
                mapper.insertShare(companyId, writeGroupId, shareId, req);
            } else {
                mapper.updateShare(companyId, writeGroupId, req);
            }
            saved.add(mapper.selectShareById(companyId, shareId));
        }
        return saved;
    }

    /** AS-IS Sch02_Share.checkWriteGroup: 확인된 작성내역이 있는 공유가 하나라도 있으면 "작성내역이 존재하여 삭제할 수 없습니다" */
    public void checkDeleteShares(List<Long> shareIds) {
        for (Long shareId : shareIds) {
            if (mapper.countShareWrites(shareId) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "작성내역이 존재하여 삭제할 수 없습니다");
            }
        }
    }

    /** AS-IS Sch02_Share.delete(UpdateDataModel.deleteModel) → 지운 수 */
    @Transactional
    public int deleteShares(UserPrincipal user, Long writeGroupId, List<Long> shareIds) {
        if (shareIds == null || shareIds.isEmpty()) {
            return 0;
        }
        requireGroup(user.getCompanyId(), writeGroupId);
        return mapper.deleteShares(user.getCompanyId(), writeGroupId, shareIds);
    }

    private void requireGroup(Long companyId, Long writeGroupId) {
        if (mapper.selectById(companyId, writeGroupId) == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}
