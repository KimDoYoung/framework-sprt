package kr.co.kfs.asseterp.biz.icr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeDeadlineRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeDetailRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeLookupRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeViewRes;
import kr.co.kfs.asseterp.biz.icr.mapper.IcrClassTreeMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/icr/Icr01_ClassTree.java 중 조회창이 쓰는 것 (selectByCompanyId L28 / selectById L22 / selectByTypeCodePaging L85 / selectByListIcrId L186)
 * + 내규관리(H09) 분류 트리 쓰기 (update L295 / deleteAll L253) — Icr01_Edit_ClassTree·Icr01_Move_TreeGrid.
 * 쓰기는 모두 로그인 회사의 분류만 다룬다(AS-IS는 클라이언트가 보낸 id를 그대로 믿는다)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcrClassTreeService {

    /** AS-IS Icr01_Lookup_SelectMulti.retrieve: 내규 구분은 'IT', 분류(트리)는 'IC' */
    private static final String RULE_TYPE_CODE = "IT";

    private final IcrClassTreeMapper mapper;

    /** AS-IS selectByCompanyId(companyId=로그인 회사, typeCode) */
    public List<IcrClassTreeRes> searchTree(UserPrincipal user, String typeCode) {
        return mapper.selectTree(user.getCompanyId(), typeCode);
    }

    /**
     * AS-IS Icr01_Lookup_SelectMulti.retrieve → selectByTypeCodePaging + selectByTypeCodePagingTotal: 내규(IT) 목록을 페이지로.
     * 내규검색·조문검색은 %…%, classTreeId가 있으면 그 분류와 모든 하위.
     * openUnConn(relateTable "TDM46", relateId=점검항목): 그 점검항목에 아직 연결 안 된 내규만(E13-3)
     */
    public PageRes<IcrClassTreeLookupRes> searchLookup(UserPrincipal user, Long classTreeId, String lawSearch, String statuteSearch,
                                                       boolean detailSearchYn, long offset, long limit, String relateTable, Long relateId) {
        String law = "%" + (lawSearch == null ? "" : lawSearch) + "%";
        String statute = "%" + (statuteSearch == null ? "" : statuteSearch) + "%";
        Long companyId = user.getCompanyId();
        return new PageRes<>(mapper.selectLookupTotal(companyId, classTreeId, RULE_TYPE_CODE, law, statute, detailSearchYn, relateTable, relateId),
                mapper.selectLookup(companyId, classTreeId, RULE_TYPE_CODE, law, statute, detailSearchYn, limit, offset, relateTable, relateId));
    }

    /**
     * AS-IS Icr01_Tab_ClassTreeView.retrieve(H03) → selectByTypeCodePaging + Total: 내규(IT) 목록을 페이지로.
     * 조회창과 같은 조건(내규검색·조문검색 %…%, 상세내용 포함, 분류와 모든 하위)에 열만 내규조회 그리드 것
     */
    public PageRes<IcrClassTreeViewRes> searchView(UserPrincipal user, Long classTreeId, String lawSearch, String statuteSearch,
                                                   boolean detailSearchYn, long offset, long limit) {
        String law = "%" + (lawSearch == null ? "" : lawSearch) + "%";
        String statute = "%" + (statuteSearch == null ? "" : statuteSearch) + "%";
        Long companyId = user.getCompanyId();
        return new PageRes<>(mapper.selectLookupTotal(companyId, classTreeId, RULE_TYPE_CODE, law, statute, detailSearchYn, null, null),
                mapper.selectView(companyId, classTreeId, RULE_TYPE_CODE, law, statute, detailSearchYn, limit, offset, null, null));
    }

    /** AS-IS selectByListIcrId: 고른 내규마다 그 기한(여럿이면 여러 행)을 붙인다 */
    public List<IcrClassTreeDeadlineRes> deadlines(List<Long> classTreeIds) {
        return classTreeIds.isEmpty() ? List.of() : mapper.selectDeadlines(classTreeIds);
    }

    /** AS-IS selectById: 내규상세 창(읽기 전용)의 값 */
    public IcrClassTreeDetailRes detail(Long classTreeId) {
        IcrClassTreeDetailRes row = mapper.selectDetail(classTreeId);
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return row;
    }

    /** AS-IS Icr01_Tab_ClassTree.insertIcsClass → Icr01_Edit_ClassTree.update: 새 id·회사·구분 IC·사용 true, 조회순서 = 분류코드 */
    @Transactional
    public IcrClassTreeRes create(UserPrincipal user, IcrClassTreeSaveReq req) {
        validate(req);
        Long companyId = user.getCompanyId();
        if (req.parentTreeId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상위분류가 없습니다");
        }
        if (req.parentTreeId() != 0 && mapper.countById(companyId, req.parentTreeId()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        long newId = mapper.selectNextId();
        mapper.insertTreeNode(newId, withSeq(req), companyId);
        return mapper.selectTreeNodeById(companyId, newId);
    }

    /** AS-IS Icr01_Edit_ClassTree.update (edit): 분류코드·분류명, 조회순서 = 분류코드 */
    @Transactional
    public IcrClassTreeRes update(UserPrincipal user, Long classTreeId, IcrClassTreeSaveReq req) {
        validate(req);
        Long companyId = user.getCompanyId();
        if (mapper.updateTreeNode(companyId, classTreeId, withSeq(req)) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectTreeNodeById(companyId, classTreeId);
    }

    /** AS-IS Icr01_Move_TreeGrid.moveTree / Icr01_Move_Grid.moveTree: 상위 분류를 바꾼다 */
    @Transactional
    public void move(UserPrincipal user, Long classTreeId, Long parentTreeId) {
        Long companyId = user.getCompanyId();
        if (parentTreeId == null || mapper.countById(companyId, parentTreeId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        // 원본에는 없는 보호: 자기 자신이나 자기 하위로 옮기면 트리에서 사라진다
        if (mapper.selectDownTreeIds(companyId, classTreeId).contains(parentTreeId)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "자기 자신이나 하위 분류로는 이동할 수 없습니다");
        }
        if (mapper.updateParent(companyId, classTreeId, parentTreeId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    /** AS-IS Icr01_ClassTree.deleteAll: 자신과 모든 하위(내규 포함)를 삭제 이력(icr99)에 남기고 지운다 → 지운 건수 */
    @Transactional
    public int deleteAll(UserPrincipal user, Long classTreeId) {
        Long companyId = user.getCompanyId();
        List<Long> ids = mapper.selectDownTreeIds(companyId, classTreeId);
        for (Long id : ids) {
            mapper.insertDeleteHistory(id, user.getUserId());
            mapper.deleteById(companyId, id);
        }
        return ids.size();
    }

    private static IcrClassTreeSaveReq withSeq(IcrClassTreeSaveReq req) {
        return new IcrClassTreeSaveReq(req.parentTreeId(), req.classTreeCode(), req.classTreeName(), req.classTreeCode());
    }

    /** 분류코드·분류명은 DB가 필수(원본은 DB 오류 "update fail"로 알림 → 미리 막는다) */
    private static void validate(IcrClassTreeSaveReq req) {
        if (req.classTreeCode() == null || req.classTreeCode().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "분류코드를 입력해주세요");
        }
        if (req.classTreeName() == null || req.classTreeName().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "분류명을 입력해주세요");
        }
    }
}
