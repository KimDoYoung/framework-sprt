package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.ManagementTeamRes;
import kr.co.kfs.asseterp.biz.sys.dto.ManagementTeamSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysManagementTeamService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** AssetERP 관리팀 (AS-IS Sys92_Tab_ManagementTeam → server/sys/Sys92_ManagementTeam) — 메뉴 #1303(모든 회사 조회)·#1304(관리자 편집) */
@RestController
@RequestMapping("/api/v1/sys/management-teams")
@RequiredArgsConstructor
public class SysManagementTeamController {

    private final SysManagementTeamService service;

    /** AS-IS sys.Sys92_ManagementTeam.selectByAll */
    @GetMapping
    public ApiResponse<List<ManagementTeamRes>> search() {
        return ApiResponse.ok(service.search());
    }

    /** AS-IS sys.Sys92_ManagementTeam.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<ManagementTeamRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ManagementTeamSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sys.Sys92_ManagementTeam.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
