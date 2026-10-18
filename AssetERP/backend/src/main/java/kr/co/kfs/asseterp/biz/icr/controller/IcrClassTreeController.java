package kr.co.kfs.asseterp.biz.icr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeDeadlineRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeDetailRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeLookupRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeRes;
import kr.co.kfs.asseterp.biz.icr.service.IcrClassTreeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 내규 분류·조회창 (AS-IS server/icr/Icr01_ClassTree) — 메뉴 없음, 책무매뉴얼 점검항목(E13-3) 등이 연다 */
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
}
