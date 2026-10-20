package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawManageRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRelateManagerReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsRelateManagerService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 법규-관리그룹 연결 (AS-IS Ics01_Lookup_Share → server/ics/Ics05_RelateManager) — H08 */
@RestController
@RequestMapping("/api/v1/ics/relate-managers")
@RequiredArgsConstructor
public class IcsRelateManagerController {

    private final IcsRelateManagerService service;

    /** AS-IS ics.Ics05_RelateManager.selectByClassTreeId (없으면 ics.Ics02_Manager.getDefaultYn) — 법규의 현재 관리그룹 */
    @GetMapping
    public ApiResponse<IcsManagerRes> get(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId) {
        return ApiResponse.ok(service.getByClassTree(principal, classTreeId));
    }

    /** AS-IS ics.Ics05_RelateManager.relateUpdate → 바뀐 법규관리 행들 */
    @PutMapping
    public ApiResponse<List<IcsLawManageRes>> relateUpdate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsRelateManagerReq req) {
        return ApiResponse.ok(service.relateUpdate(principal, req.managerId(), req.classTreeIds()));
    }
}
