package kr.co.kfs.asseterp.biz.apr.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprDocFormRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprEditFileRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprFileDelReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprFileDelRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprFileOptionsReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprLoadDoc2Row;
import kr.co.kfs.asseterp.biz.apr.service.AprAttachService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 상신 편집창의 [불러오기]·[양식]과 첨부파일 옵션설정·추가/삭제 (AS-IS client/vi/apr/Apr05_Lookup_LoadDoc2 · dcr/Dcr05_Lookup_FormView · apr/Apr01_Lookup_ApprFileList · sys/Sys61_Lookup_FileList·DelList, V05) */
@RestController
@RequestMapping("/api/v1/apr")
@RequiredArgsConstructor
public class AprAttachController {

    private final AprAttachService service;

    /** AS-IS dcr.Dcr00_DocList.selectByText / keyTable=tdm52면 selectNoAuthByText */
    @GetMapping("/doc-picks")
    public ApiResponse<List<AprLoadDoc2Row>> loadDocs(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(required = false) Long classTreeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) String keyTable,
            @RequestParam(required = false) Long keyTableId,
            @RequestParam(defaultValue = "false") boolean tdmRelateDcrYn) {
        return ApiResponse.ok(service.loadDocs(principal, classTreeId, startDate, endDate, searchText, keyTable, keyTableId, tdmRelateDcrYn));
    }

    /** 회사 설정 "책무증빙자료 불러오기 연결문서만"(AS-IS CompanyModel.tdmEvidOnlyRelateDcrYn) */
    @GetMapping("/doc-picks/tdm-evid-only-relate-dcr-yn")
    public ApiResponse<Boolean> tdmEvidOnlyRelateDcrYn(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.tdmEvidOnlyRelateDcrYn(principal));
    }

    /** AS-IS dcr.Dcr05_DocType.selectByClassTreeId / selectByName(all=true) */
    @GetMapping("/doc-forms")
    public ApiResponse<List<AprDocFormRow>> docForms(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(required = false) Long classTreeId,
            @RequestParam(defaultValue = "false") boolean all, @RequestParam(required = false) String searchText, @RequestParam(required = false) String formClassCode) {
        return ApiResponse.ok(service.docForms(principal, classTreeId, all, searchText, formClassCode));
    }

    /** AS-IS sys.Sys10_File.selectByParentId (옵션 열 포함) */
    @GetMapping("/apprs/{apprId}/edit-files")
    public ApiResponse<List<AprEditFileRes>> getEditFiles(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getEditFiles(principal, apprId));
    }

    /** AS-IS sys.Sys10_File.updateOthers */
    @PutMapping("/apprs/{apprId}/edit-files/options")
    public ApiResponse<Void> saveOptions(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprFileOptionsReq req) {
        service.saveOptions(principal, apprId, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS sys.Sys61_FileDel.selectByParentId */
    @GetMapping("/apprs/{apprId}/file-dels")
    public ApiResponse<List<AprFileDelRes>> getFileDels(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getFileDels(principal, apprId));
    }

    /** AS-IS sys.Sys61_FileDel.insert */
    @PostMapping("/apprs/{apprId}/file-dels")
    public ApiResponse<Void> deleteFiles(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprFileDelReq req) {
        service.deleteFiles(principal, apprId, req.fileIds(), req.reason());
        return ApiResponse.ok(null);
    }
}
