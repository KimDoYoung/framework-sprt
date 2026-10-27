package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.AstManagerRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstManagerSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.Ast10ManagerService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ast/managers")
@RequiredArgsConstructor
public class Ast10ManagerController {

    private final Ast10ManagerService service;

    @GetMapping("/{linkId}")
    public ApiResponse<List<AstManagerRes>> search(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long linkId
    ) {
        return ApiResponse.ok(service.selectByLinkId(principal, linkId));
    }

    @PutMapping("/{linkId}")
    public ApiResponse<Void> save(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long linkId,
            @RequestBody List<AstManagerSaveReq> managers
    ) {
        service.saveManagers(principal, linkId, managers);
        return ApiResponse.ok(null);
    }

    @DeleteMapping
    public ApiResponse<Void> delete(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam List<Long> ids
    ) {
        service.deleteManagers(principal, ids);
        return ApiResponse.ok(null);
    }
}
