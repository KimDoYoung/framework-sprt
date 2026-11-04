package kr.co.kfs.asseterp.biz.icam.controller;

import kr.co.kfs.asseterp.biz.icam.dto.IcamPriceStockRes;
import kr.co.kfs.asseterp.biz.icam.service.IcamPriceService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 종목(주식/ETF) 찾기 — 기준일의 공용 시세 종목 (AS-IS Flt10_Lookup_ItemStk) */
@RestController
@RequestMapping("/api/v1/icam/prices")
@RequiredArgsConstructor
public class IcamPriceController {

    private final IcamPriceService service;

    /** AS-IS icam.Icam20_Price.selectByStdDatePaging (itemType 2010 주식, limit 300) */
    @GetMapping("/stocks")
    public ApiResponse<PageRes<IcamPriceStockRes>> searchStocks(@RequestParam String stdDate,
                                                                @RequestParam(required = false) String searchText,
                                                                @RequestParam(defaultValue = "300") int limit,
                                                                @RequestParam(defaultValue = "0") int offset) {
        return ApiResponse.ok(service.searchStocks(stdDate, searchText, limit, offset));
    }

    /** 열 때의 기준일 — 오늘 이후면 전영업일 (AS-IS open(date) L56-79) */
    @GetMapping("/stock-std-date")
    public ApiResponse<String> stdDate(@RequestParam String date) {
        return ApiResponse.ok(service.stdDate(date));
    }
}
