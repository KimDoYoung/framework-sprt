package kr.co.kfs.asseterp.biz.scm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.scm.dto.DevProgramRes;
import kr.co.kfs.asseterp.biz.scm.dto.DevProgramSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevRes;
import kr.co.kfs.asseterp.biz.scm.dto.DevSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevStatusRes;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepListReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepRes;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepResultReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepStatusReq;
import kr.co.kfs.asseterp.biz.scm.dto.DevStepUpdateReq;
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
import org.springframework.format.annotation.DateTimeFormat;
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

import java.time.LocalDate;
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

    // ---- 개발 탭 (Scm10_Tab_Dev, EE17) ----

    /** AS-IS scm.Scm10_Dev.selectByText */
    @GetMapping("/devs/search")
    public ApiResponse<List<DevRes>> searchDevs(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                @RequestParam(required = false) String searchText,
                                                @RequestParam(defaultValue = "%") String systemCode,
                                                @RequestParam(defaultValue = "%") String devStatus,
                                                @RequestParam(defaultValue = "false") boolean checkBox01,
                                                @RequestParam(defaultValue = "false") boolean checkBoxMyDev) {
        return ApiResponse.ok(service.searchDevsByText(startDate, closeDate, searchText, systemCode, devStatus,
                checkBox01, checkBoxMyDev, principal.getUserId()));
    }

    /** AS-IS sys.Sys00_Common.selectDevStatus — 상태 콤보 */
    @GetMapping("/dev-statuses")
    public ApiResponse<List<DevStatusRes>> devStatuses() {
        return ApiResponse.ok(service.searchDevStatuses());
    }

    /** AS-IS scm.Scm11_DevStep.checkMyTurn — true 면 수정할 수 있다 */
    @GetMapping("/dev-steps/{devStepId}/my-turn")
    public ApiResponse<Boolean> checkMyTurn(@PathVariable Long devStepId, @RequestParam Long devId) {
        return ApiResponse.ok(service.checkMyTurn(devId, devStepId));
    }

    /** AS-IS scm.Scm11_DevStep.updateStatus — 1 정상 / -1 수정 불가 */
    @PutMapping("/dev-steps/{devStepId}/status")
    public ApiResponse<Integer> updateStepStatus(@PathVariable Long devStepId, @RequestBody DevStepStatusReq req) {
        return ApiResponse.ok(service.updateStepStatus(devStepId, req));
    }

    /** AS-IS scm.Scm11_DevStep.modelUpdate */
    @PutMapping("/dev-steps/{devStepId}")
    public ApiResponse<Void> updateStep(@PathVariable Long devStepId, @RequestBody DevStepUpdateReq req) {
        service.updateStep(devStepId, req);
        return ApiResponse.ok(null);
    }

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

    /** AS-IS scm.Scm30_Program.updateUseYn(false) + scm.Scm13_DevProgram.delete (Scm13_Grid_DevProgram.deleteRow) */
    @DeleteMapping("/dev-programs/{devProgramId}")
    public ApiResponse<Void> deleteDevProgram(@PathVariable Long devProgramId, @RequestParam(required = false) Long programId) {
        programService.deleteDevProgram(devProgramId, programId);
        return ApiResponse.ok(null);
    }

    /** AS-IS FileUpload?mode=scm13 — 변경프로그램 파일일괄등록(Scm13_Lookup_MultiUpload). 올린 파일 수 */
    @PostMapping(value = "/dev-programs/multi-upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Integer> multiUpload(@AuthenticationPrincipal UserPrincipal principal,
                                            @RequestParam Long devId,
                                            @RequestParam(defaultValue = "false") boolean deployTgtYn,
                                            @RequestParam String systemCd,
                                            @RequestParam String programType,
                                            @RequestParam("files") List<org.springframework.web.multipart.MultipartFile> files) {
        return ApiResponse.ok(programService.multiUpload(principal, devId, deployTgtYn, systemCd, programType, files));
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
