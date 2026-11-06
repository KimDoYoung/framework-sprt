package kr.co.kfs.asseterp.biz.scm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.scm.dto.DeployNoteReq;
import kr.co.kfs.asseterp.biz.scm.dto.DeployProgramRes;
import kr.co.kfs.asseterp.biz.scm.dto.DeployRes;
import kr.co.kfs.asseterp.biz.scm.service.ScmDeployService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 배포처리 (AS-IS Scm13_Tab_Deploy) (EE18) */
@RestController
@RequestMapping("/api/v1/scm")
@RequiredArgsConstructor
public class ScmDeployController {

    private final ScmDeployService service;

    /** AS-IS scm.Scm11_DevStep.selectByDeployPersonId — 로그인한 사람이 배포 담당인 개발 */
    @GetMapping("/deploys/search")
    public ApiResponse<List<DeployRes>> searchDeploys(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                      @RequestParam(required = false) String searchText,
                                                      @RequestParam(defaultValue = "%") String systemCode,
                                                      @RequestParam(defaultValue = "false") boolean checkBox) {
        return ApiResponse.ok(service.searchDeploys(startDate, closeDate, searchText, systemCode, checkBox, principal.getUserId()));
    }

    /** AS-IS scm.Scm13_DevProgram.selectByDeployTgtDevId */
    @GetMapping("/deploys/{devId}/programs")
    public ApiResponse<List<DeployProgramRes>> programs(@PathVariable Long devId) {
        return ApiResponse.ok(service.searchPrograms(devId));
    }

    /** AS-IS scm.Scm13_DevProgram.updateDeploy */
    @PutMapping("/deploys/programs/deploy")
    public ApiResponse<Void> deploy(@RequestBody List<Long> devProgramIds) {
        service.deploy(devProgramIds);
        return ApiResponse.ok(null);
    }

    /** AS-IS scm.Scm13_DevProgram.updateNote */
    @PutMapping("/deploys/programs/{devProgramId}/note")
    public ApiResponse<Void> updateNote(@PathVariable Long devProgramId, @RequestBody DeployNoteReq req) {
        service.updateNote(devProgramId, req.note());
        return ApiResponse.ok(null);
    }

    /** AS-IS scm.Scm13_DevProgram.updateResultDeploy */
    @PutMapping("/deploys/{devId}/complete")
    public ApiResponse<Void> complete(@PathVariable Long devId) {
        service.updateResultDeploy(devId);
        return ApiResponse.ok(null);
    }
}
