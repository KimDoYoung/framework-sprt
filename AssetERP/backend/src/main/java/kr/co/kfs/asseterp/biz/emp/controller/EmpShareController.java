package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.ShareRes;
import kr.co.kfs.asseterp.biz.emp.dto.ShareSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpShareService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 출장 공유지정 (AS-IS Emp56_Lookup_Share → server/emp/Emp56_Share) */
@RestController
@RequestMapping("/api/v1/emp/shares")
@RequiredArgsConstructor
public class EmpShareController {

    private final EmpShareService service;

    /** AS-IS emp.Emp56_Share.selectByParentId */
    @GetMapping
    public ApiResponse<List<ShareRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long parentId) {
        return ApiResponse.ok(service.search(principal, parentId));
    }

    /** AS-IS emp.Emp56_Share.delete + update + selectShareInfo → 공유명 */
    @PutMapping("/{parentId}")
    public ApiResponse<String> save(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long parentId, @RequestBody ShareSaveReq req) {
        return ApiResponse.ok(service.save(principal, parentId, req));
    }
}
