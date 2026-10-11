package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.AcademicRes;
import kr.co.kfs.asseterp.biz.emp.dto.AcademicSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpAcademicService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 학력정보 탭 (AS-IS Emp05_TabPage_Academic → server/emp/Emp05_Academic) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpAcademicController {

    private final EmpAcademicService empAcademicService;

    @GetMapping("/persons/{personId}/academics")
    public ApiResponse<List<AcademicRes>> getAcademics(@AuthenticationPrincipal UserPrincipal principal,
                                                       @PathVariable Long personId) {
        return ApiResponse.ok(empAcademicService.getAcademics(principal, personId));
    }

    @PutMapping("/academics")
    public ApiResponse<List<AcademicRes>> updateAcademics(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestBody List<AcademicSaveReq> rows) {
        return ApiResponse.ok(empAcademicService.updateAcademics(principal, rows));
    }

    @DeleteMapping("/academics")
    public ApiResponse<Integer> deleteAcademics(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestBody List<Long> academicIds) {
        return ApiResponse.ok(empAcademicService.deleteAcademics(principal, academicIds));
    }
}
