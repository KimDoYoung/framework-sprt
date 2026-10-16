package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EducationCopyReq;
import kr.co.kfs.asseterp.biz.emp.dto.EducationRes;
import kr.co.kfs.asseterp.biz.emp.dto.EducationSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpEducationService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 교육사항 탭 (AS-IS Emp19_TabPage_education → server/emp/Emp19_Education.java) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpEducationController {

    private final EmpEducationService empEducationService;

    @GetMapping("/persons/{personId}/educations")
    public ApiResponse<List<EducationRes>> getEducations(@AuthenticationPrincipal UserPrincipal principal,
                                                         @PathVariable Long personId) {
        return ApiResponse.ok(empEducationService.getEducations(principal, personId));
    }

    @PutMapping("/educations")
    public ApiResponse<List<EducationRes>> updateEducations(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestBody List<EducationSaveReq> rows) {
        return ApiResponse.ok(empEducationService.updateEducations(principal, rows));
    }

    @DeleteMapping("/educations")
    public ApiResponse<Integer> deleteEducations(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestBody List<Long> educationIds) {
        return ApiResponse.ok(empEducationService.deleteEducations(principal, educationIds));
    }

    /** 일괄등록 (AS-IS emp.Emp19_Education.multiUpdate) */
    @PostMapping("/educations/copy")
    public ApiResponse<Integer> copyEducation(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestBody EducationCopyReq req) {
        return ApiResponse.ok(empEducationService.copyEducation(principal, req));
    }
}
