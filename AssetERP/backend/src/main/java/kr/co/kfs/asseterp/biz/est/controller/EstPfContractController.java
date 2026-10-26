package kr.co.kfs.asseterp.biz.est.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.est.dto.PfContractRes;
import kr.co.kfs.asseterp.biz.est.dto.PfContractSaveReq;
import kr.co.kfs.asseterp.biz.est.service.EstPfContractService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
}
