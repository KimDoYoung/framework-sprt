package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprCorpStampRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampManageRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampSaveReq;
import kr.co.kfs.asseterp.biz.apr.service.AprStampService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 인감 (AS-IS Apr10_Lookup_DocStamp → server/apr/Apr10_Stamp) */
@RestController
@RequestMapping("/api/v1/apr/stamps")
@RequiredArgsConstructor
public class AprStampController {

    private final AprStampService service;

    /** AS-IS apr.Apr10_Stamp.selectBySearchText (Apr10_Lookup_Stamp, G06) — 내 조직이 쓸 수 있는 인감 */
    @GetMapping
    public ApiResponse<List<AprStampRes>> searchStamp(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchStamp(principal, searchText));
    }

    /** AS-IS apr.Apr10_Stamp.selectByCodeName (Apr10_Tab_Stamp, G07 인감 등록) */
    @GetMapping("/manage")
    public ApiResponse<List<AprStampManageRes>> searchManage(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchManage(principal));
    }

    /** AS-IS LoginUser.getOrgCodeId() — 새 행의 부서 기본값 (회사관리자는 0) */
    @GetMapping("/manage/my-org-code-id")
    public ApiResponse<Long> getMyOrgCodeId(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getMyOrgCodeId(principal));
    }

    /** AS-IS apr.Apr10_Stamp.update → 저장된 행 */
    @PutMapping("/manage")
    public ApiResponse<List<AprStampManageRes>> saveManage(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<AprStampSaveReq> rows) {
        return ApiResponse.ok(service.saveManage(principal, rows));
    }

    /** AS-IS apr.Apr10_Stamp.delete → 지운 건수 */
    @DeleteMapping("/manage")
    public ApiResponse<Integer> deleteManage(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteManage(principal, ids));
    }

    /** AS-IS apr.Apr10_Stamp.selectBySearchText2 — 문서분류에서 쓸 수 있는 인감 */
    @GetMapping("/doc")
    public ApiResponse<List<AprStampRes>> searchDocStamp(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam Long classTreeId,
                                                         @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchDocStamp(principal, classTreeId, searchText));
    }

    /** AS-IS apr.Apr10_Stamp.selectCorpStampYn — 기본 법인인감(없으면 data = null) */
    @GetMapping("/corp-stamp")
    public ApiResponse<AprCorpStampRes> getCorpStamp(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getCorpStamp(principal));
    }
}
