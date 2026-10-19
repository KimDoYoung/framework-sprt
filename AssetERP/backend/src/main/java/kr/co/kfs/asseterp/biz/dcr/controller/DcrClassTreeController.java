package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.ClassTreeLookupRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrCheckRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrCheckRowReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeAllRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrCopyCompanyRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrCopyReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeRowRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrParentReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrUseYnReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrWriteTreeRes;
import kr.co.kfs.asseterp.biz.dcr.service.DcrClassTreeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    // ===== E16 문서분류 (Dcr01_Tab_ClassTree 외) =====

    /** AS-IS dcr.Dcr01_ClassTree.selectByCompanyId — 사용 중인 분류 트리(전위 평평한 목록 + depth). typeCode 기본 C, 이동·반영 창은 % */
    @GetMapping
    public ApiResponse<List<DcrClassTreeRes>> searchTree(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(required = false) String typeCode,
                                                         @RequestParam(required = false) Long companyId) {
        return ApiResponse.ok(dcrClassTreeService.searchTree(principal, typeCode, companyId));
    }

    /** AS-IS dcr.Dcr01_ClassTree.selectByOrgIdRoleWrite — 업무별 문서작성(F02): 내 조직이 작성권한을 가진 분류 트리(전위 평평한 목록 + depth) */
    @GetMapping("/write")
    public ApiResponse<List<DcrWriteTreeRes>> searchWriteTree(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(dcrClassTreeService.searchWriteTree(principal));
    }

    /** AS-IS dcr.Dcr01_ClassTree.selectByAll — 사용 여부와 관계없는 전체 트리(사용여부 설정 창) */
    @GetMapping("/all")
    public ApiResponse<List<DcrClassTreeAllRes>> searchTreeAll(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam(required = false) String typeCode) {
        return ApiResponse.ok(dcrClassTreeService.searchTreeAll(principal, typeCode));
    }

    /** AS-IS dcr.Dcr01_ClassTree.selectByClassTreeId — 고른 분류 아래의 문서구분(T) */
    @GetMapping("/{parentId}/doc-types")
    public ApiResponse<List<DcrDocTypeRowRes>> searchDocTypes(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long parentId,
                                                              @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(dcrClassTreeService.searchDocTypes(principal, parentId, searchText));
    }

    /** AS-IS dcr.Dcr01_ClassTree.update — 문서구분(T) 그리드 저장 → 저장된 행(요청 순서) */
    @PutMapping("/doc-types")
    public ApiResponse<List<DcrDocTypeRowRes>> saveDocTypes(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<DcrDocTypeSaveReq> rows) {
        return ApiResponse.ok(dcrClassTreeService.saveDocTypes(principal, rows));
    }

    /** AS-IS dcr.Dcr01_ClassTree.update — 사용여부 설정 창 저장 → 바뀐 건수 */
    @PutMapping("/use-yn")
    public ApiResponse<Integer> updateUseYn(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<DcrUseYnReq> rows) {
        return ApiResponse.ok(dcrClassTreeService.updateUseYn(principal, rows));
    }

    /** AS-IS dcr.Dcr01_ClassTree.update — 새 문서분류(C) */
    @PostMapping
    public ApiResponse<DcrClassTreeRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DcrClassTreeSaveReq req) {
        return ApiResponse.ok(dcrClassTreeService.createClassTree(principal, req));
    }

    /** AS-IS dcr.Dcr01_ClassTree.update — 문서분류(C) 수정 */
    @PutMapping("/{classTreeId}")
    public ApiResponse<DcrClassTreeRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId,
                                               @RequestBody DcrClassTreeSaveReq req) {
        return ApiResponse.ok(dcrClassTreeService.updateClassTree(principal, classTreeId, req));
    }

    /** AS-IS dcr.Dcr01_ClassTree.update — 상위 분류 이동(Dcr01_Move_TreeGrid·Dcr01_Move_Grid) */
    @PutMapping("/{classTreeId}/parent")
    public ApiResponse<DcrClassTreeRes> moveParent(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId,
                                                   @RequestBody DcrParentReq req) {
        return ApiResponse.ok(dcrClassTreeService.moveParent(principal, classTreeId, req.parentTreeId()));
    }

    /** AS-IS dcr.Dcr01_ClassTree.updateCheck — status 1이면 저장해도 됨, -1이면 message를 보여 준다 */
    @PostMapping("/check-update")
    public ApiResponse<DcrCheckRes> updateCheck(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<DcrCheckRowReq> rows) {
        return ApiResponse.ok(dcrClassTreeService.updateCheck(principal, rows));
    }

    /** AS-IS dcr.Dcr01_ClassTree.deleteCheck — status 0이면 지워도 됨 */
    @GetMapping("/{classTreeId}/delete-check")
    public ApiResponse<DcrCheckRes> deleteCheck(@PathVariable Long classTreeId) {
        return ApiResponse.ok(dcrClassTreeService.deleteCheck(classTreeId));
    }

    /** AS-IS dcr.Dcr01_ClassTree.deleteAll — 분류와 아래 전체(상신문서는 폐기문서로) → 지운 분류 수 */
    @DeleteMapping("/{classTreeId}")
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long classTreeId) {
        return ApiResponse.ok(dcrClassTreeService.delete(principal, classTreeId));
    }

    /** AS-IS sys.Sys01_Company.selectByUseYn (Dcr01_Lookup_DcrCopyAdmin) — 관리자 회사만 */
    @GetMapping("/copy-companies")
    public ApiResponse<List<DcrCopyCompanyRes>> copyCompanies(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(dcrClassTreeService.copyCompanies(principal));
    }

    /** AS-IS dcr.Dcr01_ClassTree.insertAdminCopy — 관리자 회사만 → 반영한 회사 수 */
    @PostMapping("/admin-copy")
    public ApiResponse<Integer> insertAdminCopy(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DcrCopyReq req) {
        return ApiResponse.ok(dcrClassTreeService.insertAdminCopy(principal, req));
    }

    /** 로그인 회사의 AssetERP 상품코드 (S1이면 사용여부설정 버튼 숨김) */
    @GetMapping("/product-code")
    public ApiResponse<String> productCode(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(dcrClassTreeService.erpProductCode(principal));
    }
}
