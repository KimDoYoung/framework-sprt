package kr.co.kfs.asseterp.biz.act.controller;

import kr.co.kfs.asseterp.biz.act.dto.RealAccountMapInitReq;
import kr.co.kfs.asseterp.biz.act.dto.RealAccountMapRes;
import kr.co.kfs.asseterp.biz.act.dto.RealAccountMapSaveReq;
import kr.co.kfs.asseterp.biz.act.service.ActRealAccountMapService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 실계정맵핑 (AS-IS Act13_Tab_RealAccountMap(메뉴 #1169·#1163) → server/act/Act13_RealAccountMap) */
@RestController
@RequestMapping("/api/v1/act/real-account-maps")
@RequiredArgsConstructor
public class ActRealAccountMapController {

    private final ActRealAccountMapService service;

    /** AS-IS act.Act13_RealAccountMap.selectByCompanyId (로그인 회사) */
    @GetMapping
    public ApiResponse<List<RealAccountMapRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, searchText));
    }

    /** AS-IS act.Act13_RealAccountMap.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<RealAccountMapRes>> update(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestBody List<RealAccountMapSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS act.Act13_RealAccountMap.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS act.Act13_RealAccountMap.insertInitData (기초데이터생성 — 관리자만) → 처리한 고객사 수 */
    @PostMapping("/init-data")
    public ApiResponse<Integer> insertInitData(@AuthenticationPrincipal UserPrincipal principal, @RequestBody RealAccountMapInitReq req) {
        return ApiResponse.ok(service.insertInitData(principal, req));
    }
}
