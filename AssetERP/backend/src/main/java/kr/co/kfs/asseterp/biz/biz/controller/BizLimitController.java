package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitSaveReq;
import kr.co.kfs.asseterp.biz.biz.service.BizLimitService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 이익제공 기준관리 (AS-IS Biz90_Tab_Limit → server/biz/Biz90_Limit) */
@RestController
@RequestMapping("/api/v1/biz/limits")
@RequiredArgsConstructor
public class BizLimitController {

    private final BizLimitService service;

    /** AS-IS biz.Biz90_Limit.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<BizLimitRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS biz.Biz90_Limit.update → 저장된 행 */
    @PutMapping
    public ApiResponse<List<BizLimitRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BizLimitSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS biz.Biz90_Limit.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
