package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistClassCodeRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistUseYnReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistUserRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsChecklistWriteGroupReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsChecklistService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/** 내부통제 체크리스트 (AS-IS Ics10_Tab_ChecklistAdmin·Ics10_Edit_Checklist → server/ics/Ics10_Checklist) — 관리자 #1232(E04), 고객사 #1228(K04) */
@RestController
@RequestMapping("/api/v1/ics/checklists")
@RequiredArgsConstructor
public class IcsChecklistController {

    private final IcsChecklistService service;

    /** AS-IS ics.Ics10_Checklist.selectByAdmin */
    @GetMapping
    public ApiResponse<List<IcsChecklistRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam(required = false) Long checklistLClassId,
                                                     @RequestParam(required = false) Long checklistMClassId,
                                                     @RequestParam(defaultValue = "%") String useYn,
                                                     @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, checklistLClassId, checklistMClassId, useYn, searchText));
    }

    /** 새 체크리스트의 id (AS-IS GridInsertRow의 getSeq) */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS ics.Ics10_Checklist.modelUpdate → 저장된 행 */
    @PutMapping
    public ApiResponse<IcsChecklistRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsChecklistSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS ics.Ics10_Checklist.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> checklistIds) {
        return ApiResponse.ok(service.delete(principal, checklistIds));
    }

    // ── K04 내부통제 체크리스트 관리 (고객사용) ──

    /** AS-IS ics.Ics10_Checklist.selectBySearchText (useYn '%'·'true'·'false') */
    @GetMapping("/company")
    public ApiResponse<List<IcsChecklistUserRes>> searchForCompany(@AuthenticationPrincipal UserPrincipal principal,
                                                                   @RequestParam(required = false) Long checklistLClassId,
                                                                   @RequestParam(required = false) Long checklistMClassId,
                                                                   @RequestParam(defaultValue = "true") String useYn,
                                                                   @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchForCompany(principal, checklistLClassId, checklistMClassId, useYn, searchText));
    }

    /** AS-IS ics.Ics10_Checklist.preDelete → 작성내역이 있는 체크리스트 수 */
    @PostMapping("/check-delete")
    public ApiResponse<Integer> checkDelete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> checklistIds) {
        return ApiResponse.ok(service.countWritten(principal, checklistIds));
    }

    /** AS-IS ics.Ics11_ChecklistCompany.updateUseYn → 처리한 건수 */
    @PutMapping("/use-yn")
    public ApiResponse<Integer> updateUseYn(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<IcsChecklistUseYnReq> rows) {
        return ApiResponse.ok(service.updateUseYn(principal, rows));
    }

    /** AS-IS ics.Ics11_ChecklistCompany.updateWriteGroupId → 처리한 건수 */
    @PutMapping("/write-group")
    public ApiResponse<Integer> updateWriteGroup(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsChecklistWriteGroupReq req) {
        return ApiResponse.ok(service.updateWriteGroup(principal, req));
    }

    /** 출력/다운로드 (AS-IS sys.Sys99_Print.insertRdCheckList + RD 리포트 Ics10_Rd_Checklist → 한 시트 xlsx) */
    @GetMapping("/excel")
    public ResponseEntity<byte[]> export(@AuthenticationPrincipal UserPrincipal principal,
                                         @RequestParam(required = false) Long checklistLClassId,
                                         @RequestParam(required = false) Long checklistMClassId,
                                         @RequestParam(defaultValue = "") String searchText) {
        return xlsx("내부통제 체크리스트.xlsx", service.export(principal, checklistLClassId, checklistMClassId, searchText));
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_내부통제 체크리스트.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return xlsx("Template_내부통제 체크리스트.xlsx", service.template());
    }

    /** 데이터업로드 (AS-IS ExcelUpload?uploadType=icsChecklistUpload) → 넣은 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, file));
    }

    private static ResponseEntity<byte[]> xlsx(String fileName, byte[] body) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    /** AS-IS sys.Sys09_Code.selectByIcs21 */
    @GetMapping("/l-codes")
    public ApiResponse<List<IcsChecklistClassCodeRes>> lCodes(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.lCodes(principal, stdDate));
    }

    /** AS-IS sys.Sys09_Code.selectByIcs23 */
    @GetMapping("/m-codes")
    public ApiResponse<List<IcsChecklistClassCodeRes>> mCodes(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(required = false) Long checklistLClassId,
                                                              @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.mCodes(principal, checklistLClassId, stdDate));
    }
}
