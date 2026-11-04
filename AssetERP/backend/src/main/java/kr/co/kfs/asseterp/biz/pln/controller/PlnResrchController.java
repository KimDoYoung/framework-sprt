package kr.co.kfs.asseterp.biz.pln.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pln.dto.PlnResrchRes;
import kr.co.kfs.asseterp.biz.pln.dto.PlnResrchSaveReq;
import kr.co.kfs.asseterp.biz.pln.service.PlnResrchService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 리서치 일정등록 창 (AS-IS Pln03_Lookup_ResrchDetail → server/pln/Pln03_Resrch) */
@RestController
@RequestMapping("/api/v1/pln/resrches")
@RequiredArgsConstructor
public class PlnResrchController {

    private final PlnResrchService service;

    /** AS-IS pln.Pln03_Resrch.selectDetailInit — 새 건 초기값(새 번호 포함) */
    @GetMapping("/init")
    public ApiResponse<PlnResrchRes> init(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.init(principal));
    }

    /** AS-IS pln.Pln03_Resrch.selectById */
    @GetMapping("/{resrchId}")
    public ApiResponse<PlnResrchRes> get(@PathVariable Long resrchId) {
        return ApiResponse.ok(service.get(resrchId));
    }

    /** AS-IS pln.Pln03_Resrch.update */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PlnResrchSaveReq req) {
        service.save(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS pln.Pln03_Resrch.closeUpdate — close=true 승인요청, false 요청취소 */
    @PostMapping("/{resrchId}/close")
    public ApiResponse<Void> close(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long resrchId, @RequestParam boolean close) {
        service.close(principal, resrchId, close);
        return ApiResponse.ok(null);
    }

    /** AS-IS pln.Pln03_Resrch.apprUpdate — 확인자 승인 */
    @PostMapping("/{resrchId}/confirm")
    public ApiResponse<Void> confirm(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long resrchId) {
        service.confirm(principal, resrchId);
        return ApiResponse.ok(null);
    }
}
