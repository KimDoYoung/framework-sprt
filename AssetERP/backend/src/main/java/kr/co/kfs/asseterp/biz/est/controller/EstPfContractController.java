package kr.co.kfs.asseterp.biz.est.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.est.dto.PfContractApprIdReq;
import kr.co.kfs.asseterp.biz.est.dto.PfContractRes;
import kr.co.kfs.asseterp.biz.est.dto.PfContractSaveReq;
import kr.co.kfs.asseterp.biz.est.service.EstPfContractService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
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

/** 용역계약체결 (AS-IS Est02_Tab_PfContract → server/est/Est02_PfContract) — 메뉴 #1376 */
@RestController
@RequestMapping("/api/v1/est/pf-contracts")
@RequiredArgsConstructor
public class EstPfContractController {

    private final EstPfContractService service;

    /** AS-IS est.Est02_PfContract.selectByText */
    @GetMapping
    public ApiResponse<List<PfContractRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                   @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, startDate, searchText));
    }

    /** AS-IS dbConfig.getSeq — 등록 창의 새 번호 */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS est.Est02_PfContract.modelUpdate → 저장된 행 */
    @PutMapping
    public ApiResponse<PfContractRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PfContractSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS est.Est02_PfContract.delete */
    @DeleteMapping
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> pfContractIds) {
        service.delete(principal, pfContractIds);
        return ApiResponse.ok(null);
    }

    /** AS-IS est.Est03_PfHistory.checkList — 수정·삭제 전에 이 용역계약의 수행내역 건수를 본다 */
    @PostMapping("/history-count")
    public ApiResponse<Integer> countHistories(@RequestBody List<Long> pfContractIds) {
        return ApiResponse.ok(service.countHistories(pfContractIds));
    }

    /** AS-IS est.Est02_PfContract.updateApprId — 용역수행 계획서(A60) 결재 문서를 기록한다 */
    @PutMapping("/{pfContractId}/plan-appr-id")
    public ApiResponse<Void> updatePlanApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long pfContractId,
                                              @RequestBody @jakarta.validation.Valid PfContractApprIdReq req) {
        service.updateApprId(principal, pfContractId, req.apprId(), false);
        return ApiResponse.ok(null);
    }

    /** AS-IS est.Est02_PfContract.updateResultApprId — 용역 결과보고서(A61) 결재 문서를 기록한다 */
    @PutMapping("/{pfContractId}/result-appr-id")
    public ApiResponse<Void> updateResultApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long pfContractId,
                                                @RequestBody @jakarta.validation.Valid PfContractApprIdReq req) {
        service.updateApprId(principal, pfContractId, req.apprId(), true);
        return ApiResponse.ok(null);
    }

    /** AS-IS est.Est02_PfContract.selectById — Q11 승인취소 전에 결과보고서(resultApprId)가 있는지 본다 */
    @GetMapping("/{pfContractId}")
    public ApiResponse<PfContractRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long pfContractId) {
        return ApiResponse.ok(service.get(principal, pfContractId));
    }
}
