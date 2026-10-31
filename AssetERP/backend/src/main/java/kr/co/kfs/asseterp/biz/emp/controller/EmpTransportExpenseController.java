package kr.co.kfs.asseterp.biz.emp.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.TransportApprFilesReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransportApprService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 여비교통비 신청 (AS-IS Emp50_Tab_TransportExpense, Y07 — 화면은 아직 없고 A42 상신 뒤 처리만) */
@RestController
@RequestMapping("/api/v1/emp/transport-expenses")
@RequiredArgsConstructor
public class EmpTransportExpenseController {

    private final EmpTransportApprService service;

    /** A42 상신 뒤 영수증 파일을 결재문서 첨부로 연결 (Apr03_Page_Relate.insertFileList) */
    @PutMapping("/appr-files")
    public ApiResponse<Integer> linkReceiptFiles(@AuthenticationPrincipal UserPrincipal principal, @RequestBody TransportApprFilesReq req) {
        return ApiResponse.ok(service.linkReceiptFiles(principal, req.ids(), req.apprId()));
    }
}
