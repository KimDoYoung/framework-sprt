package kr.co.kfs.asseterp.biz.icam.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamDataRes;
import kr.co.kfs.asseterp.biz.icam.service.IcamDataService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** ICAM 연계 데이터 (AS-IS server/icam/Icam02_Data) — 작업용 화면 Icam99_Tab_Test(#1097)의 그리드 */
@RestController
@RequestMapping("/api/v1/icam/data")
@RequiredArgsConstructor
public class IcamDataController {

    private final IcamDataService service;

    /** AS-IS icam.Icam02_Data.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<IcamDataRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }
}
