package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassLinkRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrLinkClassTreeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrLinkCopyReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrLinkNoteReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrLinkRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrLinkSaveReq;
import kr.co.kfs.asseterp.biz.dcr.service.DcrLinkService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 문서분류지정 (AS-IS Dcr30_Tab_LinkAdmin → server/dcr/Dcr30_Link) */
@RestController
@RequestMapping("/api/v1/dcr/links")
@RequiredArgsConstructor
public class DcrLinkController {

    private final DcrLinkService service;

    /** AS-IS dcr.Dcr30_Link.selectByClassTreeId (Apr01_Grid_DocList, F02) — 문서분류에 Link가 있는지(있으면 신규 작성 대신 안내) */
    @GetMapping("/by-class-tree")
    public ApiResponse<List<DcrClassLinkRes>> searchByClassTree(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId) {
        return ApiResponse.ok(service.searchByClassTree(principal, classTreeId));
    }

    /** AS-IS dcr.Dcr30_Link.selectByLinkCode (L06 Apr01_Tab_BizPriorApproval) — Link 코드에 지정된 문서분류. 1건이 아니면 화면이 "미지정"으로 본다 */
    @GetMapping("/class-tree-by-code")
    public ApiResponse<List<DcrLinkClassTreeRes>> searchClassTreeByLinkCode(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String linkCode) {
        return ApiResponse.ok(service.searchClassTreeByLinkCode(principal, linkCode));
    }

    /** AS-IS dcr.Dcr30_Link.selectBySearchId (companyId 없으면 로그인 회사) */
    @GetMapping
    public ApiResponse<List<DcrLinkRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam(required = false) Long companyId,
                                                @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, companyId, searchText));
    }

    /** AS-IS dcr.Dcr30_Link.linkCheck (화면을 열 때. 없는 Link를 모든 회사에 넣는다 — 관리자 회사만) → 새로 넣은 건수 */
    @PostMapping("/check")
    public ApiResponse<Integer> linkCheck(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.linkCheck(principal));
    }

    /** AS-IS dcr.Dcr30_Link.update + updateDcrAuth → 저장한 건수 */
    @PutMapping
    public ApiResponse<Integer> update(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam(required = false) Long companyId,
                                       @RequestBody List<DcrLinkSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, companyId, rows));
    }

    /** AS-IS dcr.Dcr30_Link.updateNote */
    @PutMapping("/{linkId}/note")
    public ApiResponse<Void> updateNote(@AuthenticationPrincipal UserPrincipal principal,
                                        @PathVariable Long linkId, @RequestBody DcrLinkNoteReq req) {
        service.updateNote(principal, linkId, req.note());
        return ApiResponse.ok(null);
    }

    /** AS-IS dcr.Dcr30_Link.updateLink (문서분류지정복사 — 관리자 회사만) → 처리한 건수 */
    @PostMapping("/copy-link")
    public ApiResponse<Integer> copyLink(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DcrLinkCopyReq req) {
        return ApiResponse.ok(service.copyLink(principal, req));
    }

    /** AS-IS dcr.Dcr30_Link.updateForm (양식복사 — 관리자 회사만) → 처리한 건수 */
    @PostMapping("/copy-form")
    public ApiResponse<Integer> copyForm(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DcrLinkCopyReq req) {
        return ApiResponse.ok(service.copyForm(principal, req));
    }
}
