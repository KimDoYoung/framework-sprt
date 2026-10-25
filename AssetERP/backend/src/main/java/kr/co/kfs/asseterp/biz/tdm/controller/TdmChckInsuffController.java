package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmChckInsuffService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 미흡/개선 내역(조치계획) — 조치계획 등록 (AS-IS Tdm54_Edit_ChckInsuff, N22) → server/tdm/Tdm54_ChckInsuff */
@RestController
@RequestMapping("/api/v1/tdm/chck-insuffs")
@RequiredArgsConstructor
public class TdmChckInsuffController {

    private final TdmChckInsuffService service;

    /** AS-IS tdm.Tdm54_ChckInsuff.selectByChckManlId — 없으면 data가 null */
    @GetMapping("/by-manl")
    public ApiResponse<ChckInsuffRes> searchByManl(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long chckManlId) {
        return ApiResponse.ok(service.searchByManl(principal, chckManlId));
    }

    /** AS-IS tdm.Tdm54_ChckInsuff.modelUpdate */
    @PutMapping
    public ApiResponse<ChckInsuffRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ChckInsuffSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }
}
