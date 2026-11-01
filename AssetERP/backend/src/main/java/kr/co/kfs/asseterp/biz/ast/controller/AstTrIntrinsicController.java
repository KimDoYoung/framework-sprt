package kr.co.kfs.asseterp.biz.ast.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.ast.dto.BookDepnRes;
import kr.co.kfs.asseterp.biz.ast.dto.SettleByTrRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrCfInsertReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepnCheckReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrIntrinsicRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrIntrinsicSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstTrIntrinsicService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 고유자산 거래처리 Ast06_Tab_TrIntrinsic (X03) — AS-IS ast.Ast06_Tr · ast.Ast07_Settle.selectByTrId · ast.Ast13_BookDepn. 삭제는 `POST /trs/delete`(U04) */
@RestController
@RequestMapping("/api/v1/ast")
@RequiredArgsConstructor
public class AstTrIntrinsicController {

    private final AstTrIntrinsicService service;

    /** ast.Ast06_Tr.selectByPayCode — windowClassName으로 화면을 가린다 */
    @GetMapping("/trs/intrinsic")
    public ApiResponse<List<TrIntrinsicRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                    @RequestParam String windowClassName,
                                                    @RequestParam(required = false) String payCode,
                                                    @RequestParam(required = false) Long corpId,
                                                    @RequestParam(required = false) Long classTreeId,
                                                    @RequestParam(required = false) Long trCodeId,
                                                    @RequestParam(required = false) String searchText,
                                                    @RequestParam(defaultValue = "false") boolean bookIoCheck) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, windowClassName, payCode, corpId, classTreeId, trCodeId, searchText, bookIoCheck));
    }

    /** ast.Ast06_Tr.selectById */
    @GetMapping("/trs/intrinsic/{trId}")
    public ApiResponse<TrIntrinsicRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long trId) {
        return ApiResponse.ok(service.get(principal, trId));
    }

    /** ast.Ast06_Tr.update / updateDepn — 저장한 거래ID */
    @PutMapping("/trs/intrinsic")
    public ApiResponse<Long> save(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody TrIntrinsicSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** ast.Ast06_Tr.checkDepn — 거래일 이후 감가상각이 있으면 AS-IS 메시지로 실패 */
    @PostMapping("/trs/intrinsic/check-depn")
    public ApiResponse<Void> checkDepn(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody TrDepnCheckReq req) {
        service.checkDepn(principal, req);
        return ApiResponse.ok(null);
    }

    /** ast.Ast06_Tr.insertByCf — 가져온 건수 */
    @PostMapping("/trs/intrinsic/cf")
    public ApiResponse<Integer> insertByCf(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody TrCfInsertReq req) {
        return ApiResponse.ok(service.insertByCf(principal, req));
    }

    /** ast.Ast07_Settle.selectByTrId */
    @GetMapping("/settles/by-tr")
    public ApiResponse<List<SettleByTrRes>> settles(@RequestParam Long trId) {
        return ApiResponse.ok(service.settles(trId));
    }

    /** ast.Ast13_BookDepn.selectByDepnDate — 보유자산 조회창(Ast13_Lookup_BookDepn). `/book-depns`는 감가상각 원장 탭(Ast13_Tab_DepnBook)이 쓴다 */
    @GetMapping("/book-depns/hold")
    public ApiResponse<List<BookDepnRes>> bookDepns(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate depnDate,
                                                    @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.bookDepns(principal, depnDate, searchText));
    }
}
