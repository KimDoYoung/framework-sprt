package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizAccountMapRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizAccountMapSaveReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardUseItemRes;
import kr.co.kfs.asseterp.biz.biz.service.BizAccountMapService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 항목별 계정연결 (AS-IS Biz03_Lookup_AccountMap → server/biz/Biz03_AccountMap) */
@RestController
@RequestMapping("/api/v1/biz/account-maps")
@RequiredArgsConstructor
public class BizAccountMapController {

    private final BizAccountMapService service;

    /** AS-IS sys.Sys09_Code.selectByCodeKind(BizCardUseItemCode, 오늘) */
    @GetMapping("/use-items")
    public ApiResponse<List<BizCardUseItemRes>> useItems(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchUseItems(principal));
    }

    /** AS-IS biz.Biz03_AccountMap.selectByUseItemCode */
    @GetMapping
    public ApiResponse<List<BizAccountMapRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String useItemCode) {
        return ApiResponse.ok(service.searchByUseItemCode(principal, useItemCode));
    }

    /** AS-IS biz.Biz03_AccountMap.update → 저장한 건수 */
    @PutMapping
    public ApiResponse<Integer> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BizAccountMapSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS biz.Biz03_AccountMap.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> accountMapIds) {
        return ApiResponse.ok(service.delete(principal, accountMapIds));
    }
}
