package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.ClassTreeMoveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsCompanyInfoSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawContentReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawDeadlineRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawDetailRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawExceptRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawLookupRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawManageRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawPeriodRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawViewRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsClassTreeService;
import kr.co.kfs.asseterp.biz.ics.service.IcsLawService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 법규관리(관리자) 법규 그리드 (AS-IS Ics01_Grid_IcsType·Ics01_Move_Grid → server/ics/Ics01_ClassTree) — 메뉴 #1012 */
@RestController
@RequestMapping("/api/v1/ics/laws")
@RequiredArgsConstructor
public class IcsLawController {

    private final IcsLawService service;
    private final IcsClassTreeService treeService;

    /** AS-IS ics.Ics01_ClassTree.selectByClassTreeId */
    @GetMapping
    public ApiResponse<List<IcsLawRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId,
                                               @RequestParam(required = false) String publicType,
                                               @RequestParam(required = false) String searchText,
                                               @RequestParam(defaultValue = "false") boolean advisYn) {
        return ApiResponse.ok(service.search(principal, classTreeId, publicType, searchText, advisYn));
    }

    /** AS-IS ics.Ics01_ClassTree.selectByTypeCodePaging (Ics01_Lookup_SelectMulti, E03) — 법규(IT) 페이징 조회 */
    @GetMapping("/lookup")
    public ApiResponse<PageRes<IcsLawLookupRes>> searchLookup(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(required = false) Long classTreeId,
                                                              @RequestParam(defaultValue = "") String lawSearch,
                                                              @RequestParam(defaultValue = "") String statuteSearch,
                                                              @RequestParam(defaultValue = "false") boolean detailSearchYn,
                                                              @RequestParam(defaultValue = "0") long offset,
                                                              @RequestParam(defaultValue = "50") long limit,
                                                              @RequestParam(required = false) String relateTable,
                                                              @RequestParam(required = false) Long relateId) {
        return ApiResponse.ok(service.searchLookup(principal, classTreeId, lawSearch, statuteSearch, detailSearchYn, offset, limit, relateTable, relateId));
    }

    /** AS-IS ics.Ics01_ClassTree.selectByTypeCodePaging (Ics01_Tab_ClassTreeUser, H08) — 법규관리(회사별 제외·일임·관리그룹) 페이징 */
    @GetMapping("/manage")
    public ApiResponse<PageRes<IcsLawManageRes>> searchManage(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(required = false) Long classTreeId,
                                                              @RequestParam(defaultValue = "") String lawSearch,
                                                              @RequestParam(defaultValue = "") String statuteSearch,
                                                              @RequestParam(defaultValue = "false") boolean detailSearchYn,
                                                              @RequestParam(defaultValue = "false") boolean advisYn,
                                                              @RequestParam(required = false) Long mngGroupId,
                                                              @RequestParam(defaultValue = "0") long offset,
                                                              @RequestParam(defaultValue = "100") long limit) {
        return ApiResponse.ok(service.searchManage(principal, classTreeId, lawSearch, statuteSearch, detailSearchYn, advisYn, mngGroupId, offset, limit));
    }

    /** AS-IS ics.Ics01_ClassTree.refresh (H08) — 법규관리 한 행 */
    @GetMapping("/{classTreeId}/manage")
    public ApiResponse<IcsLawManageRes> refreshManage(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId) {
        return ApiResponse.ok(service.refreshManage(principal, classTreeId));
    }

    /** AS-IS ics.Ics01_ClassTree.selectByExcept (Ics01_Lookup_Except, H08) — 법규 사용여부 설정 창. exceptYn 'true'/'false', 비면 전체 */
    @GetMapping("/except")
    public ApiResponse<List<IcsLawExceptRes>> searchExcept(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam(required = false) Long classTreeId,
                                                           @RequestParam(required = false) String exceptYn,
                                                           @RequestParam(defaultValue = "") String searchText,
                                                           @RequestParam(defaultValue = "false") boolean detailSearchYn) {
        return ApiResponse.ok(service.searchExcept(principal, classTreeId, exceptYn, searchText, detailSearchYn));
    }

    /** AS-IS ics.Ics03_CompanyInfo.modelUpdate (Ics01_Tab_ClassTreeUser.updateCheck·Ics01_Lookup_Except.update, H08) — 법규별 제외·자동·일임을 회사 설정에 저장 */
    @PutMapping("/company-info")
    public ApiResponse<Integer> saveCompanyInfo(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<IcsCompanyInfoSaveReq> rows) {
        service.saveCompanyInfo(principal, rows);
        return ApiResponse.ok(rows.size());
    }

    /** AS-IS ics.Ics01_ClassTree.selectByTypeCodePaging (Ics01_Tab_ClassTreeUserView, H02) — 법규조회 페이징 */
    @GetMapping("/view")
    public ApiResponse<PageRes<IcsLawViewRes>> searchView(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam(required = false) Long classTreeId,
                                                          @RequestParam(defaultValue = "") String lawSearch,
                                                          @RequestParam(defaultValue = "") String statuteSearch,
                                                          @RequestParam(defaultValue = "false") boolean detailSearchYn,
                                                          @RequestParam(defaultValue = "false") boolean advisYn,
                                                          @RequestParam(defaultValue = "0") long offset,
                                                          @RequestParam(defaultValue = "100") long limit) {
        return ApiResponse.ok(service.searchView(principal, classTreeId, lawSearch, statuteSearch, detailSearchYn, advisYn, offset, limit));
    }

    /** AS-IS ics.Ics01_ClassTree.selectByPeriod (Ics01_Tab_PeriodList, H04) — 월별 법규조회 */
    @GetMapping("/period")
    public ApiResponse<List<IcsLawPeriodRes>> searchPeriod(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                           @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                           @RequestParam(defaultValue = "") String searchText,
                                                           @RequestParam(required = false) String level1Name,
                                                           @RequestParam(required = false) String level2Name,
                                                           @RequestParam(required = false) String cycleCode,
                                                           @RequestParam(required = false) String lawPublicType,
                                                           @RequestParam(defaultValue = "true") boolean exceptDailyYn,
                                                           @RequestParam(defaultValue = "false") boolean advisYn) {
        return ApiResponse.ok(service.searchPeriod(principal, startDate, closeDate, searchText, level1Name, level2Name,
                cycleCode, lawPublicType, exceptDailyYn, advisYn));
    }

    /** AS-IS ics.Ics01_ClassTree.selectByListIcsId (Ics01_Lookup_SelectMulti "deadline", E04) — 법규와 그 기한 */
    @GetMapping("/with-deadlines")
    public ApiResponse<List<IcsLawDeadlineRes>> deadlines(@RequestParam List<Long> classTreeIds) {
        return ApiResponse.ok(service.deadlines(classTreeIds));
    }

    /** AS-IS ics.Ics01_ClassTree.selectById (Ics01_Lookup_ClassTreeDetail, E03-1) */
    @GetMapping("/{classTreeId}/detail")
    public ApiResponse<IcsLawDetailRes> detail(@PathVariable Long classTreeId) {
        return ApiResponse.ok(service.detail(classTreeId));
    }

    /** AS-IS ics.Ics01_ClassTree.refresh */
    @GetMapping("/{classTreeId}")
    public ApiResponse<IcsLawRes> refresh(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId) {
        return ApiResponse.ok(service.refresh(principal, classTreeId));
    }

    /** AS-IS ics.Ics01_ClassTree.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<IcsLawRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<IcsLawSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS Ics01_Lookup_Content.update → ics.Ics01_ClassTree.modelUpdate */
    @PutMapping("/{classTreeId}/content")
    public ApiResponse<IcsLawRes> updateContent(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId,
                                                @RequestBody IcsLawContentReq req) {
        return ApiResponse.ok(service.updateContent(principal, classTreeId, req));
    }

    /** AS-IS ics.Ics01_ClassTree.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> classTreeIds) {
        return ApiResponse.ok(service.delete(principal, classTreeIds));
    }

    /** AS-IS Ics01_Move_Grid.moveTree → ics.Ics01_ClassTree.update (상위 분류 이동) */
    @PutMapping("/{classTreeId}/parent")
    public ApiResponse<Void> move(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId, @RequestBody ClassTreeMoveReq req) {
        treeService.move(principal, classTreeId, req.parentTreeId());
        return ApiResponse.ok(null);
    }
}
