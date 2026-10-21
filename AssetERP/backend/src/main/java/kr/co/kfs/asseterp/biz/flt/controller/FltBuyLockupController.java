package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BuyLockupItemRes;
import kr.co.kfs.asseterp.biz.flt.dto.BuyLockupSaveReq;
import kr.co.kfs.asseterp.biz.flt.service.FltBuyLockupService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 매수제한종목 (AS-IS Flt08_Lookup_LockupItem → server/flt/Flt08_BuyLockup) — 기준관리 화면의 조회창 */
@RestController
@RequestMapping("/api/v1/flt/buy-lockups")
@RequiredArgsConstructor
public class FltBuyLockupController {

    private final FltBuyLockupService service;

    /** AS-IS flt.Flt08_BuyLockup.selectByText — lockupType `%`=전체 */
    @GetMapping
    public ApiResponse<List<BuyLockupItemRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(required = false) String lockupType,
                                                  @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, lockupType, searchText));
    }

    /** AS-IS flt.Flt08_BuyLockup.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<BuyLockupItemRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BuyLockupSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS flt.Flt08_BuyLockup.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
