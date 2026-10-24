package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleAllcPersonRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescCompanyRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescRes;
import kr.co.kfs.asseterp.biz.tdm.dto.RoleDescSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmRoleDescService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 책무기술서 재생성(AS-IS Tdm31_Tab_RoleDescAdmin)·작성(Tdm31_Tab_RoleDesc) → server/tdm/Tdm31_RoleDesc */
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

    /** AS-IS tdm.Tdm31_RoleDesc.selectByRegDate — 로그인 회사의 책무기술서 (N12) */
    @GetMapping("/company")
    public ApiResponse<List<RoleDescCompanyRes>> searchCompany(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam(required = false) String startDate,
                                                               @RequestParam(required = false) String closeDate,
                                                               @RequestParam(required = false) String searchText,
                                                               @RequestParam(defaultValue = "false") boolean notEndYn,
                                                               @RequestParam(defaultValue = "true") boolean notPeriodYn) {
        return ApiResponse.ok(service.searchCompany(principal, startDate, closeDate, searchText, notEndYn, notPeriodYn));
    }

    /** AS-IS tdm.Tdm30_RoleAllc.selectPerson — 책무기술서 등록 조회창 (N12) */
    @GetMapping("/persons")
    public ApiResponse<List<RoleAllcPersonRes>> searchPersons(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                              @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchPersons(principal, stdDate, searchText));
    }

    /** AS-IS tdm.Tdm31_RoleDesc.update — roleDescId ≤ 0이면 등록 */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<RoleDescSaveReq> rows) {
        service.save(principal, rows);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm31_RoleDesc.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam List<Long> roleDescIds) {
        return ApiResponse.ok(service.delete(principal, roleDescIds));
    }

    /** AS-IS tdm.Tdm31_RoleDesc.aprWorkCheck — 1분 안에 작업 중이면 true */
    @GetMapping("/{roleDescId}/working")
    public ApiResponse<Boolean> isWorking(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long roleDescId) {
        return ApiResponse.ok(service.isWorking(principal, roleDescId));
    }
}
