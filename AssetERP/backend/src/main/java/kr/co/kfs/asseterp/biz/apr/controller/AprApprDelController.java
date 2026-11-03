package kr.co.kfs.asseterp.biz.apr.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprDelRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprDelRestoreReq;
import kr.co.kfs.asseterp.biz.apr.service.AprApprDelService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 폐기문서 복구 (AS-IS Apr01_Tab_Restore → server/apr/Apr99_ApprDel) */
@RestController
@RequestMapping("/api/v1/apr/appr-dels")
@RequiredArgsConstructor
public class AprApprDelController {

    private final AprApprDelService service;

    /** AS-IS apr.Apr99_ApprDel.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<AprApprDelRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                   @RequestParam(required = false) String orgName,
                                                   @RequestParam(required = false) String personName,
                                                   @RequestParam(required = false) String aprName) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, orgName, personName, aprName));
    }

    /** AS-IS apr.Apr99_ApprDel.restore */
    @PostMapping("/restore")
    public ApiResponse<Void> restore(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody AprApprDelRestoreReq req) {
        service.restore(principal, req.apprId());
        return ApiResponse.ok(null);
    }
}
