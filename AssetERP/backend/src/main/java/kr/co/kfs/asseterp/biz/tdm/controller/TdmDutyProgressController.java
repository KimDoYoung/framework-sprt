package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.DutyProgressRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmDutyProgressService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 책무진행 상태 (AS-IS Tdm50_Tab_DutyProgressAdmin → server/sys/Sys99_Print) */
@RestController
@RequestMapping("/api/v1/tdm/duty-progress")
@RequiredArgsConstructor
public class TdmDutyProgressController {

    private final TdmDutyProgressService service;

    /** AS-IS sys.Sys99_Print.insertReconTdm — 사용자 몫의 점검상태 행을 기준월로 다시 만든다 (이어서 GET) */
    @PostMapping("/data")
    public ApiResponse<Void> createData(@AuthenticationPrincipal UserPrincipal principal,
                                        @RequestParam(required = false) Long companyId,
                                        @RequestParam String baseDate) {
        service.createData(principal, companyId, baseDate);
        return ApiResponse.ok(null);
    }

    /** AS-IS sys.Sys99_Print.selectByWindowClassName */
    @GetMapping
    public ApiResponse<List<DutyProgressRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }
}
