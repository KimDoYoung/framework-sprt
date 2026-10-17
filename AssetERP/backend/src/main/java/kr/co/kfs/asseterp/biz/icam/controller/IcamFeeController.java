package kr.co.kfs.asseterp.biz.icam.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeBatchReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeRes;
import kr.co.kfs.asseterp.biz.icam.service.IcamFeeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/** ICAM 보수(관리자용) (AS-IS Icam10_Tab_FeeAdmin → server/icam/Icam10_Fee) — 메뉴 #1203 */
@RestController
@RequestMapping("/api/v1/icam/fees")
@RequiredArgsConstructor
public class IcamFeeController {

    private final IcamFeeService service;

    /** AS-IS icam.Icam10_Fee.selectByFeeTypePaging — 페이지 행 + 전체 건수 */
    @GetMapping
    public ApiResponse<PageRes<IcamFeeRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam Long companyId,
                                                   @RequestParam String feeType,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                   @RequestParam(defaultValue = "") String searchText,
                                                   @RequestParam(defaultValue = "0") int offset,
                                                   @RequestParam(defaultValue = "100") int limit) {
        return ApiResponse.ok(service.search(principal, companyId, feeType, startDate, closeDate, searchText, offset, limit));
    }

    /** AS-IS BatchMain(icamOfficeMngFee·icamFundMngFee): ICAM 발생보수 가져오기 — 외부 ICAM DB 연동이 없어 서버가 거절 */
    @PostMapping("/batch")
    public ApiResponse<Void> runBatch(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcamFeeBatchReq req) {
        service.runBatch(principal, req.actionCode(), req.companyId(), req.startDate(), req.closeDate());
        return ApiResponse.ok(null);
    }
}
