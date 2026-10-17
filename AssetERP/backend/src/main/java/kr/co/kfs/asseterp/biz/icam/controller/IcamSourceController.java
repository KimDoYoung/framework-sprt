package kr.co.kfs.asseterp.biz.icam.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamSourceRes;
import kr.co.kfs.asseterp.biz.icam.service.IcamSourceService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/** ICAM DB Source Get (AS-IS Icam50_Tab_DbSource → server/icam/Icam50_Source) — 메뉴 #1269 */
@RestController
@RequestMapping("/api/v1/icam/sources")
@RequiredArgsConstructor
public class IcamSourceController {

    private final IcamSourceService service;

    /** AS-IS icam.Icam50_Source.selectByServerTypePaging — 페이지 행 + 전체 건수 */
    @GetMapping
    public ApiResponse<PageRes<IcamSourceRes>> search(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                      @RequestParam(defaultValue = "") String serverType,
                                                      @RequestParam(defaultValue = "") String sourceType,
                                                      @RequestParam(defaultValue = "") String nameSearchText,
                                                      @RequestParam(defaultValue = "") String sourceSearchText,
                                                      @RequestParam(defaultValue = "0") int offset,
                                                      @RequestParam(defaultValue = "300") int limit) {
        return ApiResponse.ok(service.search(stdDate, serverType, sourceType, nameSearchText, sourceSearchText, offset, limit));
    }

    /** AS-IS icam.Icam50_Source.insertIcamDbSource: ICAM DB소스 가져오기 — 외부 ICAM DB 연동이 없어 서버가 거절 */
    @PostMapping("/fetch")
    public ApiResponse<Void> fetchSource(@AuthenticationPrincipal UserPrincipal principal) {
        service.fetchSource(principal.getName());
        return ApiResponse.ok(null);
    }
}
