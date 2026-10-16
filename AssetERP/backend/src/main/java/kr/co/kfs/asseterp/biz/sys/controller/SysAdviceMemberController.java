package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AdviceMemberRes;
import kr.co.kfs.asseterp.biz.sys.dto.AdviceMemberSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysAdviceMemberService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** AssetERP 자문위원 (AS-IS Sys91_Tab_AdviceMember → server/sys/Sys91_AdviceMember) — 메뉴 #1301(모든 회사 조회)·#1302(관리자 편집) */
@RestController
@RequestMapping("/api/v1/sys/advice-members")
@RequiredArgsConstructor
public class SysAdviceMemberController {

    private final SysAdviceMemberService service;

    /** AS-IS sys.Sys91_AdviceMember.selectByAll */
    @GetMapping
    public ApiResponse<List<AdviceMemberRes>> search() {
        return ApiResponse.ok(service.search());
    }

    /** AS-IS sys.Sys91_AdviceMember.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<AdviceMemberRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<AdviceMemberSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sys.Sys91_AdviceMember.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
