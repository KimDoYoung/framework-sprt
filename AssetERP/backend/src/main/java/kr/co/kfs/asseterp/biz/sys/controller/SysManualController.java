package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.sys.dto.ManualRes;
import kr.co.kfs.asseterp.biz.sys.service.SysManualService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** AssetERP 매뉴얼 (AS-IS Sys95_Tab_Manual → server/sys/Sys95_Manual). 로그인한 사용자 모두 */
@RestController
@RequestMapping("/api/v1/sys/manuals")
@RequiredArgsConstructor
public class SysManualController {

    private final SysManualService service;

    /** AS-IS sys.Sys95_Manual.selectByText */
    @GetMapping
    public ApiResponse<List<ManualRes>> search(@RequestParam(required = false) String manualType,
                                               @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(manualType, searchText));
    }
}
