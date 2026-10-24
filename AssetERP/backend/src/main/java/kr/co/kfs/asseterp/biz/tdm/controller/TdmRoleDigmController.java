package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmCompanyRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDigmSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmRoleDigmService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 책무체계도 재생성(AS-IS Tdm32_Tab_RoleDigmAdmin)·작성(Tdm32_Tab_RoleDigm) → server/tdm/Tdm32_RoleDigm·Tdm33_RoleDigmFile */
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

    /** AS-IS tdm.Tdm33_RoleDigmFile.fileCheck → tdm.Tdm32_RoleDigm.selectByRegDate (N13, 로그인 회사만) */
    @GetMapping("/company")
    public ApiResponse<List<RoleDigmCompanyRes>> searchCompany(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam(required = false) String startDate,
                                                               @RequestParam(required = false) String closeDate,
                                                               @RequestParam(defaultValue = "false") boolean notEndYn,
                                                               @RequestParam(defaultValue = "true") boolean notPeriodYn) {
        return ApiResponse.ok(service.searchCompany(principal, startDate, closeDate, notEndYn, notPeriodYn));
    }

    /** AS-IS tdm.Tdm32_RoleDigm.update — roleDigmId ≤ 0이면 등록 */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<RoleDigmSaveReq> rows) {
        service.save(principal, rows);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm32_RoleDigm.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam List<Long> roleDigmIds) {
        return ApiResponse.ok(service.delete(principal, roleDigmIds));
    }

    /** AS-IS tdm.Tdm33_RoleDigmFile.insertByRoleDigmId → 파일정보 ID (첨부는 sys/files?parentId=로 올린다) */
    @PostMapping("/{roleDigmId}/files")
    public ApiResponse<Long> createFileInfo(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleDigmId, @RequestParam String fileType) {
        return ApiResponse.ok(service.createFileInfo(principal, roleDigmId, fileType));
    }

    /** AS-IS tdm.Tdm33_RoleDigmFile.deleteByRoleDigmId */
    @DeleteMapping("/{roleDigmId}/files")
    public ApiResponse<Void> deleteFileInfo(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleDigmId, @RequestParam String fileType) {
        service.deleteFileInfo(principal, roleDigmId, fileType);
        return ApiResponse.ok(null);
    }

    /** 한 건 재생성 (AS-IS createRd 한 건 분량 — 여러 건의 진행 표시는 화면이 건마다 부른다) */
    @PostMapping("/{roleDigmId}/recreate")
    public ApiResponse<Void> recreate(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleDigmId) {
        service.recreate(principal, roleDigmId);
        return ApiResponse.ok(null);
    }
}
