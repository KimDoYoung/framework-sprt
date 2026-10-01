package kr.co.kfs.asseterp.oms.biz.emp.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.emp.dto.OrgPersonRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransInfoCreateReq;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransInfoRes;
import kr.co.kfs.asseterp.oms.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 사원 현재 정보 (AS-IS emp.Emp00_TransInfo) */
@RestController
@RequestMapping("/api/v1/emp/trans-infos")
@RequiredArgsConstructor
public class EmpTransInfoController {

    private final EmpTransInfoService empTransInfoService;

    @GetMapping
    public ApiResponse<List<TransInfoRes>> searchTransInfos(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) String transCode,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate transDate,
            @RequestParam(required = false) Long orgCodeId,
            @RequestParam(defaultValue = "false") boolean isSeparateAddTitle) {
        return ApiResponse.ok(empTransInfoService.searchTransInfos(principal, searchText, transCode, transDate, orgCodeId, isSeparateAddTitle));
    }

    /** 조직별 사원 (하위 조직 포함, AS-IS Emp00_Tab_OrgPerson / Emp00_Tab_OrgEmpManager) */
    @GetMapping("/by-org")
    public ApiResponse<List<OrgPersonRes>> searchByOrg(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam Long orgCodeId,
                                                       @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate) {
        return ApiResponse.ok(empTransInfoService.searchByOrg(principal, orgCodeId, baseDate));
    }

    /** 사원 한 명의 현재 정보 (발령 변경 후 목록 행 갱신) */
    @GetMapping("/{personId}")
    public ApiResponse<TransInfoRes> getTransInfo(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long personId) {
        return ApiResponse.ok(empTransInfoService.getTransInfo(principal, personId));
    }

    /** 신규사원 등록: 사원 + 채용발령 */
    @PostMapping
    public ApiResponse<TransInfoRes> createTransInfo(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TransInfoCreateReq req) {
        return ApiResponse.ok(empTransInfoService.createTransInfo(principal, req));
    }
}
