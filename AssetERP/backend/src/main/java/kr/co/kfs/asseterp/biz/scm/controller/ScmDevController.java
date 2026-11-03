package kr.co.kfs.asseterp.biz.scm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.scm.dto.DevProgramRes;
import kr.co.kfs.asseterp.biz.scm.dto.DevProgramSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevRes;
import kr.co.kfs.asseterp.biz.scm.dto.DevSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepListReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepRes;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepResultReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepRuleListReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepRuleRes;
import kr.co.kfs.asseterp.biz.scm.dto.ExpectProgramRes;
import kr.co.kfs.asseterp.biz.scm.dto.ExpectProgramSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.ProgramRes;
import kr.co.kfs.asseterp.biz.scm.service.ScmDevProgramService;
import kr.co.kfs.asseterp.biz.scm.service.ScmDevService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 시스템 개발 관리 (AS-IS Scm01_Tab_DevMng → server/scm/Scm10_Dev·Scm03_ExpectProgram·Scm11_DevStep·Scm12_DevStepRule·Scm13_DevProgram·Scm30_Program) (EE16)
 */
@RestController
@RequestMapping("/api/v1/scm")
@RequiredArgsConstructor
public class ScmDevController {

    private final ScmDevService service;
    private final ScmDevProgramService programService;

    // ---- 개발자 (Scm10_Dev) ----

    /** AS-IS scm.Scm10_Dev.selectBySrId */
    @GetMapping("/devs")
    public ApiResponse<List<DevRes>> devs(@RequestParam Long srId) {
        return ApiResponse.ok(service.searchDevs(srId));
    }

    /** AS-IS scm.Scm10_Dev.updateList */
    @PutMapping("/devs")
    public ApiResponse<Void> saveDevs(@RequestBody List<DevSaveReq> devs) {
        service.saveDevs(devs);
        return ApiResponse.ok(null);
    }

    /** AS-IS scm.Scm11_DevStep.deleteByDevId + scm.Scm10_Dev.delete */
    @DeleteMapping("/devs")
    public ApiResponse<Integer> deleteDevs(@RequestBody List<Long> devIds) {
        return ApiResponse.ok(service.deleteDevs(devIds));
    }

    // ---- 예상프로그램 (Scm03_ExpectProgram) ----

    /** AS-IS scm.Scm03_ExpectProgram.selectBySrId */
    @GetMapping("/expect-programs")
    public ApiResponse<List<ExpectProgramRes>> expectPrograms(@RequestParam Long srId) {
        return ApiResponse.ok(service.searchExpectPrograms(srId));
    }

    /** AS-IS scm.Scm03_ExpectProgram.update */
    @PutMapping("/expect-programs")
    public ApiResponse<Void> saveExpectPrograms(@RequestBody List<ExpectProgramSaveReq> rows) {
        service.saveExpectPrograms(rows);
        return ApiResponse.ok(null);
    }

    /** AS-IS scm.Scm03_ExpectProgram.delete */
    @DeleteMapping("/expect-programs")
    public ApiResponse<Integer> deleteExpectPrograms(@RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteExpectPrograms(ids));
    }

    // ---- 진행단계 (Scm11_DevStep) ----

    /** AS-IS scm.Scm11_DevStep.selectByDevId */
    @GetMapping("/dev-steps")
    public ApiResponse<List<DevStepRes>> steps(@RequestParam Long devId) {
        return ApiResponse.ok(service.searchSteps(devId));
    }

    /** AS-IS scm.Scm11_DevStep.delete + inUpdateProgress */
    @PutMapping("/dev-steps")
    public ApiResponse<Void> saveSteps(@RequestParam Long devId, @RequestBody DevStepListReq req) {
        service.saveSteps(devId, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS scm.Scm11_DevStep.updateResult */
    @PutMapping("/dev-steps/{devStepId}/result")
    public ApiResponse<Void> updateStepResult(@PathVariable Long devStepId, @RequestBody DevStepResultReq req) {
        service.updateStepResult(devStepId, req.result());
        return ApiResponse.ok(null);
    }

    // ---- 진행단계 기본설정 (Scm12_DevStepRule) ----

    /** AS-IS scm.Scm12_DevStepRule.getList */
    @GetMapping("/dev-step-rules")
    public ApiResponse<List<DevStepRuleRes>> rules() {
        return ApiResponse.ok(service.searchRules());
    }

    /** AS-IS scm.Scm12_DevStepRule.delete + updateList */
    @PutMapping("/dev-step-rules")
    public ApiResponse<Void> saveRules(@RequestBody DevStepRuleListReq req) {
        service.saveRules(req);
        return ApiResponse.ok(null);
    }

    // ---- 개발 프로그램 (Scm13_DevProgram) ----

    /** AS-IS scm.Scm13_DevProgram.selectByDevId */
    @GetMapping("/dev-programs")
    public ApiResponse<List<DevProgramRes>> devPrograms(@RequestParam Long devId) {
        return ApiResponse.ok(programService.searchByDevId(devId));
    }

    /** AS-IS getSeq — 변경프로그램 등록 창이 열릴 때 받는 프로그램 번호 */
    @GetMapping("/dev-programs/next-id")
    public ApiResponse<Long> nextProgramId() {
        return ApiResponse.ok(programService.nextId());
    }

    /** AS-IS scm.Scm13_DevProgram.modelUpdate */
    @PutMapping("/dev-programs")
    public ApiResponse<Void> saveDevProgram(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DevProgramSaveReq req) {
        programService.save(principal, req);
        return ApiResponse.ok(null);
    }

    // ---- 프로그램 선택 (Scm30_Program) ----

    /** AS-IS scm.Scm30_Program.selectByTextPaging */
    @GetMapping("/programs")
    public ApiResponse<PageRes<ProgramRes>> programs(@RequestParam(defaultValue = "%") String systemCode,
                                                     @RequestParam(defaultValue = "%") String programType,
                                                     @RequestParam(defaultValue = "") String searchText,
                                                     @RequestParam(defaultValue = "0") int offset,
                                                     @RequestParam(defaultValue = "100") int limit) {
        return ApiResponse.ok(programService.searchPrograms(systemCode, programType, searchText, offset, limit));
    }
}
