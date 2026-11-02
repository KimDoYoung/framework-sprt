package kr.co.kfs.asseterp.biz.icam.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeDepositDeleteReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeDepositRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeDepositSaveReq;
import kr.co.kfs.asseterp.biz.icam.service.IcamFeeDepositService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 펀드별 보수입금계좌 등록 (AS-IS Icam11_Tab_OfficeMngFeeDeposit → server/icam/Icam11_FeeDeposit) — 메뉴 #1204 (X27). X33(운용보수 입금계좌 관리)이 같은 API를 쓸 수 있다 */
@RestController
@RequestMapping("/api/v1/icam/fee-deposits")
@RequiredArgsConstructor
public class IcamFeeDepositController {

    private final IcamFeeDepositService service;

    /** AS-IS icam.Icam11_FeeDeposit.selectByCompanyId — 펀드별 현재(오늘 기준 최근 적용시작일) 입금계좌 */
    @GetMapping
    public ApiResponse<List<IcamFeeDepositRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam(required = false) Long corpId,
                                                       @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, corpId, searchText));
    }

    /** AS-IS icam.Icam11_FeeDeposit.selectByFundCode2 — 한 펀드의 적용시작일별 이력 */
    @GetMapping("/by-fund")
    public ApiResponse<List<IcamFeeDepositRes>> searchByFund(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestParam(required = false) String icamCompanyCode,
                                                             @RequestParam String fundCode) {
        return ApiResponse.ok(service.searchByFund(principal, icamCompanyCode, fundCode));
    }

    /** AS-IS icam.Icam11_FeeDeposit.update */
    @PutMapping
    public ApiResponse<List<IcamFeeDepositRes>> save(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody IcamFeeDepositSaveReq req) {
        return ApiResponse.ok(service.save(principal, req.items()));
    }

    /** AS-IS icam.Icam11_FeeDeposit.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcamFeeDepositDeleteReq req) {
        return ApiResponse.ok(service.delete(principal, req.ids()));
    }
}
