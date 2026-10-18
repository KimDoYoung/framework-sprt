package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmRoleDescService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 책무기술서 재생성 (AS-IS Tdm31_Tab_RoleDescAdmin → server/tdm/Tdm31_RoleDesc) */
@RestController
@RequestMapping("/api/v1/tdm/role-descs")
@RequiredArgsConstructor
public class TdmRoleDescController {

    private final TdmRoleDescService service;

    /** AS-IS tdm.Tdm31_RoleDesc.selectByRegDateAdmin */
    @GetMapping
    public ApiResponse<List<RoleDescRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(required = false) Long companyId,
                                                 @RequestParam(required = false) String startDate,
                                                 @RequestParam(required = false) String closeDate,
                                                 @RequestParam(required = false) String searchText,
                                                 @RequestParam(defaultValue = "true") boolean endYn,
                                                 @RequestParam(defaultValue = "true") boolean notPeriodYn) {
        return ApiResponse.ok(service.search(principal, companyId, startDate, closeDate, searchText, endYn, notPeriodYn));
    }

    /** 한 건 재생성 (AS-IS createRd 한 건 분량 — 여러 건의 진행 표시는 화면이 건마다 부른다) */
    @PostMapping("/{roleDescId}/recreate")
    public ApiResponse<Void> recreate(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleDescId) {
        service.recreate(principal, roleDescId);
        return ApiResponse.ok(null);
    }
}
