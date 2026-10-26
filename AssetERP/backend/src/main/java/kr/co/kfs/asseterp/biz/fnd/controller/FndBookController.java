package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.BookRelateAstRes;
import kr.co.kfs.asseterp.biz.fnd.dto.BookRelateFndRes;
import kr.co.kfs.asseterp.biz.fnd.service.FndBookService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 펀드별 운용자산 (AS-IS server/fnd/Fnd10_Book) */
@RestController
@RequestMapping("/api/v1/fnd/books")
@RequiredArgsConstructor
public class FndBookController {

    private final FndBookService service;

    /** AS-IS fnd.Fnd10_Book.selectByRelateAst (P09 펀드별 자산 조회 — 고른 펀드의 자산) */
    @GetMapping("/relate-ast")
    public ApiResponse<List<BookRelateAstRes>> searchRelateAst(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam Long fundCodeId,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.searchRelateAst(principal, fundCodeId, stdDate));
    }

    /** AS-IS fnd.Fnd10_Book.selectByRelateFnd (P10 자산별 펀드 조회 — 고른 종목을 가진 내 권한 펀드) */
    @GetMapping("/relate-fnd")
    public ApiResponse<List<BookRelateFndRes>> searchRelateFnd(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam Long astClassTreeId,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.searchRelateFnd(principal, astClassTreeId, stdDate));
    }
}
