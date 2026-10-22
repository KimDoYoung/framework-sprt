package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistConfirmReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistConfirmRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRelateApprRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsChecklistConfirmService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/** 내부통제내역 확인(부서장) (AS-IS Ics15_Tab_ChecklistConfirm → server/ics/Ics11_ChecklistCompany·Ics15_ChecklistWrite·Ics16_RelateAppr) — 메뉴 #1230 */
@RestController
@RequestMapping("/api/v1/ics/checklist-confirms")
@RequiredArgsConstructor
public class IcsChecklistConfirmController {

    private final IcsChecklistConfirmService service;

    /** AS-IS ics.Ics11_ChecklistCompany.selectChecklistStatusPaging — stdDate = 기준 분기(월)의 말일 */
    @GetMapping
    public ApiResponse<PageRes<IcsChecklistConfirmRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                               @RequestParam String cycleType, @RequestParam(required = false) Long checklistLClassId,
                                                               @RequestParam(required = false) Long checklistMClassId, @RequestParam(defaultValue = "") String searchText,
                                                               @RequestParam boolean unCheckYn, @RequestParam boolean unConfirmYn,
                                                               @RequestParam int offset, @RequestParam int limit) {
        return ApiResponse.ok(service.search(principal, stdDate, cycleType, checklistLClassId, checklistMClassId, searchText, unCheckYn, unConfirmYn, offset, limit));
    }

    /** 출력/다운로드 (AS-IS sys.Sys99_Print.insertRdChecklistConfirm + RD 리포트 Ics15_Rd_ChecklistConfirm → 한 시트 xlsx) */
    @GetMapping("/excel")
    public ResponseEntity<byte[]> download(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                           @RequestParam String cycleType, @RequestParam(required = false) Long checklistLClassId,
                                           @RequestParam(required = false) Long checklistMClassId, @RequestParam(defaultValue = "") String searchText,
                                           @RequestParam boolean unCheckYn, @RequestParam boolean unConfirmYn,
                                           @RequestParam(required = false) String fileName) {
        byte[] body = service.download(principal, stdDate, cycleType, checklistLClassId, checklistMClassId, searchText, unCheckYn, unConfirmYn);
        String name = (fileName == null || fileName.isBlank() ? "내부통제내역 확인(" + stdDate + ")" : fileName) + ".xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(name, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** AS-IS ics.Ics15_ChecklistWrite.updateConfirmYn — 확인·확인취소 */
    @PutMapping("/confirm")
    public ApiResponse<Integer> updateConfirmYn(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsChecklistConfirmReq req) {
        return ApiResponse.ok(service.updateConfirmYn(principal, req));
    }

    /** AS-IS ics.Ics16_RelateAppr.selectByConfirmerId — 상신 조회창(Ics16_Lookup_RelateAppr) */
    @GetMapping("/relate-apprs")
    public ApiResponse<List<IcsChecklistRelateApprRes>> relateApprs(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                                    @RequestParam String cycleType) {
        return ApiResponse.ok(service.relateApprs(principal, stdDate, cycleType));
    }
}
