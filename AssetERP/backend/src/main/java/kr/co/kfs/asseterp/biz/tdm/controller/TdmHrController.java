package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.HrApplyReq;
import kr.co.kfs.asseterp.biz.tdm.dto.HrChangeRes;
import kr.co.kfs.asseterp.biz.tdm.dto.HrLookupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.HrRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmHrService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 임원(인사) 정보 (AS-IS server/tdm/Tdm01_Hr) */
@RestController
@RequestMapping("/api/v1/tdm/hrs")
@RequiredArgsConstructor
public class TdmHrController {

    private final TdmHrService service;

    /** AS-IS tdm.Tdm01_Hr.selectByEndDate — 임원선택 조회창 */
    @GetMapping("/lookup")
    public ApiResponse<List<HrLookupRes>> lookup(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.lookup(principal, searchText));
    }

    /** AS-IS tdm.Tdm01_Hr.selectByCompanyId — 임원 등록 목록 */
    @GetMapping
    public ApiResponse<List<HrRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam(defaultValue = "true") boolean exceptRetireYn,
                                           @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, exceptRetireYn, searchText));
    }

    /** AS-IS tdm.Tdm01_Hr.selectPersonModifyed — 인사정보 가져오기(신규·변동·제외) */
    @GetMapping("/changes")
    public ApiResponse<List<HrChangeRes>> searchChanges(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchChanges(principal));
    }

    /** AS-IS tdm.Tdm01_Hr.updateHrInfo — 변동 후 인사정보 적용 */
    @PostMapping("/changes/apply")
    public ApiResponse<Void> applyChanges(@AuthenticationPrincipal UserPrincipal principal,
                                          @RequestBody List<HrApplyReq> rows) {
        service.applyChanges(principal, rows);
        return ApiResponse.ok(null);
    }
}
