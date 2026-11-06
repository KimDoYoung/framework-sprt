package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.NoticeRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpNoticeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
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

/** 캘린더 알림설정(차단) (AS-IS Emp90_Lookup_Notice → server/emp/Emp90_Notice, EE66) — 본인 데이터만 */
@RestController
@RequestMapping("/api/v1/emp/notices")
@RequiredArgsConstructor
public class EmpNoticeController {

    private final EmpNoticeService service;

    /** AS-IS emp.Emp90_Notice.selectByPersonId */
    @GetMapping
    public ApiResponse<List<NoticeRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, searchText));
    }

    /** AS-IS emp.Emp90_Notice.updateList — [차단] */
    @PutMapping
    public ApiResponse<Void> block(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<String> keywords) {
        service.block(principal, keywords);
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp90_Notice.deleteList — [차단해제] */
    @DeleteMapping
    public ApiResponse<Void> unblock(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<String> keywords) {
        service.unblock(principal, keywords);
        return ApiResponse.ok(null);
    }
}
