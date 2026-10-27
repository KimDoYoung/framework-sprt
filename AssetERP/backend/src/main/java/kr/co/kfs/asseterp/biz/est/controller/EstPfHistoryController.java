package kr.co.kfs.asseterp.biz.est.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.est.dto.PfConfirmerRes;
import kr.co.kfs.asseterp.biz.est.dto.PfFileRes;
import kr.co.kfs.asseterp.biz.est.dto.PfHistoryRes;
import kr.co.kfs.asseterp.biz.est.dto.PfHistorySaveReq;
import kr.co.kfs.asseterp.biz.est.service.EstPfHistoryService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 용역수행내역 등록 (AS-IS Est03_Tab_PfHistory → server/est/Est03_PfHistory·Est04_PfFile) — 메뉴 #1377 */
@RestController
@RequestMapping("/api/v1/est/pf-histories")
@RequiredArgsConstructor
public class EstPfHistoryController {

    private final EstPfHistoryService service;

    /** AS-IS est.Est03_PfHistory.selectByPfContractId */
    @GetMapping
    public ApiResponse<List<PfHistoryRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long pfContractId) {
        return ApiResponse.ok(service.search(principal, pfContractId));
    }

    /** AS-IS dbConfig.getSeq — [등록] 행·[행 추가] 증빙 행의 새 번호 */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS est.Est03_PfHistory.getConfirmerParent — 로그인 사용자의 승인자 */
    @GetMapping("/confirmer-parent")
    public ApiResponse<PfConfirmerRes> confirmerParent(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.ok(service.confirmerParent(principal, date));
    }

    /** AS-IS est.Est04_PfFile.selectByPfHistoryId */
    @GetMapping("/{pfHistoryId}/files")
    public ApiResponse<List<PfFileRes>> searchFiles(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long pfHistoryId) {
        return ApiResponse.ok(service.searchFiles(principal, pfHistoryId));
    }

    /** AS-IS est.Est04_PfFile.update·delete + est.Est03_PfHistory.modelUpdate → 저장된 행 */
    @PutMapping
    public ApiResponse<PfHistoryRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PfHistorySaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS est.Est03_PfHistory.delete */
    @DeleteMapping
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> pfHistoryIds) {
        service.delete(principal, pfHistoryIds);
        return ApiResponse.ok(null);
    }

    /** AS-IS est.Est03_PfHistory.selectByConfirmer01 (Q11 일자기준) — 내가 승인자인 내역 */
    @GetMapping("/confirm")
    public ApiResponse<List<PfHistoryRes>> searchByConfirmer(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                             @RequestParam(required = false, defaultValue = "") String searchText,
                                                             @RequestParam(defaultValue = "false") boolean confirm) {
        return ApiResponse.ok(service.searchByConfirmer(principal, startDate, searchText, confirm));
    }

    /** AS-IS est.Est03_PfHistory.selectByConfirmer02 (Q11 체결용역 기준) */
    @GetMapping("/confirm/by-contract")
    public ApiResponse<List<PfHistoryRes>> searchByConfirmerContract(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long pfContractId) {
        return ApiResponse.ok(service.searchByConfirmerContract(principal, pfContractId));
    }

    /** AS-IS est.Est03_PfHistory.updateConfirm — confirm=true 승인, false 승인취소 */
    @PutMapping("/{pfHistoryId}/confirm")
    public ApiResponse<Void> updateConfirm(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long pfHistoryId, @RequestParam boolean confirm) {
        service.updateConfirm(principal, pfHistoryId, confirm);
        return ApiResponse.ok(null);
    }
}
