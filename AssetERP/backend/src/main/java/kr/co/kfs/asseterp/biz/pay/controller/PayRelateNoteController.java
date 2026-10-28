package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayRelateNoteRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRelateNoteSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayRelateNoteService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 급여 비고 Pay09_Lookup_Note (S16) — AS-IS pay.Pay09_RelateNote */
@RestController
@RequestMapping("/api/v1/pay/relate-notes")
@RequiredArgsConstructor
public class PayRelateNoteController {

    private final PayRelateNoteService service;

    /** pay.Pay09_RelateNote.selectByCompanyId (noteType 1 전체 / 2 개별) */
    @GetMapping
    public ApiResponse<List<PayRelateNoteRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String payCode,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate payDate,
                                                      @RequestParam String noteType) {
        return ApiResponse.ok(service.search(principal, payCode, payDate, noteType));
    }

    /** pay.Pay09_RelateNote.checkNote — 없으면 만들어서 돌려준다 */
    @PostMapping("/check")
    public ApiResponse<PayRelateNoteRes> check(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String payCode,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate payDate,
                                               @RequestParam String noteType) {
        return ApiResponse.ok(service.check(principal, payCode, payDate, noteType));
    }

    /** pay.Pay09_RelateNote.modelUpdate / update */
    @PutMapping
    public ApiResponse<List<PayRelateNoteRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestBody List<PayRelateNoteSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** pay.Pay09_RelateNote.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
