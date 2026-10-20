package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.ClassTreeRes;
import kr.co.kfs.asseterp.biz.ics.dto.ClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsClassTreeItemRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsWriteTreeRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsClassTreeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/ics/Ics01_ClassTree.java 중 분류 트리 (selectByCompanyId L28 / update L317 / deleteAll L275) + Ics01_Edit_ClassTree·Ics01_Move_TreeGrid.
 * 법규관리(관리자)는 기초자료 메뉴라 쓰기는 관리자 회사만 한다(보안 보강 — 원본은 메뉴가 admin 회사에만 있어서 막힘)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsClassTreeService {

    private final IcsClassTreeMapper mapper;

    /** AS-IS selectByCompanyId(typeCode): 사용 중인 분류를 전위 순서로(IC 내부통제 분류, IT 내부통제 구분) */
    public List<ClassTreeRes> searchTree(String typeCode) {
        return mapper.selectTree(typeCode);
    }

    /**
     * AS-IS IcsComboBoxField.retrieve·Ics01_Lookup_CheckList.retrieve (H04): parentTreeId가 있으면 selectByParentTreeId(바로 아래 분류),
     * 없으면 selectByAll(최상위를 뺀 모든 분류). 검색어는 분류명 %…%
     */
    public List<IcsClassTreeItemRes> searchItems(Long parentTreeId, String searchText) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return parentTreeId != null ? mapper.selectChildren(parentTreeId, like) : mapper.selectAllItems(like);
    }

    /** AS-IS Ics01_Tab_ApprList.retrieve: selectByCompanyId(typeCode %) — 법규분류(IC)와 법규구분(IT) 모두 */
    public List<IcsWriteTreeRes> searchWriteTree() {
        return mapper.selectWriteTree("%");
    }

    /** AS-IS Ics01_Tab_ClassTree.insertIcsClass → Ics01_Edit_ClassTree.update: 새 id·회사·구분 IC·사용 true, 조회순서 = 분류코드 */
    @Transactional
    public ClassTreeRes create(UserPrincipal user, ClassTreeSaveReq req) {
        requireSysAdmin(user);
        validate(req);
        if (req.parentTreeId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상위분류가 없습니다");
        }
        if (req.parentTreeId() != 0 && mapper.countById(req.parentTreeId()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        long newId = mapper.selectNextId();
        mapper.insertTreeNode(newId, withSeq(req), user.getCompanyId());
        return mapper.selectTreeNodeById(newId);
    }

    /** AS-IS Ics01_Edit_ClassTree.update (edit): 분류코드·분류명, 조회순서 = 분류코드 */
    @Transactional
    public ClassTreeRes update(UserPrincipal user, Long classTreeId, ClassTreeSaveReq req) {
        requireSysAdmin(user);
        validate(req);
        if (mapper.updateTreeNode(classTreeId, withSeq(req)) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectTreeNodeById(classTreeId);
    }

    /** AS-IS Ics01_Move_TreeGrid.moveTree / Ics01_Move_Grid.moveTree: 상위 분류를 바꾼다 */
    @Transactional
    public void move(UserPrincipal user, Long classTreeId, Long parentTreeId) {
        requireSysAdmin(user);
        if (parentTreeId == null || mapper.countById(parentTreeId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        // 원본에는 없는 보호: 자기 자신이나 자기 하위로 옮기면 트리에서 사라진다
        if (mapper.selectDownTreeIds(classTreeId).contains(parentTreeId)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "자기 자신이나 하위 분류로는 이동할 수 없습니다");
        }
        if (mapper.updateParent(classTreeId, parentTreeId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    /** AS-IS Ics01_ClassTree.deleteAll: 자신과 모든 하위(법규 포함)를 삭제 이력(ics99)에 남기고 지운다 → 지운 건수 */
    @Transactional
    public int deleteAll(UserPrincipal user, Long classTreeId) {
        requireSysAdmin(user);
        List<Long> ids = mapper.selectDownTreeIds(classTreeId);
        for (Long id : ids) {
            mapper.insertDeleteHistory(id, user.getUserId());
            mapper.deleteById(id);
        }
        return ids.size();
    }

    private static ClassTreeSaveReq withSeq(ClassTreeSaveReq req) {
        return new ClassTreeSaveReq(req.parentTreeId(), req.classTreeCode(), req.classTreeName(), req.classTreeCode());
    }

    /** 분류코드·분류명은 DB가 필수(원본은 DB 오류 "update fail"로 알림 → 미리 막는다) */
    private static void validate(ClassTreeSaveReq req) {
        if (req.classTreeCode() == null || req.classTreeCode().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "분류코드를 입력해주세요");
        }
        if (req.classTreeName() == null || req.classTreeName().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "분류명을 입력해주세요");
        }
    }

    static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
