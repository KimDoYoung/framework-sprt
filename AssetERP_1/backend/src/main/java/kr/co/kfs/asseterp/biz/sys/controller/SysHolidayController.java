package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.HolidayInitReq;
import kr.co.kfs.asseterp.biz.sys.dto.HolidayRes;
import kr.co.kfs.asseterp.biz.sys.dto.HolidaySaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysHolidayService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 휴일관리 (AS-IS Sys14_Lookup_Holiday → server/sys/Sys14_Holiday) */
@RestController
@RequestMapping("/api/v1/sys/holidays")
@RequiredArgsConstructor
public class SysHolidayController {

    private final SysHolidayService service;

    /** AS-IS sys.Sys14_Holiday.selectByYear */
    @GetMapping
    public ApiResponse<List<HolidayRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam(required = false) String year) {
        return ApiResponse.ok(service.search(principal, year));
    }

    /** AS-IS sys.Sys14_Holiday.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<HolidayRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<HolidaySaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sys.Sys14_Holiday.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS sys.Sys14_Holiday.insertInitData (기초데이터생성 — 관리자만) → 처리한 일자 수 */
    @PostMapping("/init-data")
    public ApiResponse<Integer> insertInitData(@AuthenticationPrincipal UserPrincipal principal, @RequestBody HolidayInitReq req) {
        return ApiResponse.ok(service.insertInitData(principal, req));
    }
}
