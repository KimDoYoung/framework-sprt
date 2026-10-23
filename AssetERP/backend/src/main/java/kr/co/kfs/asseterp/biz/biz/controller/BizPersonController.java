package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizPersonAddReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPersonRes;
import kr.co.kfs.asseterp.biz.biz.service.BizPersonService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 이익제공(수령) 인원 — 직원·거래상대방 (AS-IS Biz02_Grid_InternalList·ExternalList → server/biz/Biz02_Person) */
@RestController
@RequestMapping("/api/v1/biz/people")
@RequiredArgsConstructor
public class BizPersonController {

    private final BizPersonService service;

    /** AS-IS biz.Biz02_Person.selectByInternal */
    @GetMapping("/internal")
    public ApiResponse<List<BizPersonRes>> internal(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long promoId) {
        return ApiResponse.ok(service.searchInternal(principal, promoId));
    }

    /** AS-IS biz.Biz02_Person.selectByExternal */
    @GetMapping("/external")
    public ApiResponse<List<BizPersonRes>> external(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long promoId) {
        return ApiResponse.ok(service.searchExternal(principal, promoId));
    }

    /** AS-IS biz.Biz02_Person.modelUpdate(직원 등록) → 추가한 건수 */
    @PostMapping("/internal")
    public ApiResponse<Integer> addEmps(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizPersonAddReq req) {
        return ApiResponse.ok(service.addEmps(principal, req.promoId(), req.empIds()));
    }

    /** AS-IS biz.Biz02_Person.insertEmpId → 새로 넣은 건수 */
    @PostMapping("/auto-register")
    public ApiResponse<Integer> autoRegister(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> promoIds) {
        return ApiResponse.ok(service.autoRegister(principal, promoIds));
    }

    /** AS-IS biz.Biz04_ProvideSetup.selectByProvideContentCode → 직원 자동등록 여부 */
    @GetMapping("/emp-set")
    public ApiResponse<Boolean> empSet(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String provideContentCode) {
        return ApiResponse.ok(service.getEmpSetYn(principal, provideContentCode));
    }

    /** AS-IS biz.Biz02_Person.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> personIds) {
        return ApiResponse.ok(service.delete(principal, personIds));
    }
}
