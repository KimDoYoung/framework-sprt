package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PaySimpleTaxOtherRes;
import kr.co.kfs.asseterp.biz.pay.dto.PaySimpleTaxOtherSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PaySimpleTaxRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import kr.co.kfs.asseterp.biz.pay.service.PaySimpleTaxService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

/** 근로소득 간이세액표 (AS-IS Pay23_TabPage_SimpleTaxTable·Pay22_TabPage_SimpleTax·Pay23_Popup_SimpleTaxTableCreate → server/pay/Pay22·Pay23) — 메뉴 #1279 */
@RestController
@RequestMapping("/api/v1/pay/simple-taxes")
@RequiredArgsConstructor
public class PaySimpleTaxController {

    private final PaySimpleTaxService service;

    /** AS-IS pay.Pay23_SimpleTaxTableOther.selectByAll */
    @GetMapping("/dates")
    public ApiResponse<List<PayStartDateRes>> searchDates() {
        return ApiResponse.ok(service.searchDates());
    }

    /** AS-IS pay.Pay23_SimpleTaxTableOther.insert (적용일 생성) */
    @PostMapping("/dates")
    public ApiResponse<Void> createDate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayStartDateReq req) {
        service.createDate(principal, req.startDate());
        return ApiResponse.ok(null);
    }

    /** AS-IS pay.Pay23_SimpleTaxTableOther.deleteByDate → 지운 건수 */
    @DeleteMapping("/dates")
    public ApiResponse<Integer> deleteDate(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.deleteDate(principal, startDate));
    }

    /** AS-IS pay.Pay22_SimpleTaxTable.selectByDate (천만원 이하) */
    @GetMapping
    public ApiResponse<List<PaySimpleTaxRes>> search(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                     @RequestParam(required = false) Long searchLong) {
        return ApiResponse.ok(service.search(startDate, searchLong));
    }

    /** AS-IS pay.Pay22_SimpleTaxTable.deleteByDate (엑셀업로드 전 비우기) → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> deleteTable(@AuthenticationPrincipal UserPrincipal principal,
                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.deleteTable(principal, startDate));
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=simpleTaxTableUpload) → 넣은 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> uploadExcel(@AuthenticationPrincipal UserPrincipal principal,
                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                            @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.uploadExcel(principal, startDate, file));
    }

    /** AS-IS pay.Pay23_SimpleTaxTableOther.selectByDate (천만원 초과) */
    @GetMapping("/other")
    public ApiResponse<List<PaySimpleTaxOtherRes>> searchOther(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.searchOther(startDate));
    }

    /** AS-IS pay.Pay23_SimpleTaxTableOther.update → 저장된 행(요청 순서) */
    @PutMapping("/other")
    public ApiResponse<List<PaySimpleTaxOtherRes>> saveOther(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestBody List<PaySimpleTaxOtherSaveReq> rows) {
        return ApiResponse.ok(service.saveOther(principal, rows));
    }

    /** AS-IS pay.Pay23_SimpleTaxTableOther.delete → 지운 건수 */
    @DeleteMapping("/other")
    public ApiResponse<Integer> deleteOther(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteOther(principal, ids));
    }
}
