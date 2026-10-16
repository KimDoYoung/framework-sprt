package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.FamilyRes;
import kr.co.kfs.asseterp.biz.emp.dto.FamilySaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpFamilyService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 가족사항 탭 (AS-IS Emp06_TabPage_Family → server/emp/Emp06_Family) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpFamilyController {

    private final EmpFamilyService empFamilyService;

    @GetMapping("/persons/{personId}/families")
    public ApiResponse<List<FamilyRes>> getFamilies(@AuthenticationPrincipal UserPrincipal principal,
                                                    @PathVariable Long personId) {
        return ApiResponse.ok(empFamilyService.getFamilies(principal, personId));
    }

    @PutMapping("/families")
    public ApiResponse<List<FamilyRes>> updateFamilies(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestBody List<FamilySaveReq> rows) {
        return ApiResponse.ok(empFamilyService.updateFamilies(principal, rows));
    }

    @DeleteMapping("/families")
    public ApiResponse<Integer> deleteFamilies(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestBody List<Long> familyIds) {
        return ApiResponse.ok(empFamilyService.deleteFamilies(principal, familyIds));
    }
}
