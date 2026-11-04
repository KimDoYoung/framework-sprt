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
import kr.co.kfs.asseterp.biz.apr.dto.AprAfterApprSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFileStampReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFundRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprAfterFundSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcrOriginRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsOriginRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateIcsSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateSelectRes;
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

    /** AS-IS apr.Apr20_RelateIcs.selectById — 법규정보 창(Sch04_Lookup_IcsList)의 연관법규 한 건 */
    @GetMapping("/relate-ics/origin")
    public ApiResponse<AprRelateIcsOriginRes> getRelateIcsOrigin(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long relateIcsId) {
        return ApiResponse.ok(service.getRelateIcsOrigin(principal, relateIcsId));
    }

    /** AS-IS apr.Apr22_RelateIcr.selectById — 내규정보 창(Sch04_Lookup_IcrList)의 연관내규 한 건 */
    @GetMapping("/relate-icr/origin")
    public ApiResponse<AprRelateIcrOriginRes> getRelateIcrOrigin(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long relateIcrId) {
        return ApiResponse.ok(service.getRelateIcrOrigin(principal, relateIcrId));
    }

    /** AS-IS apr.Apr22_RelateIcr.selectByApprId (EE70) */
    @GetMapping("/apprs/{apprId}/relate-icr-edit")
    public ApiResponse<List<AprRelateIcsRow>> getRelateIcr(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getRelateIcr(principal, apprId));
    }

    /** AS-IS apr.Apr22_RelateIcr.check + deleteList (EE70) — 변경이 있어 저장했으면 true */
    @PutMapping("/apprs/{apprId}/relate-icr")
    public ApiResponse<Boolean> saveRelateIcr(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprRelateIcsSaveReq req) {
        return ApiResponse.ok(service.saveIcr(principal, apprId, req));
    }

    /** AS-IS apr.Apr20_RelateIcs.insertIcs (EE68) — 내부통제 관리에서 문서 상신: 법규 선택창의 목록 */
    @GetMapping("/relate-ics/select")
    public ApiResponse<List<AprRelateSelectRes>> selectRelateIcs(@RequestParam Long dcrClassTreeId, @RequestParam Long icsClassTreeId) {
        return ApiResponse.ok(service.selectRelateIcsByIcs(dcrClassTreeId, icsClassTreeId));
    }

    /** AS-IS apr.Apr22_RelateIcr.insertIcr (EE69) — 내규 선택창의 목록 */
    @GetMapping("/relate-icr/select")
    public ApiResponse<List<AprRelateSelectRes>> selectRelateIcr(@RequestParam Long dcrClassTreeId, @RequestParam Long icrClassTreeId) {
        return ApiResponse.ok(service.selectRelateIcrByIcr(dcrClassTreeId, icrClassTreeId));
    }

    /** [행 추가]로 고른 법규·기한의 보기 값 */
    @GetMapping("/relate-ics/info")
    public ApiResponse<AprRelateIcsRow> getInfo(@RequestParam Long classTreeId, @RequestParam(required = false) Long deadlineId,
            @RequestParam(defaultValue = "false") boolean withLaw) {
        return ApiResponse.ok(service.getInfo(classTreeId, deadlineId, withLaw));
    }

    /** 새 연관내규 줄의 보기 값 (V13) */
    @GetMapping("/relate-icr/info")
    public ApiResponse<AprRelateIcsRow> getInfoIcr(@RequestParam Long classTreeId, @RequestParam(required = false) Long deadlineId) {
        return ApiResponse.ok(service.getInfoIcr(classTreeId, deadlineId));
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

    /** AS-IS apr.Apr03_RelateFund.selectByAfterYn — [연관펀드설정] 창 (V16) */
    @GetMapping("/apprs/{apprId}/after-relate-funds")
    public ApiResponse<List<AprAfterFundRes>> getAfterFunds(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getAfterFunds(principal, apprId));
    }

    /** AS-IS apr.Apr03_RelateFund.insert — [연관펀드설정] [확정] (결재완료 문서만) */
    @PutMapping("/apprs/{apprId}/after-relate-funds")
    public ApiResponse<Void> saveAfterFunds(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprAfterFundSaveReq req) {
        service.saveAfterFunds(principal, apprId, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS apr.Apr21_RelateAppr.insert — [연관문서설정] [확정] (결재완료 문서만). 읽기는 `GET apprs/{id}/relate-apprs` */
    @PutMapping("/apprs/{apprId}/after-relate-apprs")
    public ApiResponse<Void> saveAfterApprs(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprAfterApprSaveReq req) {
        service.saveAfterApprs(principal, apprId, req);
        return ApiResponse.ok(null);
    }
}
