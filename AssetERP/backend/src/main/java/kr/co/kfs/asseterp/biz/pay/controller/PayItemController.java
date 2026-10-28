package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayItemRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayItemSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayItemService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 급여항목 (AS-IS Pay20_TabPage_Item·Pay20_Lookup_ItemList → server/pay/Pay20_Item) — 메뉴 #1279 */
@RestController
@RequestMapping("/api/v1/pay/items")
@RequiredArgsConstructor
public class PayItemController {

    private final PayItemService service;

    /** AS-IS pay.Pay20_Item.selectBySearchText */
    @GetMapping
    public ApiResponse<List<PayItemRes>> search(@RequestParam(defaultValue = "%") String itemType,
                                                @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(itemType, searchText));
    }

    /** AS-IS pay.Pay20_Item.selectByText (급여항목 조회창) */
    @GetMapping("/lookup")
    public ApiResponse<List<PayItemRes>> lookup(@RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.lookup(searchText));
    }

    /** AS-IS pay.Pay20_Item.getMonthItem (S17 Pay20_Lookup_MonthItem — 지급·공제 항목만) */
    @GetMapping("/month-items")
    public ApiResponse<List<PayItemRes>> monthItems(@RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchMonthItems(searchText));
    }

    /** AS-IS pay.Pay20_Item.selectByItemType (Pay20_Lookup_SelectMulti) */
    @GetMapping("/by-type")
    public ApiResponse<List<PayItemRes>> byType(@RequestParam String itemType) {
        return ApiResponse.ok(service.searchByItemType(itemType));
    }

    /** AS-IS pay.Pay20_Item.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<PayItemRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<PayItemSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS pay.Pay20_Item.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
