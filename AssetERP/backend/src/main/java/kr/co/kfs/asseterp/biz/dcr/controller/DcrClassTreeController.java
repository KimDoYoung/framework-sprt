package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.ClassTreeLookupRes;
import kr.co.kfs.asseterp.biz.dcr.service.DcrClassTreeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 문서분류 (AS-IS server/dcr/Dcr01_ClassTree) */
@RestController
@RequestMapping("/api/v1/dcr/class-trees")
@RequiredArgsConstructor
public class DcrClassTreeController {

    private final DcrClassTreeService dcrClassTreeService;

    /** AS-IS dcr.Dcr01_ClassTree.commentInsert (문서개요복사: admin(0) → 회사) → 바뀐 행 수 */
    @PostMapping("/comments/copy/{companyId}")
    public ApiResponse<Integer> copyComments(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId) {
        return ApiResponse.ok(dcrClassTreeService.copyCommentsFromAdmin(principal, companyId));
    }

    /** AS-IS dcr.Dcr01_ClassTree.selectByText (Dcr01_Lookup_SelectMulti, E13-3) — 사용 중인 문서분류(T) 조회 */
    @GetMapping("/lookup")
    public ApiResponse<List<ClassTreeLookupRes>> searchLookup(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(defaultValue = "") String searchText,
                                                              @RequestParam(required = false) String relateTable,
                                                              @RequestParam(required = false) Long relateId) {
        return ApiResponse.ok(dcrClassTreeService.searchLookup(principal, searchText, relateTable, relateId));
    }
}
