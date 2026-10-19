package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOftenUseRes;
import kr.co.kfs.asseterp.biz.dcr.service.DcrOftenUseService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 최근 사용한 문서분류 (AS-IS Dcr08_Lookup_SelectSingle → server/dcr/Dcr08_OftenUse) */
@RestController
@RequestMapping("/api/v1/dcr/often-uses")
@RequiredArgsConstructor
public class DcrOftenUseController {

    private final DcrOftenUseService service;

    /** AS-IS dcr.Dcr08_OftenUse.selectByPersonId */
    @GetMapping
    public ApiResponse<List<DcrOftenUseRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }
}
