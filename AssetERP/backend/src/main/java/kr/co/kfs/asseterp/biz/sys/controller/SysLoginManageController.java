package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.LoginManageConfirmReq;
import kr.co.kfs.asseterp.biz.sys.dto.LoginManageRequestReq;
import kr.co.kfs.asseterp.biz.sys.dto.LoginManageRes;
import kr.co.kfs.asseterp.biz.sys.service.SysLoginManageService;
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

    /** AS-IS sys.Sys27_LoginManage.insert (Sys27_Lookup_Request) — 기기 등록 요청. 신청자는 로그인한 사용자. 이미 신청한 기기면 false */
    @PostMapping("/requests")
    public ApiResponse<Boolean> request(@AuthenticationPrincipal UserPrincipal principal, @RequestBody LoginManageRequestReq req) {
        return ApiResponse.ok(sysLoginManageService.request(principal, req.placeCode(), req.reason(), req.macAddress()));
    }
}
