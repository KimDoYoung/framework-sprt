package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardCloseReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardCompareRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardManagementPrintReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardManagementRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardManagementUpdateReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardMessageReq;
import kr.co.kfs.asseterp.biz.biz.service.BizCardManagementService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 법인카드 내역관리 (AS-IS Biz01_Tab_CardManagement → server/biz/Biz01_Promo, sys/Sys99_Print.insertRdCardManagement) */
@RestController
@RequestMapping("/api/v1/biz/card-managements")
@RequiredArgsConstructor
public class BizCardManagementController {

    private final BizCardManagementService service;

    /** AS-IS biz.Biz01_Promo.selectByPaging — 관리자·제공목적 `%`는 전체 */
    @GetMapping
    public ApiResponse<PageRes<BizCardManagementRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestParam String dataYm,
                                                             @RequestParam(defaultValue = "%") String managerId,
                                                             @RequestParam(defaultValue = "%") String providePurCode,
                                                             @RequestParam(defaultValue = "") String searchText,
                                                             @RequestParam(defaultValue = "0") long offset,
                                                             @RequestParam(defaultValue = "500") long limit) {
        return ApiResponse.ok(service.search(principal, dataYm, managerId, providePurCode, searchText, offset, limit));
    }

    /** AS-IS LoginUser.getCompanyModel().getCardRealUserYn() — 폼의 실사용자 칸을 보일지 */
    @GetMapping("/real-user")
    public ApiResponse<Boolean> realUser(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.isCardRealUser(principal));
    }

    /** AS-IS biz.Biz01_Promo.compareCheck — 업로드 내역과 금액이 다른 건(비면 같음) */
    @GetMapping("/compare")
    public ApiResponse<List<BizCardCompareRes>> compare(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String dataYm) {
        return ApiResponse.ok(service.compare(principal, dataYm));
    }

    /** AS-IS biz.Biz01_Promo.cardClose — 마감(P)·취소(C). 실패하면 업무 예외(메시지) */
    @PostMapping("/close")
    public ApiResponse<Void> close(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizCardCloseReq req) {
        service.close(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS biz.Biz01_Promo.modelUpdate (Biz01_Edit_Account) → 저장한 건수 */
    @PutMapping("/{promoId}")
    public ApiResponse<Integer> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long promoId,
                                       @RequestBody BizCardManagementUpdateReq req) {
        return ApiResponse.ok(service.update(principal, promoId, req));
    }

    /** AS-IS sys.Sys99_Print.insertRdCardManagement → 출력 그룹 ID (엑셀용) */
    @PostMapping("/rd-download")
    public ApiResponse<String> rdDownload(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizCardManagementPrintReq req) {
        return ApiResponse.ok(service.insertRd(principal, req));
    }

    /** AS-IS biz.Biz01_Promo.sendMessage — 마감 알림 문자 */
    @PostMapping("/messages")
    public ApiResponse<Void> sendMessage(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizCardMessageReq req) {
        service.sendMessage(principal, req);
        return ApiResponse.ok(null);
    }
}
