package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.MyScreenLayoutSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.MyScreenPreset;
import kr.co.kfs.asseterp.biz.sys.dto.UserPropsRes;
import kr.co.kfs.asseterp.biz.sys.service.SysUserPropsService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 로그인 사용자 설정 — TOBE 재설계 03 "나의 화면 저장" (AS-IS 없음). 대상은 항상 토큰의 사용자 */
@RestController
@RequestMapping("/api/v1/sys/user-props/me")
@RequiredArgsConstructor
public class SysUserPropsController {

    private final SysUserPropsService service;

    /** 나의 화면 목록 + 사용자 설정 */
    @GetMapping
    public ApiResponse<UserPropsRes> getMine(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getMine(principal));
    }

    /** 나의 화면 목록 전체 저장(추가·덮어쓰기·삭제 모두 목록째) → 저장한 목록 */
    @PutMapping("/my-screen-layout")
    public ApiResponse<List<MyScreenPreset>> saveMyScreenLayout(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestBody MyScreenLayoutSaveReq req) {
        return ApiResponse.ok(service.saveMyScreenLayout(principal, req));
    }
}
