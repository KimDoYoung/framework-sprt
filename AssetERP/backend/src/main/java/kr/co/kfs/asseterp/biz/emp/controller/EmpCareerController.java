package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.CareerRes;
import kr.co.kfs.asseterp.biz.emp.dto.CareerSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpCareerService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 경력사항 탭 (AS-IS Emp07_TabPage_Career → server/emp/Emp07_Career) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpCareerController {

    private final EmpCareerService empCareerService;

    @GetMapping("/persons/{personId}/careers")
    public ApiResponse<List<CareerRes>> getCareers(@AuthenticationPrincipal UserPrincipal principal,
                                                   @PathVariable Long personId,
                                                   @RequestParam(defaultValue = "false") boolean extrAddTitleYn) {
        return ApiResponse.ok(empCareerService.getCareers(principal, personId, extrAddTitleYn));
    }

    @PutMapping("/careers")
    public ApiResponse<List<CareerRes>> updateCareers(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestBody List<CareerSaveReq> rows) {
        return ApiResponse.ok(empCareerService.updateCareers(principal, rows));
    }

    @DeleteMapping("/careers")
    public ApiResponse<Integer> deleteCareers(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestBody List<Long> careerIds) {
        return ApiResponse.ok(empCareerService.deleteCareers(principal, careerIds));
    }
}
