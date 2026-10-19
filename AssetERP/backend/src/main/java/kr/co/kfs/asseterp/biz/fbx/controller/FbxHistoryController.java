package kr.co.kfs.asseterp.biz.fbx.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fbx.dto.FbxHistoryRes;
import kr.co.kfs.asseterp.biz.fbx.service.FbxHistoryService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 파일보관함 기록 (AS-IS Fbx02_Popup_History → server/fbx/Fbx02_History) */
@RestController
@RequestMapping("/api/v1/fbx/histories")
@RequiredArgsConstructor
public class FbxHistoryController {

    private final FbxHistoryService service;

    /** AS-IS fbx.Fbx02_History.selectByBoxId */
    @GetMapping
    public ApiResponse<List<FbxHistoryRes>> searchByBoxId(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long boxId) {
        return ApiResponse.ok(service.searchByBoxId(principal, boxId));
    }
}
