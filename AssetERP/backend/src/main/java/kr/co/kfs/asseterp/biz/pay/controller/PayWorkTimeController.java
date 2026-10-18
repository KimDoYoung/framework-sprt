package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayWorkTimeRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayWorkTimeSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayWorkTimeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 근로시간기준관리 (AS-IS Pay34_Tab_WorkTimeConfig → server/pay/Pay34_WorkTimeConfig) — 메뉴 #1489 */
@RestController
@RequestMapping("/api/v1/pay/work-times")
@RequiredArgsConstructor
public class PayWorkTimeController {

    private final PayWorkTimeService service;

    /** AS-IS pay.Pay34_WorkTimeConfig.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<PayWorkTimeRes>> search() {
        return ApiResponse.ok(service.search());
    }

    /** AS-IS pay.Pay34_WorkTimeConfig.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<PayWorkTimeRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<PayWorkTimeSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS pay.Pay34_WorkTimeConfig.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
