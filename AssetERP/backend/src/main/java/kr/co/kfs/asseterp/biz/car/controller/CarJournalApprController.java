package kr.co.kfs.asseterp.biz.car.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalApprIdReq;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalRelateApprReq;
import kr.co.kfs.asseterp.biz.car.service.CarJournalApprService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 차량 운행일지 결재 상신(A16, V35) */
@RestController
@RequestMapping("/api/v1/car/journals/relate-appr")
@RequiredArgsConstructor
public class CarJournalApprController {

    private final CarJournalApprService service;

    /** Car04_Tab_Journal.insertApprCheck: 상신 행 만들기 + PDF — 돌려준 번호가 결재창의 refId */
    @PostMapping
    public ApiResponse<Long> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody @Valid CarJournalRelateApprReq req) {
        return ApiResponse.ok(service.createRelateAppr(principal, req.infoId(), req.stdMonth()));
    }

    /** Car04_Tab_Journal.updateApprId */
    @PutMapping("/{relateApprId}/appr-id")
    public ApiResponse<Void> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long relateApprId,
                                          @RequestBody @Valid CarJournalApprIdReq req) {
        service.updateApprId(principal, relateApprId, req.apprId());
        return ApiResponse.ok(null);
    }
}
