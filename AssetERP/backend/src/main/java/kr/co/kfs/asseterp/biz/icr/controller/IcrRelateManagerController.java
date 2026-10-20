package kr.co.kfs.asseterp.biz.icr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRelateManagerReq;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRuleRes;
import kr.co.kfs.asseterp.biz.icr.service.IcrRelateManagerService;
import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRes;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** 내규-관리그룹 연결 (AS-IS Icr01_Lookup_Share → server/icr/Icr05_RelateManager) — H09. 관리그룹 목록·공유는 `ics/managers` */
@RestController
@RequestMapping("/api/v1/icr/relate-managers")
@RequiredArgsConstructor
public class IcrRelateManagerController {

    private final IcrRelateManagerService service;

    /** AS-IS icr.Icr05_RelateManager.selectByClassTreeId (없으면 ics.Ics02_Manager.getDefaultYn) — 내규의 현재 관리그룹 */
    @GetMapping
    public ApiResponse<IcsManagerRes> get(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId) {
        return ApiResponse.ok(service.getByClassTree(principal, classTreeId));
    }

    /** AS-IS icr.Icr05_RelateManager.relateUpdate → 바뀐 내규 행 */
    @PutMapping
    public ApiResponse<IcrRuleRes> relateUpdate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcrRelateManagerReq req) {
        return ApiResponse.ok(service.relateUpdate(principal, req.managerId(), req.classTreeId()));
    }
}
