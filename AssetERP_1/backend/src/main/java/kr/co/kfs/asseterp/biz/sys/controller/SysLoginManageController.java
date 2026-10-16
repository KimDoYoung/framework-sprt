package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.LoginManageConfirmReq;
import kr.co.kfs.asseterp.biz.sys.dto.LoginManageRes;
import kr.co.kfs.asseterp.biz.sys.service.SysLoginManageService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 로그인 Mac 주소 관리 (AS-IS Sys27_Tab_LoginManage → server/sys/Sys27_LoginManage) — 관리자 전용 */
@RestController
@RequestMapping("/api/v1/sys/login-manages")
@RequiredArgsConstructor
public class SysLoginManageController {

    private final SysLoginManageService sysLoginManageService;

    /** AS-IS sys.Sys27_LoginManage.selectByText (companyId·personId '%' = 전체) */
    @GetMapping
    public ApiResponse<List<LoginManageRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(required = false) String companyId,
                                                    @RequestParam(required = false) String personId) {
        return ApiResponse.ok(sysLoginManageService.search(principal, companyId, personId));
    }

    /** AS-IS sys.Sys27_LoginManage.updateConfirmYn → 저장된 행 */
    @PutMapping("/{loginManageId}/confirm")
    public ApiResponse<LoginManageRes> updateConfirmYn(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long loginManageId,
                                                       @RequestBody LoginManageConfirmReq req) {
        return ApiResponse.ok(sysLoginManageService.updateConfirmYn(principal, loginManageId, req.personId(), req.confirmYn()));
    }
}
