package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawContentReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawDeadlineRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawDetailRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawLookupRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawSaveReq;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsClassTreeMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/ics/Ics01_ClassTree.java 중 법규 (selectByClassTreeId L43 / refresh L264 / update L317 / delete L322) — Ics01_Grid_IcsType.
 * 쓰기는 관리자 회사만 한다(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsLawService {

    /** AS-IS Ics01_Grid_IcsType.retrieve: 법규 구분은 'IT'(내부통제 구분) */
    private static final String TYPE_CODE = "IT";

    private final IcsClassTreeMapper mapper;

    /** AS-IS selectByClassTreeId: 고른 분류와 모든 하위의 법규. publicType 기본 '%', 검색어는 분류코드+법규명 LIKE */
    public List<IcsLawRes> search(UserPrincipal user, Long classTreeId, String publicType, String searchText, boolean advisYn) {
        String like = (searchText == null || searchText.isEmpty()) ? null : "%" + searchText + "%";
        String type = (publicType == null || publicType.isEmpty()) ? "%" : publicType;
        return mapper.selectLaws(classTreeId, user.getCompanyId(), TYPE_CODE, type, like, advisYn);
    }

    /**
     * AS-IS Ics01_Lookup_SelectMulti.retrieve → selectByTypeCodePaging + selectByTypeCodePagingTotal: 법규(IT) 목록을 페이지로.
     * 법규검색·조문검색은 %…%, classTreeId가 있으면 그 분류와 모든 하위
     */
    public PageRes<IcsLawLookupRes> searchLookup(UserPrincipal user, Long classTreeId, String lawSearch, String statuteSearch,
                                                 boolean detailSearchYn, long offset, long limit) {
        String law = "%" + (lawSearch == null ? "" : lawSearch) + "%";
        String statute = "%" + (statuteSearch == null ? "" : statuteSearch) + "%";
        Long companyId = user.getCompanyId();
        return new PageRes<>(mapper.selectLawLookupTotal(companyId, classTreeId, TYPE_CODE, law, statute, detailSearchYn),
                mapper.selectLawLookup(companyId, classTreeId, TYPE_CODE, law, statute, detailSearchYn, limit, offset));
    }

    /** AS-IS selectByListIcsId: 고른 법규마다 그 기한(여럿이면 여러 행)을 붙인다 */
    public List<IcsLawDeadlineRes> deadlines(List<Long> classTreeIds) {
        return classTreeIds.isEmpty() ? List.of() : mapper.selectLawDeadlines(classTreeIds);
    }

    /** AS-IS Ics01_ClassTree.selectById: 법규상세 창(읽기 전용)의 값 */
    public IcsLawDetailRes detail(Long classTreeId) {
        IcsLawDetailRes row = mapper.selectLawDetail(classTreeId);
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return row;
    }

    /** AS-IS refresh: 한 행을 다시 읽는다(조회창을 닫은 뒤) */
    public IcsLawRes refresh(UserPrincipal user, Long classTreeId) {
        IcsLawRes row = mapper.selectLawRefresh(classTreeId, user.getCompanyId());
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return row;
    }

    /**
     * AS-IS update(UpdateDataModel): 있는 행은 고치고, 없는 행(id ≤ 0 또는 DB에 없음)은 새 id로 넣는다 → 저장된 행(요청 순서).
     * 원본은 selectById 결과(주기·서식파일·개정이력·연결책무 열 없음)로 행을 바꾸지만 여기서는 전체 열을 돌려준다
     */
    @Transactional
    public List<IcsLawRes> save(UserPrincipal user, List<IcsLawSaveReq> rows) {
        IcsClassTreeService.requireSysAdmin(user);
        return rows.stream().map(req -> {
            if (req.classTreeName() == null || req.classTreeName().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "법규 내용을 입력해주세요");
            }
            if (req.classTreeCode() == null || req.classTreeCode().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "분류코드를 입력해주세요");
            }
            boolean exists = req.classTreeId() != null && req.classTreeId() > 0 && mapper.countById(req.classTreeId()) > 0;
            if (exists) {
                mapper.updateLaw(req);
                return mapper.selectLawRefresh(req.classTreeId(), user.getCompanyId());
            }
            if (req.parentTreeId() == null || mapper.countById(req.parentTreeId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            long newId = mapper.selectNextId();
            mapper.insertLaw(newId, req, user.getCompanyId());
            return mapper.selectLawRefresh(newId, user.getCompanyId());
        }).toList();
    }

    /** AS-IS delete(GridDeleteData → deleteModel): id마다 DELETE → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> classTreeIds) {
        IcsClassTreeService.requireSysAdmin(user);
        int count = 0;
        for (Long id : classTreeIds) {
            count += mapper.deleteLaw(id);
        }
        return count;
    }

    /** AS-IS Ics01_Lookup_Content.update → ics.Ics01_ClassTree.modelUpdate → 저장된 행 */
    @Transactional
    public IcsLawRes updateContent(UserPrincipal user, Long classTreeId, IcsLawContentReq req) {
        IcsClassTreeService.requireSysAdmin(user);
        if (req.classTreeName() == null || req.classTreeName().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "법규 내용을 입력해주세요");
        }
        if (req.classTreeCode() == null || req.classTreeCode().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "분류코드를 입력해주세요");
        }
        if (mapper.updateLawContent(classTreeId, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectLawRefresh(classTreeId, user.getCompanyId());
    }
}
