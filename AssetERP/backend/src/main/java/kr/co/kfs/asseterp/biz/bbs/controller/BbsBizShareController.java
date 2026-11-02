package kr.co.kfs.asseterp.biz.bbs.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.BizShareRes;
import kr.co.kfs.asseterp.biz.bbs.dto.BizShareSaveReq;
import kr.co.kfs.asseterp.biz.bbs.service.BbsBizShareService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 업무공유 (AS-IS server/bbs/Bbs10_BizShare, Z07 Bbs10_Tab_BizShare) */
@RestController
@RequestMapping("/api/v1/bbs/biz-shares")
@RequiredArgsConstructor
public class BbsBizShareController {

    private final BbsBizShareService service;

    /** AS-IS bbs.Bbs10_BizShare.selectByText — bizShareType 없으면 전체 */
    @GetMapping
    public ApiResponse<List<BizShareRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                 @RequestParam(required = false) String bizShareType,
                                                 @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchByText(principal, startDate, closeDate, bizShareType, searchText));
    }

    /** AS-IS bbs.Bbs10_BizShare.modelUpdate — 저장한 행 */
    @PutMapping
    public ApiResponse<BizShareRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizShareSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS bbs.Bbs10_BizShare.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
