package kr.co.kfs.asseterp.biz.scm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.scm.dto.SrApprDecisionReq;
import kr.co.kfs.asseterp.biz.scm.dto.SrApprNoteReq;
import kr.co.kfs.asseterp.biz.scm.dto.SrApprStepReq;
import kr.co.kfs.asseterp.biz.scm.dto.SrApprStepRes;
import kr.co.kfs.asseterp.biz.scm.dto.SrContentReq;
import kr.co.kfs.asseterp.biz.scm.dto.SrDevMngSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.SrResultContentReq;
import kr.co.kfs.asseterp.biz.scm.dto.SrRes;
import kr.co.kfs.asseterp.biz.scm.dto.SrSaveReq;
import kr.co.kfs.asseterp.biz.scm.service.ScmSrApprStepService;
import kr.co.kfs.asseterp.biz.scm.service.ScmSrService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 시스템 개발 의뢰 (AS-IS Scm01_Tab_Sr → server/scm/Scm01_Sr·Scm02_SrApprStep) */
@RestController
@RequestMapping("/api/v1/scm/srs")
@RequiredArgsConstructor
public class ScmSrController {

    private final ScmSrService service;
    private final ScmSrApprStepService stepService;

    /** AS-IS scm.Scm01_Sr.selectByText */
    @GetMapping
    public ApiResponse<List<SrRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                           @RequestParam(required = false) String searchText,
                                           @RequestParam(defaultValue = "%") String systemCode,
                                           @RequestParam(defaultValue = "%") String srStatus,
                                           @RequestParam(defaultValue = "false") boolean checkBox01,
                                           @RequestParam(defaultValue = "false") boolean checkBox02,
                                           @RequestParam(defaultValue = "false") boolean checkBoxMyReg) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, searchText, systemCode, srStatus, checkBox01, checkBox02, checkBoxMyReg));
    }

    /** AS-IS scm.Scm01_Sr.selectByDevMng (EE16 Scm01_Tab_DevMng) — 승인 완료 의뢰 */
    @GetMapping("/dev-mng")
    public ApiResponse<List<SrRes>> searchDevMng(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                 @RequestParam(required = false) String searchText,
                                                 @RequestParam(defaultValue = "%") String systemCode,
                                                 @RequestParam(defaultValue = "%") String srStatus,
                                                 @RequestParam(defaultValue = "false") boolean checkBox01) {
        return ApiResponse.ok(service.searchDevMng(startDate, closeDate, searchText, systemCode, srStatus, checkBox01));
    }

    /** AS-IS scm.Scm01_Sr.update (Scm01_Edit_DevMng.updateRow, EE16) → 저장된 한 행 */
    @PutMapping("/{srId}/dev-mng")
    public ApiResponse<SrRes> saveDevMng(@PathVariable Long srId, @RequestBody SrDevMngSaveReq req) {
        return ApiResponse.ok(service.saveDevMng(srId, req));
    }

    /** AS-IS scm.Scm01_Sr.updateResultContent (Scm01_Lookup_ResultContent, EE16) */
    @PutMapping("/{srId}/result-content")
    public ApiResponse<Void> updateResultContent(@PathVariable Long srId, @RequestBody SrResultContentReq req) {
        service.updateResultContent(srId, req.resultContent());
        return ApiResponse.ok(null);
    }

    /** AS-IS scm.Scm01_Sr.getSrModel (EE17 Scm10_Tab_Dev·Scm11_Edit_DevStep) — 개발ID로 의뢰 한 건 */
    @GetMapping("/by-dev/{devId}")
    public ApiResponse<SrRes> getByDev(@PathVariable Long devId) {
        return ApiResponse.ok(service.getByDevId(devId));
    }

    /** AS-IS scm.Scm01_Sr.selectById */
    @GetMapping("/{srId}")
    public ApiResponse<SrRes> get(@PathVariable Long srId) {
        return ApiResponse.ok(service.get(srId));
    }

    /** AS-IS getSeq (Tab_Sr.insertRow 의 GridInsertRow) */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS scm.Scm01_Sr.update → 저장된 한 행 */
    @PutMapping
    public ApiResponse<SrRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody SrSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS scm.Scm01_Sr.updateContent */
    @PutMapping("/{srId}/content")
    public ApiResponse<Void> updateContent(@PathVariable Long srId, @RequestBody SrContentReq req) {
        service.updateContent(srId, req.srContent());
        return ApiResponse.ok(null);
    }

    /** AS-IS scm.Scm01_Sr.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(ids));
    }

    /** AS-IS scm.Scm02_SrApprStep.selectBySrId */
    @GetMapping("/{srId}/appr-steps")
    public ApiResponse<List<SrApprStepRes>> steps(@PathVariable Long srId) {
        return ApiResponse.ok(stepService.search(srId));
    }

    /** AS-IS scm.Scm02_SrApprStep.updateList */
    @PutMapping("/{srId}/appr-steps")
    public ApiResponse<List<SrApprStepRes>> saveSteps(@PathVariable Long srId, @RequestBody List<SrApprStepReq> steps) {
        return ApiResponse.ok(stepService.saveAll(srId, steps));
    }

    /** AS-IS Scm01_Edit_Sr.updateApprStep (scm.Scm02_SrApprStep.modelUpdate + 마지막이면 scm.Scm01_Sr.update) */
    @PutMapping("/appr-steps/{stepId}/decision")
    public ApiResponse<List<SrApprStepRes>> decide(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long stepId,
                                                   @RequestBody SrApprDecisionReq req) {
        return ApiResponse.ok(stepService.decide(principal, stepId, req.stepStatusCd(), req.last()));
    }

    /** AS-IS Scm02_Edit_NoteMessage.update (scm.Scm02_SrApprStep.modelUpdate) */
    @PutMapping("/appr-steps/{stepId}/note")
    public ApiResponse<Void> updateNote(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long stepId,
                                        @RequestBody SrApprNoteReq req) {
        stepService.updateNote(principal, stepId, req.note(), req.rejectReason());
        return ApiResponse.ok(null);
    }
}
