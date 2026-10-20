package kr.co.kfs.asseterp.biz.icr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeDeadlineRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeDetailRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeLookupRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeViewRes;
import kr.co.kfs.asseterp.biz.icr.mapper.IcrClassTreeMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/icr/Icr01_ClassTree.java 중 조회창이 쓰는 것 (selectByCompanyId L28 / selectById L22 / selectByTypeCodePaging L85 / selectByListIcrId L186) */
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
}
