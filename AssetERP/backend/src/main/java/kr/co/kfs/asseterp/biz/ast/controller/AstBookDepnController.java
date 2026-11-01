package kr.co.kfs.asseterp.biz.ast.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.ast.dto.DepnBookGroupRes;
import kr.co.kfs.asseterp.biz.ast.dto.DepnBookRes;
import kr.co.kfs.asseterp.biz.ast.dto.OfficeAssetGroupRes;
import kr.co.kfs.asseterp.biz.ast.dto.OfficeAssetRes;
import kr.co.kfs.asseterp.biz.ast.dto.OfficeAssetTypeRes;
import kr.co.kfs.asseterp.biz.ast.dto.OfficeRetireReq;
import kr.co.kfs.asseterp.biz.ast.service.AstBookDepnService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 비품관리대장 Ast13_Tab_OfficeAssets (W16) — AS-IS ast.Ast13_BookDepn */
@RestController
@RequestMapping("/api/v1/ast/book-depns")
@RequiredArgsConstructor
public class AstBookDepnController {

    private final AstBookDepnService service;

    /** sys.Sys00_Common.selectOfficeAssets — 구분 콤보 */
    @GetMapping("/types")
    public ApiResponse<List<OfficeAssetTypeRes>> types() {
        return ApiResponse.ok(service.searchTypes());
    }

    /** ast.Ast13_BookDepn.selectOfficeAssets */
    @GetMapping
    public ApiResponse<List<OfficeAssetRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate depnDate,
                                                    @RequestParam(required = false) String itemLClassCode,
                                                    @RequestParam(defaultValue = "false") boolean retireYn,
                                                    @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, depnDate, itemLClassCode, retireYn, searchText));
    }

    /** ast.Ast13_BookDepn.selectOfficeAssetsGroup — 구분별 취득금액 합계(상신 전 확인, 본문 표) */
    @GetMapping("/groups")
    public ApiResponse<List<OfficeAssetGroupRes>> groups(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate depnDate) {
        return ApiResponse.ok(service.searchGroups(principal, depnDate));
    }

    /** ast.Ast13_BookDepn.updateRetireDate */
    @PutMapping("/{bookDepnId}/retire-date")
    public ApiResponse<Void> updateRetireDate(@PathVariable Long bookDepnId, @Valid @RequestBody OfficeRetireReq req) {
        service.updateRetireDate(bookDepnId, req.retireDate());
        return ApiResponse.ok(null);
    }

    /** sys.Sys99_Print.insertRdOfficeAssets → rdGroupId */
    @PostMapping("/rd")
    public ApiResponse<Long> rd(@AuthenticationPrincipal UserPrincipal principal,
                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate depnDate,
                                @RequestParam(required = false) String itemLClassCode,
                                @RequestParam(defaultValue = "false") boolean retireYn,
                                @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.insertRd(principal, depnDate, itemLClassCode, retireYn, searchText));
    }

    // ───── 감가상각대장 W17 (Ast13_Tab_DepnBook) ─────

    /** sys.Sys00_Common.selectDepnItemType */
    @GetMapping("/depn-types")
    public ApiResponse<List<OfficeAssetTypeRes>> depnTypes() {
        return ApiResponse.ok(service.searchDepnTypes());
    }

    /** ast.Ast13_BookDepn.selectByDepnDate2 */
    @GetMapping("/depn-books")
    public ApiResponse<List<DepnBookRes>> depnBooks(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate depnDate,
                                                    @RequestParam(required = false) String itemLClassCode,
                                                    @RequestParam(defaultValue = "false") boolean retireYn,
                                                    @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchDepnBooks(principal, depnDate, itemLClassCode, retireYn, searchText));
    }

    /** ast.Ast13_BookDepn.getDepnDate2 */
    @GetMapping("/depn-books/groups")
    public ApiResponse<List<DepnBookGroupRes>> depnGroups(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate depnDate) {
        return ApiResponse.ok(service.searchDepnGroups(principal, depnDate));
    }

    /** sys.Sys99_Print.insertRdDepnBook → rdGroupId */
    @PostMapping("/depn-books/rd")
    public ApiResponse<Long> depnRd(@AuthenticationPrincipal UserPrincipal principal,
                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate depnDate,
                                    @RequestParam(required = false) String itemLClassCode,
                                    @RequestParam(defaultValue = "false") boolean retireYn,
                                    @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.insertRdDepn(principal, depnDate, itemLClassCode, retireYn, searchText));
    }
}
