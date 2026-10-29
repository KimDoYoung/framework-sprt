package kr.co.kfs.asseterp.biz.car.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalBatchReq;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalDateCheckRes;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalFixReq;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalRes;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalSaveReq;
import kr.co.kfs.asseterp.biz.car.dto.CarPublicAdminFixReq;
import kr.co.kfs.asseterp.biz.car.dto.CarPublicAdminJournalRes;
import kr.co.kfs.asseterp.biz.car.dto.CarPublicJournalRes;
import kr.co.kfs.asseterp.biz.car.service.CarJournalService;
import kr.co.kfs.asseterp.biz.car.service.CarJournalUploadService;
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

/** 전용차량 운행일지 (AS-IS Car04_Tab_PrivateJournal·Car04_Lookup_PrivateJournal → server/car/Car04_Journal) */
@RestController
@RequestMapping("/api/v1/car/journals")
@RequiredArgsConstructor
public class CarJournalController {

    private final CarJournalService service;
    private final CarJournalUploadService uploadService;

    /** AS-IS car.Car04_Journal.selectByPrivateJournal — stdMonth 'YYYY.MM' */
    @GetMapping
    public ApiResponse<List<CarJournalRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam Long infoId, @RequestParam String stdMonth) {
        return ApiResponse.ok(service.search(principal, infoId, stdMonth));
    }

    /** AS-IS Car04_Lookup_PrivateJournal 사용일자 검사(getAfterCloseYn → getAfterFixYn → selectByPrivateJournal → checkDate → selectByDate) */
    @GetMapping("/date-check")
    public ApiResponse<CarJournalDateCheckRes> dateCheck(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long infoId,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.ok(service.dateCheck(principal, infoId, date));
    }

    /** AS-IS car.Car04_Journal.modelUpdate → 저장된 행. 새 행은 journalId가 null */
    @PutMapping
    public ApiResponse<CarJournalRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CarJournalSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS car.Car04_Journal.update (확정·확정취소) → 바꾼 건수 */
    @PutMapping("/fix")
    public ApiResponse<Integer> fix(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CarJournalFixReq req) {
        return ApiResponse.ok(service.fix(principal, req));
    }

    /** AS-IS car.Car04_Journal.batch (일괄생성) → 만든 건수 */
    @PostMapping("/batch")
    public ApiResponse<Integer> batch(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CarJournalBatchReq req) {
        return ApiResponse.ok(service.batch(principal, req));
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_차량운행등록.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_차량운행등록.xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(uploadService.template());
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=carUpload&personId&infoId) → 등록한 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long personId, @RequestParam Long infoId,
                                       @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(uploadService.upload(principal, personId, infoId, file));
    }

    /** AS-IS car.Car04_Journal.delete */
    /** AS-IS car.Car04_Journal.selectByPublicJournal (T14) — infoId 없으면 전체 차량 */
    @GetMapping("/public")
    public ApiResponse<List<CarPublicJournalRes>> searchPublic(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(required = false) Long infoId, @RequestParam String stdMonth) {
        return ApiResponse.ok(service.searchPublic(principal, infoId, stdMonth));
    }

    /** AS-IS car.Car04_Journal.checkBookingId (T14) → 그 예약의 일지가 있는가 */
    @GetMapping("/booking-check")
    public ApiResponse<Boolean> bookingCheck(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long bookingId) {
        return ApiResponse.ok(service.existsBooking(principal, bookingId));
    }

    /** AS-IS Car04_Tab_PublicJournal.confirmAll·cancelAll (T14) → 바꾼 건수 */
    @PutMapping("/public-fix")
    public ApiResponse<Integer> fixPublic(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CarJournalFixReq req) {
        return ApiResponse.ok(service.fixPublic(principal, req));
    }

    /** AS-IS car.Car04_Journal.selectByPublicJournalAdmin (T15) — infoId 없으면 전체 차량 */
    @GetMapping("/public-admin")
    public ApiResponse<List<CarPublicAdminJournalRes>> searchPublicAdmin(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(required = false) Long infoId,
                                                                         @RequestParam String stdMonth, @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchPublicAdmin(principal, infoId, stdMonth, searchText));
    }

    /** AS-IS Car04_Tab_PublicJournalAdmin.confirmAll·cancelAll (T15) → 바꾼 건수 */
    @PutMapping("/public-admin-fix")
    public ApiResponse<Integer> fixPublicAdmin(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CarPublicAdminFixReq req) {
        return ApiResponse.ok(service.fixPublicAdmin(principal, req));
    }

    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
