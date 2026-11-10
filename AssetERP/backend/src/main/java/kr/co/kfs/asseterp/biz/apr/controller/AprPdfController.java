package kr.co.kfs.asseterp.biz.apr.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprPdfPreviewReq;
import kr.co.kfs.asseterp.biz.apr.service.AprPdfService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 결재문서 PDF 미리보기 — AS-IS PDFViewer("className=apr.Apr10_StampPDF7 …") 자리의 PDF 시뮬레이터 (AprPdfService 머리 주석) */
@RestController
@RequestMapping("/api/v1/apr/pdfs")
@RequiredArgsConstructor
public class AprPdfController {

    private final AprPdfService service;

    /** dcr.Dcr30_Link.selectByClassTreeId → 양식(링크코드 첫 글자, 없으면 A) */
    @GetMapping("/form-type")
    public ApiResponse<String> getFormType(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId) {
        return ApiResponse.ok(service.getFormType(principal, classTreeId));
    }

    /** apr.Apr10_Stamp.selectByPDFId — 결재완료 문서의 제목 파일 ID(없으면 null) */
    @GetMapping("/{apprId}/title-file")
    public ApiResponse<Long> getTitleFileId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getTitleFileId(principal, apprId));
    }

    /** 화면 값으로 만든 미리보기 PDF (makePreviewPDF → Apr10_StampPDF7) */
    @PostMapping("/preview")
    public ResponseEntity<byte[]> preview(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AprPdfPreviewReq req) {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF).body(service.preview(principal, req));
    }

    /** 저장된 문서의 PDF (제목 파일이 없을 때 — createPDF7 자리, 저장하지 않음) */
    @GetMapping("/{apprId}")
    public ResponseEntity<byte[]> docPdf(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId,
                                         @RequestParam(required = false) String formType) {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF).body(service.docPdf(principal, apprId, formType));
    }
}
