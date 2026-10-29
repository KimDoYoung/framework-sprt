package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EvalAdminRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalCandidateRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalCeoScoreReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalEndReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalExecuteRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalReasonReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalRelateApprRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalScoreReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalSettingRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalTargetDeleteReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalTargetEvaluatorsReq;
import kr.co.kfs.asseterp.biz.emp.dto.EvalTargetRes;
import kr.co.kfs.asseterp.biz.emp.dto.EvalTargetSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.HighInfoRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpEvalTargetService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 인사평가 대상자 (AS-IS Emp43_Tab_EvalTarget → server/emp/Emp43_EvalTarget) — 메뉴 #1392 */
@RestController
@RequestMapping("/api/v1/emp/eval-targets")
@RequiredArgsConstructor
public class EmpEvalTargetController {

    private final EmpEvalTargetService service;

    /** AS-IS sys.Sys01_Company.selectById — 로그인 회사의 인사평가 평가기간·시작월 */
    @GetMapping("/setting")
    public ApiResponse<EvalSettingRes> setting(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getSetting(principal));
    }

    /** AS-IS emp.Emp43_EvalTarget.selectByText (Emp43_Tab_EvalExecute) — 로그인 사원이 평가자인 대상자 */
    @GetMapping("/mine")
    public ApiResponse<List<EvalExecuteRes>> mine(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam String stdYear, @RequestParam String stdTermCode,
                                                  @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchExecutes(principal, stdYear, stdTermCode, searchText));
    }

    /** AS-IS emp.Emp45_EvalRelateAppr.selectByTermCode — 1차보고 상신문서 상태(없으면 null, 10·20·30이면 평가완료·취소 불가) */
    @GetMapping("/appr-status")
    public ApiResponse<String> apprStatus(@AuthenticationPrincipal UserPrincipal principal,
                                          @RequestParam String stdYear, @RequestParam String stdTermCode) {
        return ApiResponse.ok(service.getApprStatusCode(principal, stdYear, stdTermCode));
    }

    /** AS-IS emp.Emp43_EvalTarget.selectByTextAdmin (Emp43_Tab_FirstAppr·Emp43_Tab_FinalAppr) — 회사 전체 대상자 */
    @GetMapping("/admin")
    public ApiResponse<List<EvalAdminRes>> admin(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam String stdYear, @RequestParam String stdTermCode,
                                                 @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchAdmin(principal, stdYear, stdTermCode, searchText));
    }

    /** AS-IS emp.Emp45_EvalRelateAppr.selectByTermCode — 상신 상태(1차·최종 결재 문서), 상신 행이 없으면 null */
    @GetMapping("/relate-appr")
    public ApiResponse<EvalRelateApprRes> relateAppr(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam String stdYear, @RequestParam String stdTermCode) {
        return ApiResponse.ok(service.getRelateAppr(principal, stdYear, stdTermCode));
    }

    /** AS-IS emp.Emp43_EvalTarget.modelUpdate (Emp43_Edit_Score) — 상점·벌점·평정사유가감 */
    @PutMapping("/{evalTargetId}/score")
    public ApiResponse<Void> updateScore(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long evalTargetId, @RequestBody EvalScoreReq req) {
        service.updateScore(principal, evalTargetId, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp43_EvalTarget.modelUpdate (Emp43_Edit_CeoScore) — 대표이사 가점·감점 */
    @PutMapping("/{evalTargetId}/ceo-score")
    public ApiResponse<Void> updateCeoScore(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long evalTargetId, @RequestBody EvalCeoScoreReq req) {
        service.updateCeoScore(principal, evalTargetId, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp43_EvalTarget.getWrite — 평가상태('완료'·'작성중'·'') */
    @GetMapping("/{evalTargetId}/write-status")
    public ApiResponse<String> writeStatus(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long evalTargetId) {
        return ApiResponse.ok(service.getWriteStatus(principal, evalTargetId));
    }

    /** AS-IS emp.Emp43_EvalTarget.updateReason */
    @PutMapping("/{evalTargetId}/reason")
    public ApiResponse<Void> updateReason(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long evalTargetId, @RequestBody EvalReasonReq req) {
        service.updateReason(principal, evalTargetId, req.reason(), req.orderEvalName());
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp43_EvalTarget.updateEndYn */
    @PutMapping("/{evalTargetId}/end")
    public ApiResponse<Void> updateEnd(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long evalTargetId, @RequestBody EvalEndReq req) {
        service.updateEndYn(principal, evalTargetId, req.endYn(), req.orderEvalName());
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp43_EvalTarget.selectByTermCode */
    @GetMapping
    public ApiResponse<List<EvalTargetRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam String stdYear, @RequestParam String stdTermCode,
                                                   @RequestParam(required = false) Long orgId) {
        return ApiResponse.ok(service.search(principal, stdYear, stdTermCode, orgId));
    }

    /** AS-IS emp.Emp45_EvalRelateAppr.selectByTermCode — 최종 결재 상태 코드(없으면 null, 30 = 완료) */
    @GetMapping("/final-appr-status")
    public ApiResponse<String> finalApprStatus(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam String stdYear, @RequestParam String stdTermCode) {
        return ApiResponse.ok(service.getFinalApprStatusCode(principal, stdYear, stdTermCode));
    }

    /** AS-IS emp.Emp00_TransInfo.selectByEvalText (Emp43_Lookup_SelectMulti) */
    @GetMapping("/candidates")
    public ApiResponse<List<EvalCandidateRes>> candidates(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchCandidates(principal, searchText));
    }

    /** AS-IS emp.Emp00_TransInfo.getHighInfo — 상위 조직장(1차·2차 평가자 후보) */
    @GetMapping("/high-infos")
    public ApiResponse<List<HighInfoRes>> highInfos(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam Long personId, @RequestParam Long orgCodeId,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate transDate) {
        return ApiResponse.ok(service.getHighInfos(principal, personId, orgCodeId, transDate));
    }

    /** AS-IS emp.Emp44_EvalWrite.selectByEvaluatorId — 그 평가자의 작성 내역이 있는가 */
    @GetMapping("/writes/exists")
    public ApiResponse<Boolean> hasWrite(@AuthenticationPrincipal UserPrincipal principal,
                                         @RequestParam Long evalTargetId, @RequestParam Long personId) {
        return ApiResponse.ok(service.hasWrite(principal, evalTargetId, personId));
    }

    /** AS-IS emp.Emp43_EvalTarget.update · emp.Emp43_EvalTarget.updateList(deleteWrites) — 저장한 행을 요청 순서로 */
    @PutMapping
    public ApiResponse<List<EvalTargetRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody EvalTargetSaveReq req) {
        return ApiResponse.ok(service.save(principal, req.rows(), req.deleteWrites()));
    }

    /** AS-IS emp.Emp43_EvalTarget.deleteList → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody EvalTargetDeleteReq req) {
        return ApiResponse.ok(service.delete(principal, req.rows()));
    }

    /** AS-IS emp.Emp43_EvalTarget.updateEval (Emp43_Edit_ChangeEval) */
    @PutMapping("/evaluators")
    public ApiResponse<Void> changeEvaluators(@AuthenticationPrincipal UserPrincipal principal, @RequestBody EvalTargetEvaluatorsReq req) {
        service.changeEvaluators(principal, req);
        return ApiResponse.ok(null);
    }
}
