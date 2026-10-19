package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrWriteCodeRes;
import kr.co.kfs.asseterp.biz.dcr.service.DcrWriteCodeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 문서작성 분류 콤보 (AS-IS Dcr01_Tab_DcrWrite의 CommonComboBoxField → sys.Sys09_Code.selectByDcrLv1~3·selectByDcrDetail) */
@RestController
@RequestMapping("/api/v1/dcr/write-codes")
@RequiredArgsConstructor
public class DcrWriteCodeController {

    private final DcrWriteCodeService service;

    /** 대분류(level 1)·중분류(2)·문서분류(3). 2·3은 부모 분류 ID(dcrParentId)를 준다 */
    @GetMapping("/classes")
    public ApiResponse<List<DcrWriteCodeRes>> searchClasses(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam int level,
                                                            @RequestParam(required = false) Long dcrParentId) {
        return ApiResponse.ok(service.searchClassCodes(principal, level, dcrParentId));
    }

    /** 세부분류 */
    @GetMapping("/details")
    public ApiResponse<List<DcrWriteCodeRes>> searchDetails(@RequestParam Long classTreeId) {
        return ApiResponse.ok(service.searchDetailCodes(classTreeId));
    }
}
