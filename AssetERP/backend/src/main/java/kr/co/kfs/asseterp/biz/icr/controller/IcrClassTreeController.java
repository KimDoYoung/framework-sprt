package kr.co.kfs.asseterp.biz.icr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeDeadlineRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeDetailRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeLookupRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeMoveReq;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeViewRes;
import kr.co.kfs.asseterp.biz.icr.service.IcrClassTreeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 내규 분류·조회창 (AS-IS server/icr/Icr01_ClassTree) — 책무매뉴얼 점검항목(E13-3) 등이 연다. 분류 쓰기는 내규관리 #1347(H09) */
@RestController
@RequestMapping("/api/v1/icr/class-trees")
@RequiredArgsConstructor
public class IcrClassTreeController {

    private final IcrClassTreeService service;

    /** AS-IS icr.Icr01_ClassTree.selectByCompanyId (Icr01_Lookup_SelectParent) — typeCode IC(분류) */
    @GetMapping
    public ApiResponse<List<IcrClassTreeRes>> searchTree(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(defaultValue = "IC") String typeCode) {
        return ApiResponse.ok(service.searchTree(principal, typeCode));
    }

    /** AS-IS icr.Icr01_ClassTree.selectByTypeCodePaging (Icr01_Lookup_SelectMulti) — 내규(IT) 페이징 조회 */
    @GetMapping("/lookup")
    public ApiResponse<PageRes<IcrClassTreeLookupRes>> searchLookup(@AuthenticationPrincipal UserPrincipal principal,
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

    /** AS-IS icr.Icr01_ClassTree.selectByTypeCodePaging (Icr01_Tab_ClassTreeView, H03) — 내규조회 페이징. typeCode IT는 서버 */
    @GetMapping("/view")
    public ApiResponse<PageRes<IcrClassTreeViewRes>> searchView(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestParam(required = false) Long classTreeId,
                                                                @RequestParam(defaultValue = "") String lawSearch,
                                                                @RequestParam(defaultValue = "") String statuteSearch,
                                                                @RequestParam(defaultValue = "false") boolean detailSearchYn,
                                                                @RequestParam(defaultValue = "0") long offset,
                                                                @RequestParam(defaultValue = "100") long limit) {
        return ApiResponse.ok(service.searchView(principal, classTreeId, lawSearch, statuteSearch, detailSearchYn, offset, limit));
    }

    /** AS-IS icr.Icr01_ClassTree.selectByListIcrId (Icr01_Lookup_SelectMulti "deadline") — 내규와 그 기한 */
    @GetMapping("/with-deadlines")
    public ApiResponse<List<IcrClassTreeDeadlineRes>> deadlines(@RequestParam List<Long> classTreeIds) {
        return ApiResponse.ok(service.deadlines(classTreeIds));
    }

    /** AS-IS icr.Icr01_ClassTree.selectById (Icr01_Lookup_ClassTreeDetail) */
    @GetMapping("/{classTreeId}/detail")
    public ApiResponse<IcrClassTreeDetailRes> detail(@PathVariable Long classTreeId) {
        return ApiResponse.ok(service.detail(classTreeId));
    }

    /** AS-IS icr.Icr01_ClassTree.update (등록) */
    @PostMapping
    public ApiResponse<IcrClassTreeRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcrClassTreeSaveReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS icr.Icr01_ClassTree.update (수정) */
    @PutMapping("/{classTreeId}")
    public ApiResponse<IcrClassTreeRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId,
                                               @RequestBody IcrClassTreeSaveReq req) {
        return ApiResponse.ok(service.update(principal, classTreeId, req));
    }

    /** AS-IS icr.Icr01_ClassTree.update (상위 분류 이동) */
    @PutMapping("/{classTreeId}/parent")
    public ApiResponse<Void> move(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId, @RequestBody IcrClassTreeMoveReq req) {
        service.move(principal, classTreeId, req.parentTreeId());
        return ApiResponse.ok(null);
    }

    /** AS-IS icr.Icr01_ClassTree.deleteAll → 지운 건수(하위 포함) */
    @DeleteMapping("/{classTreeId}")
    public ApiResponse<Integer> deleteAll(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId) {
        return ApiResponse.ok(service.deleteAll(principal, classTreeId));
    }
}
