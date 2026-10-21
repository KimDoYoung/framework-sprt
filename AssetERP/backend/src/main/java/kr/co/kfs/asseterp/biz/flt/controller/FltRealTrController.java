package kr.co.kfs.asseterp.biz.flt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.EmpLimitRes;
import kr.co.kfs.asseterp.biz.flt.dto.RealTrRes;
import kr.co.kfs.asseterp.biz.flt.dto.RealTrSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.RelateApprRes;
import kr.co.kfs.asseterp.biz.flt.dto.ReportCheckRes;
import kr.co.kfs.asseterp.biz.flt.service.FltRealTrService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

/** 임직원매매 정기보고 (AS-IS Flt10_Tab_RealTransaction → server/flt/Flt10_Tr 외) */
@RestController
@RequestMapping("/api/v1/flt/real-trs")
@RequiredArgsConstructor
public class FltRealTrController {

    private final FltRealTrService service;

    /** AS-IS flt.Flt10_Tr.selectByPeriod — 로그인 사용자 본인 */
    @GetMapping
    public ApiResponse<List<RealTrRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam(required = false) Long accountId,
                                               @RequestParam String startDate,
                                               @RequestParam String closeDate,
                                               @RequestParam(required = false) String searchText,
                                               @RequestParam(defaultValue = "false") boolean myAccountYn,
                                               @RequestParam(defaultValue = "true") boolean preTrYn) {
        return ApiResponse.ok(service.search(principal, accountId, startDate, closeDate, searchText, myAccountYn, preTrYn));
    }

    /** AS-IS flt.Flt10_Tr.update (GridUpdate) */
    @PutMapping
    public ApiResponse<List<RealTrRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<RealTrSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS flt.Flt10_Tr.delete (GridDeleteData) — 행을 지운다 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS flt.Flt10_Tr.deleteUpdate — 사전신고가 있는 행은 실거래 열만 비운다 */
    @PutMapping("/clear")
    public ApiResponse<Integer> clear(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.clear(principal, ids));
    }

    /** AS-IS flt.Flt10_Tr.deleteApprList — 상신문서 폐기 */
    @DeleteMapping("/apprs")
    public ApiResponse<Integer> discardApprs(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> apprIds) {
        return ApiResponse.ok(service.discardApprs(principal, apprIds));
    }

    /** AS-IS flt.Flt10_Tr.getBizDate */
    @GetMapping("/biz-date")
    public ApiResponse<String> bizDate(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String baseDate) {
        return ApiResponse.ok(service.bizDate(principal, baseDate));
    }

    /** AS-IS flt.Flt02_Emp.selectInvestLimit — 설정이 없으면 data가 null */
    @GetMapping("/emp-limit")
    public ApiResponse<EmpLimitRes> empLimit(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdDate) {
        return ApiResponse.ok(service.empLimit(principal, stdDate));
    }

    /** AS-IS flt.Flt14_RelateAppr.selectByStdDate */
    @GetMapping("/relate-apprs")
    public ApiResponse<List<RelateApprRes>> relateApprs(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdDate) {
        return ApiResponse.ok(service.relateApprs(principal, stdDate));
    }

    /** AS-IS sys.Sys12_Calendar.selectByDay — 영업일이면 true, 아니면 false, 일자 정보가 없으면 null */
    @GetMapping("/working-day")
    public ApiResponse<Boolean> workingDay(@RequestParam String stdDate) {
        return ApiResponse.ok(service.workingDay(stdDate));
    }

    /** AS-IS flt.Flt10_Tr.insertFloorTrBook (원장생성) */
    @PostMapping("/book")
    public ApiResponse<Integer> insertFloorTrBook(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String startDate) {
        service.insertFloorTrBook(principal, startDate);
        return ApiResponse.ok(1);
    }

    /** AS-IS flt.Flt10_Tr.checkPreAppr → checkNextAppr */
    @GetMapping("/report-check")
    public ApiResponse<ReportCheckRes> reportCheck(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdDate) {
        return ApiResponse.ok(service.checkReport(principal, stdDate));
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_임직원자기매매.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_임직원자기매매.xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(service.template());
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=fltUpload) → 등록한 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, file));
    }
}
