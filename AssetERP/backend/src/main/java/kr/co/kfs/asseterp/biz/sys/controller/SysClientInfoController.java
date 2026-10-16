package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.ClientInfoRes;
import kr.co.kfs.asseterp.biz.sys.dto.ClientInfoSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysClientInfoService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 고객사 정보 (AS-IS Sys85_Lookup_ClientInfoList → server/sys/Sys85_ClientInfo) — 문자발송 기타고객사 */
@RestController
@RequestMapping("/api/v1/sys/client-infos")
@RequiredArgsConstructor
public class SysClientInfoController {

    private final SysClientInfoService service;

    /** AS-IS sys.Sys85_ClientInfo.selectByText */
    @GetMapping
    public ApiResponse<List<ClientInfoRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, searchText));
    }

    /** AS-IS sys.Sys85_ClientInfo.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<ClientInfoRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ClientInfoSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sys.Sys85_ClientInfo.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
