package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.pay.dto.PayRetireInsureRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireInsureSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayRetireInsureService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 퇴직정산 4대보험 탭 Pay12_TabPage_RetireInsure (S22) — AS-IS pay.Pay12_RetireInsure */
@RestController
@RequestMapping("/api/v1/pay/retire-insures")
@RequiredArgsConstructor
public class PayRetireInsureController {

    private final PayRetireInsureService service;

    /** pay.Pay12_RetireInsure.selectByPersonId */
    @GetMapping
    public ApiResponse<List<PayRetireInsureRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam Long personId, @RequestParam String insureCode) {
        return ApiResponse.ok(service.search(principal, personId, insureCode));
    }

    /** pay.Pay12_RetireInsure.insertRetireInfo */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayRetireInsureSaveReq req) {
        service.save(principal, req);
        return ApiResponse.ok(null);
    }

    /** pay.Pay12_RetireInsure.callInsureRetire — [4대보험 정산 재생성] */
    @PostMapping("/regenerate")
    public ApiResponse<Void> regenerate(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long personId) {
        service.regenerate(principal, personId);
        return ApiResponse.ok(null);
    }

    /** sys.Sys99_Print.insertRdRetireInsure — [출력/다운로드] 자료 만들기, rdGroupId */
    @PostMapping("/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long personId) {
        return ApiResponse.ok(service.insertRdPrint(principal, personId));
    }
}
