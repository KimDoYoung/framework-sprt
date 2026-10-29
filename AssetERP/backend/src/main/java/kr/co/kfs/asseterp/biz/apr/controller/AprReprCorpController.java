package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprReprCorpLookupRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprReprCorpRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprReprCorpSaveReq;
import kr.co.kfs.asseterp.biz.apr.service.AprReprCorpService;
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

/** 추가 대표명의 (AS-IS Apr15_Tab_ReprCorp → server/apr/Apr15_ReprCorp, G08) */
@RestController
@RequestMapping("/api/v1/apr/repr-corps")
@RequiredArgsConstructor
public class AprReprCorpController {

    private final AprReprCorpService service;

    /** AS-IS apr.Apr15_ReprCorp.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<AprReprCorpRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS apr.Apr15_ReprCorp.update → 저장된 행 */
    @PutMapping
    public ApiResponse<List<AprReprCorpRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<AprReprCorpSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS apr.Apr15_ReprCorp.delete → 지운 건수. 사용이력이 있으면 400 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS Apr15_ReprCorp.selectByCompanyId (Apr15_Lookup_ReprCorp) */
    @GetMapping("/lookup")
    public ApiResponse<List<AprReprCorpLookupRes>> searchLookup(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestParam(defaultValue = "false") boolean companyAddYn) {
        return ApiResponse.ok(service.searchLookup(principal, companyAddYn));
    }

    /** AS-IS Apr15_ReprCorp.selectCorpRegYn — 등록 대표명의가 있는가 */
    @GetMapping("/corp-reg-exists")
    public ApiResponse<Boolean> existsCorpReg(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.existsCorpReg(principal));
    }
}
