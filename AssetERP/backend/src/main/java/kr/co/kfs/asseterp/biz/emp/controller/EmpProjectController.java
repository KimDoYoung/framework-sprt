package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.ProjectRes;
import kr.co.kfs.asseterp.biz.emp.dto.ProjectSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpProjectService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 프로젝트 탭 (AS-IS Emp13_TabPage_Project → server/emp/emp13_project.xml) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpProjectController {

    private final EmpProjectService empProjectService;

    @GetMapping("/persons/{personId}/projects")
    public ApiResponse<List<ProjectRes>> getProjects(@AuthenticationPrincipal UserPrincipal principal,
                                                     @PathVariable Long personId) {
        return ApiResponse.ok(empProjectService.getProjects(principal, personId));
    }

    @PutMapping("/projects")
    public ApiResponse<List<ProjectRes>> updateProjects(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestBody List<ProjectSaveReq> rows) {
        return ApiResponse.ok(empProjectService.updateProjects(principal, rows));
    }

    @DeleteMapping("/projects")
    public ApiResponse<Integer> deleteProjects(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestBody List<Long> projectIds) {
        return ApiResponse.ok(empProjectService.deleteProjects(principal, projectIds));
    }
}
