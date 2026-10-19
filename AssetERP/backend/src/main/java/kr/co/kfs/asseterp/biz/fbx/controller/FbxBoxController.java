package kr.co.kfs.asseterp.biz.fbx.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fbx.dto.FbxBoxRes;
import kr.co.kfs.asseterp.biz.fbx.dto.FbxBoxSaveReq;
import kr.co.kfs.asseterp.biz.fbx.service.FbxBoxService;
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

/** 파일보관함 (AS-IS Fbx01_Tab_Document 위 그리드 → server/fbx/Fbx01_Box) */
@RestController
@RequestMapping("/api/v1/fbx/boxes")
@RequiredArgsConstructor
public class FbxBoxController {

    private final FbxBoxService service;

    /** AS-IS fbx.Fbx01_Box.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<FbxBoxRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, searchText));
    }

    /** AS-IS fbx.Fbx01_Box.update: 추가·변경 행 → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<FbxBoxRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<FbxBoxSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS fbx.Fbx01_Box.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
