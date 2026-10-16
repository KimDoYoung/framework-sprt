package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.RelateFileRes;
import kr.co.kfs.asseterp.biz.emp.dto.RelateFileSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpRelateFileService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 연관파일 탭 (AS-IS Emp18_TabPage_RelateFile → server/emp/Emp18_RelateFile). 파일 자체는 파일 공통 API(B10 SysFileController) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpRelateFileController {

    private final EmpRelateFileService empRelateFileService;

    /** AS-IS Emp18_RelateFile.selectByPersonId */
    @GetMapping("/persons/{personId}/relate-files")
    public ApiResponse<List<RelateFileRes>> getRelateFiles(@AuthenticationPrincipal UserPrincipal principal,
                                                           @PathVariable Long personId) {
        return ApiResponse.ok(empRelateFileService.getRelateFiles(principal, personId));
    }

    /** AS-IS Emp18_RelateFile.update → UpdateDataModel */
    @PutMapping("/relate-files")
    public ApiResponse<List<RelateFileRes>> updateRelateFiles(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestBody List<RelateFileSaveReq> rows) {
        return ApiResponse.ok(empRelateFileService.updateRelateFiles(principal, rows));
    }

    /** AS-IS Emp18_RelateFile.delete → UpdateDataModel.deleteModel */
    @DeleteMapping("/relate-files")
    public ApiResponse<Integer> deleteRelateFiles(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestBody List<Long> relateFileIds) {
        return ApiResponse.ok(empRelateFileService.deleteRelateFiles(principal, relateFileIds));
    }
}
