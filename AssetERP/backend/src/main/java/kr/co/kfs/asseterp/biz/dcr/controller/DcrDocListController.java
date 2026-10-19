package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocFileRes;
import kr.co.kfs.asseterp.biz.dcr.service.DcrDocListService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 문서목록 (AS-IS server/dcr/Dcr00_DocList) */
@RestController
@RequestMapping("/api/v1/dcr/doc-lists")
@RequiredArgsConstructor
public class DcrDocListController {

    private final DcrDocListService service;

    /** AS-IS dcr.Dcr00_DocList.getFile (Dcr00_Tab_FileList, F08 문서별 첨부파일 검색). 검색어는 서버가 %…%로 */
    @GetMapping("/files")
    public ApiResponse<List<DcrDocFileRes>> searchFiles(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam(required = false) Long classTreeId,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                        @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchFiles(principal, classTreeId, startDate, endDate, searchText));
    }
}
