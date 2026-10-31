package kr.co.kfs.asseterp.biz.apr.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFileRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFileStampReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsSaveReq;
import kr.co.kfs.asseterp.biz.apr.service.AprRelateEditService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 전자결재 문서창의 [연관법규 추가/수정/삭제]·[결재완료후 첨부파일등록] (AS-IS client/vi/apr/Apr20_Lookup_RelateIcsList · Apr20_Lookup_RelateIcs · Apr01_Lookup_ApprFile, V10) */
@RestController
@RequestMapping("/api/v1/apr")
@RequiredArgsConstructor
public class AprRelateEditController {

    private final AprRelateEditService service;

    /** AS-IS apr.Apr20_RelateIcs.selectByApprId */
    @GetMapping("/apprs/{apprId}/relate-ics-edit")
    public ApiResponse<List<AprRelateIcsRow>> getRelateIcs(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getRelateIcs(principal, apprId));
    }

    /** AS-IS apr.Apr20_RelateIcs.check + deleteList — 변경이 있어 저장했으면 true */
    @PutMapping("/apprs/{apprId}/relate-ics")
    public ApiResponse<Boolean> saveRelateIcs(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprRelateIcsSaveReq req) {
        return ApiResponse.ok(service.save(principal, apprId, req));
    }

    /** [행 추가]로 고른 법규·기한의 보기 값 */
    @GetMapping("/relate-ics/info")
    public ApiResponse<AprRelateIcsRow> getInfo(@RequestParam Long classTreeId, @RequestParam(required = false) Long deadlineId) {
        return ApiResponse.ok(service.getInfo(classTreeId, deadlineId));
    }

    /** AS-IS apr.Apr20_RelateIcs.getCloseDate */
    @GetMapping("/relate-ics/close-date")
    public ApiResponse<LocalDate> getCloseDate(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long deadlineId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate standDate) {
        return ApiResponse.ok(service.getCloseDate(principal, deadlineId, standDate));
    }

    /** AS-IS sys.Sys10_File.selectByFileYn */
    @GetMapping("/apprs/{apprId}/after-files")
    public ApiResponse<List<AprAfterFileRes>> getAfterFiles(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getAfterFiles(principal, apprId));
    }

    /** AS-IS sys.Sys10_File.update (인감날인본) */
    @PutMapping("/apprs/{apprId}/after-files")
    public ApiResponse<Void> saveAfterFiles(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprAfterFileStampReq req) {
        service.saveAfterFiles(principal, apprId, req);
        return ApiResponse.ok(null);
    }
}
