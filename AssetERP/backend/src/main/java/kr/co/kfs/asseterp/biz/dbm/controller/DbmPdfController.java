package kr.co.kfs.asseterp.biz.dbm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dbm.dto.PdfMakeReq;
import kr.co.kfs.asseterp.biz.dbm.dto.PdfTargetRes;
import kr.co.kfs.asseterp.biz.dbm.service.DbmPdfService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** PDF 생성 테스트 (AS-IS Dbm10_Tab_MakePdf) — 메뉴 #1108 */
@RestController
@RequestMapping("/api/v1/dbm/pdfs")
@RequiredArgsConstructor
public class DbmPdfController {

    private final DbmPdfService service;

    /** AS-IS apr.Apr01_Appr.selectPdfMakeTarget */
    @GetMapping("/targets")
    public ApiResponse<List<PdfTargetRes>> getTargets(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchTargets(principal));
    }

    /** AS-IS utils.pdf.PDFCreate.createPDF7 */
    @PostMapping
    public ApiResponse<Void> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PdfMakeReq req) {
        service.makePdf(principal, req.apprId());
        return ApiResponse.ok(null);
    }
}
