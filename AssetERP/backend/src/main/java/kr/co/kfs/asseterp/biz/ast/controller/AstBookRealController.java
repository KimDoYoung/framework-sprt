package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.BookRealRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookRealSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstBookRealService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 대사작업용 예금잔고 입력 (AS-IS Ast12_Lookup_RealDeposit → server/ast/Ast12_BookReal) */
@RestController
@RequestMapping("/api/v1/ast/book-reals")
@RequiredArgsConstructor
public class AstBookRealController {

    private final AstBookRealService service;

    /** AS-IS ast.Ast12_BookReal.selectByHoldDate */
    @GetMapping
    public ApiResponse<List<BookRealRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate,
                                                 @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, holdDate, searchText));
    }

    /** AS-IS ast.Ast12_BookReal.update — 고친 행 목록 → 다시 읽은 행들(요청 순서) */
    @PutMapping
    public ApiResponse<List<BookRealRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate,
                                               @RequestBody List<BookRealSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, holdDate, rows));
    }
}
