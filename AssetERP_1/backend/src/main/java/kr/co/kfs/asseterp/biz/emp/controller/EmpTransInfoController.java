package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.co.kfs.asseterp.biz.emp.dto.TransInfoCreateReq;
import kr.co.kfs.asseterp.biz.emp.dto.TransInfoRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

/** 사원정보 관리 목록·신규사원 등록 (AS-IS Emp00_Tab_TransInfo → server/emp/Emp00_TransInfo) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpTransInfoController {

    private final EmpTransInfoService empTransInfoService;

    /** AS-IS emp.Emp00_TransInfo.selectByText */
    @GetMapping("/trans-infos")
    public ApiResponse<List<TransInfoRes>> searchTransInfos(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate transDate,
                                                            @RequestParam(required = false) String searchText,
                                                            @RequestParam(required = false) String transCode) {
        return ApiResponse.ok(empTransInfoService.searchTransInfos(principal, transDate, searchText, transCode));
    }

    /** AS-IS emp.Emp00_TransInfo.update (신규사원 등록) → 등록된 행 */
    @PostMapping("/trans-infos")
    public ApiResponse<TransInfoRes> createTransInfo(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestBody TransInfoCreateReq req) {
        return ApiResponse.ok(empTransInfoService.createTransInfo(principal, req));
    }

    /** AS-IS emp.Emp00_TransInfo.selectOneByPersonId(transCode '%') — 현재 발령 기준 목록 행 */
    @GetMapping("/persons/{personId}/trans-info")
    public ApiResponse<TransInfoRes> getCurrentTransInfo(@AuthenticationPrincipal UserPrincipal principal,
                                                         @PathVariable Long personId) {
        return ApiResponse.ok(empTransInfoService.getCurrentTransInfo(principal, personId));
    }
}
