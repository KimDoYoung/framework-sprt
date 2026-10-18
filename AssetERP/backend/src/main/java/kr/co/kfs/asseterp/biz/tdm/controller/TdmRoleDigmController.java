package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmRoleDigmService;
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

/** 책무체계도 재생성 (AS-IS Tdm32_Tab_RoleDigmAdmin → server/tdm/Tdm32_RoleDigm·Tdm33_RoleDigmFile) */
@RestController
@RequestMapping("/api/v1/tdm/role-digms")
@RequiredArgsConstructor
public class TdmRoleDigmController {

    private final TdmRoleDigmService service;

    /** AS-IS tdm.Tdm32_RoleDigm.selectByRegDateAdmin */
    @GetMapping
    public ApiResponse<List<RoleDigmRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(required = false) Long companyId,
                                                 @RequestParam(required = false) String startDate,
                                                 @RequestParam(required = false) String closeDate,
                                                 @RequestParam(defaultValue = "true") boolean endYn,
                                                 @RequestParam(defaultValue = "true") boolean notPeriodYn) {
        return ApiResponse.ok(service.search(principal, companyId, startDate, closeDate, endYn, notPeriodYn));
    }

    /** AS-IS tdm.Tdm33_RoleDigmFile.selectByFileType → 파일정보 ID들 (첫 건의 ID로 sys/files?parentId=) */
    @GetMapping("/{roleDigmId}/file-ids")
    public ApiResponse<List<Long>> fileIds(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleDigmId, @RequestParam String fileType) {
        return ApiResponse.ok(service.fileIds(principal, roleDigmId, fileType));
    }

    /** 한 건 재생성 (AS-IS createRd 한 건 분량 — 여러 건의 진행 표시는 화면이 건마다 부른다) */
    @PostMapping("/{roleDigmId}/recreate")
    public ApiResponse<Void> recreate(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleDigmId) {
        service.recreate(principal, roleDigmId);
        return ApiResponse.ok(null);
    }
}
