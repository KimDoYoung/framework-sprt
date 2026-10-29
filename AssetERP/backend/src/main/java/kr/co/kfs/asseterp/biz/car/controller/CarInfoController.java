package kr.co.kfs.asseterp.biz.car.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.car.dto.CarInfoRes;
import kr.co.kfs.asseterp.biz.car.dto.CarInfoSaveReq;
import kr.co.kfs.asseterp.biz.car.service.CarInfoService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 차량정보관리 (AS-IS Car01_Tab_Info·Car01_Edit_Info → server/car/Car01_Info) */
@RestController
@RequestMapping("/api/v1/car/infos")
@RequiredArgsConstructor
public class CarInfoController {

    private final CarInfoService service;

    /** AS-IS car.Car01_Info.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<CarInfoRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam(required = false) String carType,
                                                @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, carType, searchText));
    }

    /** AS-IS car.Car01_Info.selectByCarType / selectByCarTypeAdmin — 차량 찾기 창(Car01_Lookup_Info) */
    @GetMapping("/lookup")
    public ApiResponse<List<CarInfoRes>> lookup(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam(required = false) String carType,
                                                @RequestParam(required = false) String stdMonth,
                                                @RequestParam(required = false) String searchText,
                                                @RequestParam(defaultValue = "false") boolean admin) {
        return ApiResponse.ok(service.searchLookup(principal, carType, stdMonth, searchText, admin));
    }

    /** AS-IS car.Car01_Info.update → 저장된 행. 새 행은 infoId가 null */
    @PutMapping
    public ApiResponse<CarInfoRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CarInfoSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS car.Car01_Info.delete (+ car.Car03_Booking.selectByInfoId 확인) */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
