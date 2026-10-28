package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayAnnualRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayAnnualSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayAnnualService;
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

/** 연봉계약관리 Pay01_Tab_Annual (S13)·연봉계약현황 Pay01_Tab_AnnualList (S14)·연봉조회 Pay01_Tab_AnnualPerson (S15) — AS-IS pay.Pay01_Annual */
@RestController
@RequestMapping("/api/v1/pay/annuals")
@RequiredArgsConstructor
public class PayAnnualController {

    private final PayAnnualService service;

    /** pay.Pay01_Annual.selectByAll / selectByPersonId (personId 없으면 전체) */
    @GetMapping
    public ApiResponse<List<PayAnnualRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(required = false) Long personId,
                                                  @RequestParam(defaultValue = "1") int radioOption,
                                                  @RequestParam(required = false) String yearStr,
                                                  @RequestParam(defaultValue = "false") boolean retireYn,
                                                  @RequestParam(defaultValue = "false") boolean apprCheckYn) {
        return ApiResponse.ok(service.search(principal, personId, radioOption, yearStr, retireYn, apprCheckYn));
    }

    /** sys.Sys99_Print.insertRdAnnualListAll / insertRdAnnualList (연봉계약현황 S14, 결재완료만) → 출력 자료 groupId */
    @PostMapping("/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam(required = false) Long personId,
                                       @RequestParam(defaultValue = "1") int radioOption,
                                       @RequestParam(required = false) String yearStr,
                                       @RequestParam(defaultValue = "false") boolean retireYn) {
        return ApiResponse.ok(service.insertRdPrint(principal, personId, radioOption, yearStr, retireYn));
    }

    /** pay.Pay01_Annual.selectByPersonId — 연봉조회(S15): 로그인 사용자 본인의 결재완료 연봉 */
    @GetMapping("/mine")
    public ApiResponse<List<PayAnnualRes>> mine(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchMine(principal));
    }

    /** pay.Pay01_Annual.update */
    @PutMapping
    public ApiResponse<List<PayAnnualRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestBody List<PayAnnualSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** pay.Pay01_Annual.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** 템플릿 (AS-IS ./excelTemplete/Template_연봉계약정보.xlsx) */
    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("Template_연봉계약정보.xlsx", StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(service.template());
    }

    /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=payUpload) → 등록한 건수 */
    @PostMapping("/excel")
    public ApiResponse<Integer> upload(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam("excelUpload") MultipartFile file) {
        return ApiResponse.ok(service.upload(principal, file));
    }
}
