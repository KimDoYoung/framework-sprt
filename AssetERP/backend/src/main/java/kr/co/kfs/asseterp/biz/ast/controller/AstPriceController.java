package kr.co.kfs.asseterp.biz.ast.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.ast.dto.PriceRes;
import kr.co.kfs.asseterp.biz.ast.dto.PrcRes;
import kr.co.kfs.asseterp.biz.ast.dto.PrcSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.PriceSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstPriceService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 고유자산 시세 Ast25_Lookup_Price (W09) — AS-IS ast.Ast25_Price.selectHoldItem · insert */
@RestController
@RequestMapping("/api/v1/ast/prices")
@RequiredArgsConstructor
public class AstPriceController {

    private final AstPriceService service;

    /** ast.Ast25_Price.selectHoldItem */
    @GetMapping("/hold-items")
    public ApiResponse<List<PriceRes>> holdItems(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate,
                                                 @RequestParam(required = false) String itemType,
                                                 @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.holdItems(principal, holdDate, itemType, searchText));
    }

    /** ast.Ast25_Price.insert */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody PriceSaveReq req) {
        service.save(principal, req);
        return ApiResponse.ok(null);
    }

    /** ast.Ast25_Price.selectByStdDatePaging — 시세관리 W10 */
    @GetMapping
    public ApiResponse<PageRes<PrcRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                               @RequestParam(required = false) String itemType,
                                               @RequestParam(required = false) String searchText,
                                               @RequestParam(defaultValue = "false") boolean holdYn,
                                               @RequestParam(defaultValue = "300") int limit,
                                               @RequestParam(defaultValue = "0") int offset) {
        return ApiResponse.ok(service.searchPaging(principal, startDate, closeDate, itemType, searchText, holdYn, limit, offset));
    }

    /** ast.Ast25_Price.upsert — 저장한 ID(요청 순서) */
    @PutMapping("/upsert")
    public ApiResponse<List<Long>> upsert(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody PrcSaveReq req) {
        return ApiResponse.ok(service.upsert(principal, req));
    }

    /** ast.Ast25_Price.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
