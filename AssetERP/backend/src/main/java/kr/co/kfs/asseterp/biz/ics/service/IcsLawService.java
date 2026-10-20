package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsCompanyInfoRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsCompanyInfoSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawContentReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawDeadlineRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawDetailRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawExceptRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawLookupRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawManageRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawPeriodRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawViewRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawSaveReq;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsClassTreeMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
     * 법규검색·조문검색은 %…%, classTreeId가 있으면 그 분류와 모든 하위.
     * openUnConn(relateTable "TDM45", relateId=점검항목): 그 점검항목에 아직 연결 안 된 법규만(E13-2)
     */
    public PageRes<IcsLawLookupRes> searchLookup(UserPrincipal user, Long classTreeId, String lawSearch, String statuteSearch,
                                                 boolean detailSearchYn, long offset, long limit,
                                                 String relateTable, Long relateId) {
        String law = "%" + (lawSearch == null ? "" : lawSearch) + "%";
        String statute = "%" + (statuteSearch == null ? "" : statuteSearch) + "%";
        Long companyId = user.getCompanyId();
        return new PageRes<>(mapper.selectLawLookupTotal(companyId, classTreeId, TYPE_CODE, law, statute, detailSearchYn, relateTable, relateId),
                mapper.selectLawLookup(companyId, classTreeId, TYPE_CODE, law, statute, detailSearchYn, limit, offset, relateTable, relateId));
    }

    /**
     * AS-IS Ics01_Tab_ClassTreeUserView.retrieve → selectByTypeCodePaging + selectByTypeCodePagingTotal (H02): 법규조회.
     * 법규검색·조문검색은 %…%, classTreeId가 있으면 그 분류와 모든 하위, advisYn이면 일임(자문) 법규만
     */
    public PageRes<IcsLawViewRes> searchView(UserPrincipal user, Long classTreeId, String lawSearch, String statuteSearch,
                                             boolean detailSearchYn, boolean advisYn, long offset, long limit) {
        String law = "%" + (lawSearch == null ? "" : lawSearch) + "%";
        String statute = "%" + (statuteSearch == null ? "" : statuteSearch) + "%";
        Long companyId = user.getCompanyId();
        return new PageRes<>(mapper.selectLawViewTotal(companyId, classTreeId, TYPE_CODE, law, statute, detailSearchYn, advisYn),
                mapper.selectLawView(companyId, classTreeId, TYPE_CODE, law, statute, detailSearchYn, advisYn, limit, offset));
    }

    /**
     * AS-IS Ics01_Tab_PeriodList.retrieve → ics.Ics01_ClassTree.selectByPeriod (H04): 월별 법규조회.
     * 클라이언트가 만들던 조건을 서버에서 만든다 — 검색어 %…%, 대분류·중분류·주기·구분이 비면 전체('%'), 끝일이 없으면 시작일(서버 L228)
     */
    public List<IcsLawPeriodRes> searchPeriod(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText,
                                              String level1Name, String level2Name, String cycleCode, String lawPublicType,
                                              boolean exceptDailyYn, boolean advisYn) {
        return mapper.selectLawPeriod(user.getCompanyId(), startDate, closeDate == null ? startDate : closeDate,
                "%" + (searchText == null ? "" : searchText) + "%", allIfBlank(level1Name), allIfBlank(level2Name),
                allIfBlank(cycleCode), allIfBlank(lawPublicType), String.valueOf(exceptDailyYn), String.valueOf(advisYn));
    }

    private static String allIfBlank(String value) {
        return value == null || value.isBlank() ? "%" : value;
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

    /**
     * AS-IS Ics01_Tab_ClassTreeUser.retrieve → ics.Ics01_ClassTree.selectByTypeCodePaging (H08): 회사별 법규관리 목록.
     * 검색어는 서비스가 %…%로, typeCode "IT"는 서버. mngGroupId(관리그룹)가 있으면 그 그룹에 연결된(미지정 그룹이면 어느 그룹에도 안 묶인) 법규만
     */
    public PageRes<IcsLawManageRes> searchManage(UserPrincipal user, Long classTreeId, String lawSearch, String statuteSearch, boolean detailSearchYn,
                                                 boolean advisYn, Long mngGroupId, long offset, long limit) {
        String law = "%" + (lawSearch == null ? "" : lawSearch) + "%";
        String statute = "%" + (statuteSearch == null ? "" : statuteSearch) + "%";
        Long companyId = user.getCompanyId();
        return new PageRes<>(mapper.selectLawManageTotal(companyId, classTreeId, TYPE_CODE, law, statute, detailSearchYn, advisYn, mngGroupId),
                mapper.selectLawManage(companyId, classTreeId, TYPE_CODE, law, statute, detailSearchYn, advisYn, mngGroupId, limit, offset));
    }

    /** AS-IS ics.Ics01_ClassTree.refresh (H08): 서식파일 창을 닫은 뒤 한 행을 다시 읽는다 */
    public IcsLawManageRes refreshManage(UserPrincipal user, Long classTreeId) {
        IcsLawManageRes row = mapper.selectLawManageById(classTreeId, user.getCompanyId());
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return row;
    }

    /**
     * AS-IS ics.Ics01_ClassTree.selectByExcept (Ics01_Lookup_Except, H08): 법규 사용여부 설정 창 목록.
     * exceptYn은 'true'(미사용)·'false'(사용)·비면 전체('%'), 검색어는 분류코드+분류명(상세내용 포함이면 상세내용까지) %…%. cycleCode·publicType은 '%'
     */
    public List<IcsLawExceptRes> searchExcept(UserPrincipal user, Long classTreeId, String exceptYn, String searchText, boolean detailSearchYn) {
        String except = exceptYn == null || exceptYn.isBlank() ? "%" : exceptYn;
        return mapper.selectLawExcept(user.getCompanyId(), classTreeId, TYPE_CODE, "%", "%", except,
                "%" + (searchText == null ? "" : searchText) + "%", String.valueOf(detailSearchYn));
    }

    /**
     * AS-IS Ics01_Tab_ClassTreeUser.updateCheck / Ics01_Lookup_Except.update → ics.Ics03_CompanyInfo.selectByClassTreeId + modelUpdate (H08).
     * 고친 법규마다 회사 설정 행(ics03_company_info)이 있으면 UPDATE, 없으면 새 ID로 INSERT. 안 보낸 값은 AS-IS 모델(boolean)처럼 자동처리 false, 일임 기존 값(없으면 false)
     */
    @Transactional
    public void saveCompanyInfo(UserPrincipal user, List<IcsCompanyInfoSaveReq> rows) {
        Long companyId = user.getCompanyId();
        for (IcsCompanyInfoSaveReq r : rows) {
            List<IcsCompanyInfoRes> found = mapper.selectCompanyInfo(r.classTreeId(), companyId);
            IcsCompanyInfoRes existing = found.isEmpty() ? null : found.get(0);
            String except = String.valueOf(Boolean.TRUE.equals(r.exceptYn()));
            String auto = String.valueOf(Boolean.TRUE.equals(r.autoYn()));
            String advis = r.advisYn() != null ? String.valueOf(r.advisYn()) : String.valueOf(existing != null && "true".equals(existing.advisYn()));
            if (existing != null) {
                mapper.updateCompanyInfo(existing.companyInfoId(), companyId, auto, except, advis);
            } else {
                mapper.insertCompanyInfo(mapper.selectNextId(), companyId, r.classTreeId(), auto, except, advis);
            }
        }
    }
}
