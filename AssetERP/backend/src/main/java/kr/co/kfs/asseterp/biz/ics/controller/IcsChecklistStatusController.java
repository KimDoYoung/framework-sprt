package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistStatusDetailRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistStatusRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsChecklistStatusService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/** 내부통제내역 현황(준감인) (AS-IS Ics15_Tab_ChecklistStatus → server/sys/Sys99_Print·ics/Ics11_ChecklistCompany) — 메뉴 #1231 */
@RestController
@RequestMapping("/api/v1/ics/checklist-status")
@RequiredArgsConstructor
public class IcsChecklistStatusController {

    private final IcsChecklistStatusService service;

    /** AS-IS sys.Sys99_Print.insertIcsCheckListStatus — 체크리스트별 월(분기)별 체크·확인 현황 */
    @GetMapping
    public ApiResponse<List<IcsChecklistStatusRes>> summary(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String year, @RequestParam String cycleType,
                                                            @RequestParam(required = false) Long checklistLClassId, @RequestParam(required = false) Long checklistMClassId,
                                                            @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.summary(principal, year, cycleType, checklistLClassId, checklistMClassId, searchText));
    }

    /** AS-IS ics.Ics11_ChecklistCompany.selectByChecklistIdStatus — 상세 조회창(Ics15_Lookup_ChecklistStatusDetail) */
    @GetMapping("/checklists/{checklistId}")
    public ApiResponse<List<IcsChecklistStatusDetailRes>> byChecklist(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long checklistId,
                                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                                      @RequestParam String cycleType, @RequestParam boolean unCheckYn, @RequestParam boolean unConfirmYn) {
        return ApiResponse.ok(service.byChecklist(principal, stdDate, cycleType, checklistId, unCheckYn, unConfirmYn));
    }

    /** K08 내부통제내역 상세(준감인) — AS-IS ics.Ics11_ChecklistCompany.selectChecklistStatusPaging. stdDate = 기준 분기(월)의 말일 */
    @GetMapping("/details")
    public ApiResponse<PageRes<IcsChecklistStatusDetailRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                                    @RequestParam String cycleType, @RequestParam(required = false) Long checklistLClassId,
                                                                    @RequestParam(required = false) Long checklistMClassId, @RequestParam(defaultValue = "") String searchText,
                                                                    @RequestParam boolean unCheckYn, @RequestParam boolean unConfirmYn,
                                                                    @RequestParam int offset, @RequestParam int limit) {
        return ApiResponse.ok(service.search(principal, stdDate, cycleType, checklistLClassId, checklistMClassId, searchText, unCheckYn, unConfirmYn, offset, limit));
    }

    /** 출력/다운로드 (AS-IS sys.Sys99_Print.insertRdChecklistDetail + RD 리포트 Ics15_Rd_ChecklistDetail → 한 시트 xlsx) */
    @GetMapping("/details/excel")
    public ResponseEntity<byte[]> download(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                           @RequestParam String cycleType, @RequestParam(required = false) Long checklistLClassId,
                                           @RequestParam(required = false) Long checklistMClassId, @RequestParam(defaultValue = "") String searchText,
                                           @RequestParam boolean unCheckYn, @RequestParam boolean unConfirmYn,
                                           @RequestParam(required = false) String fileName) {
        byte[] body = service.download(principal, stdDate, cycleType, checklistLClassId, checklistMClassId, searchText, unCheckYn, unConfirmYn);
        String name = (fileName == null || fileName.isBlank() ? "내부통제내역 상세(" + stdDate + ")" : fileName) + ".xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(name, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }
}
