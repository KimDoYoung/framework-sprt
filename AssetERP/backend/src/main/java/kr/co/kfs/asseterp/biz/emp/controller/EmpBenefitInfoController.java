package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitInfoCopyReq;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitInfoRes;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitInfoSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpBenefitInfoService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 복리후생비 코드관리 (AS-IS Emp55_Tab_benefitInfoManager → server/emp/Emp55_BenefitInfo) — 메뉴 #1373 */
@RestController
@RequestMapping("/api/v1/emp/benefit-infos")
@RequiredArgsConstructor
public class EmpBenefitInfoController {

    private final EmpBenefitInfoService service;

    /** AS-IS emp.Emp55_BenefitInfo.selectBySearchText (companyId 없으면 로그인 회사) */
    @GetMapping
    public ApiResponse<List<BenefitInfoRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(required = false) Long companyId,
                                                    @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, companyId, searchText));
    }

    /** AS-IS emp.Emp55_BenefitInfo.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<BenefitInfoRes>> update(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(required = false) Long companyId,
                                                    @RequestBody List<BenefitInfoSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, companyId, rows));
    }

    /** AS-IS emp.Emp55_BenefitInfo.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam(required = false) Long companyId,
                                       @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, companyId, ids));
    }

    /** AS-IS emp.Emp55_BenefitInfo.insertInitData (기초데이터생성 — 관리자만) → 복사한 건수 */
    @PostMapping("/copy")
    public ApiResponse<Integer> insertInitData(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BenefitInfoCopyReq req) {
        return ApiResponse.ok(service.insertInitData(principal, req));
    }
}
