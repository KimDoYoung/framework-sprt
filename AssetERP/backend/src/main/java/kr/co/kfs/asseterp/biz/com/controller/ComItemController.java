package kr.co.kfs.asseterp.biz.com.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.com.dto.Com50ItemRes;
import kr.co.kfs.asseterp.biz.com.dto.Com50ItemSaveReq;
import kr.co.kfs.asseterp.biz.com.service.ComItemService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 종목(주식/ETF) 찾기·상장주식 종목 등록 (AS-IS Com50_Lookup_StkItem → server/com/Com50_Item) */
@RestController
@RequestMapping("/api/v1/com/items")
@RequiredArgsConstructor
public class ComItemController {

    private final ComItemService service;

    /** AS-IS com.Com50_Item.selectByTextPaging (itemType 2010=주식, limit 300) */
    @GetMapping
    public ApiResponse<PageRes<Com50ItemRes>> search(@RequestParam(defaultValue = "2010") String itemType,
                                                     @RequestParam(required = false) String searchText,
                                                     @RequestParam(defaultValue = "300") int limit,
                                                     @RequestParam(defaultValue = "0") int offset) {
        return ApiResponse.ok(service.searchPaging(itemType, searchText, limit, offset));
    }

    /** AS-IS com.Com50_Item.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<Com50ItemRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Com50ItemSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS com.Com50_Item.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
