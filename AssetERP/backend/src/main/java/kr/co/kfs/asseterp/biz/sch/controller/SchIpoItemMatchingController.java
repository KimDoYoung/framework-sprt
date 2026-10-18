package kr.co.kfs.asseterp.biz.sch.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch15IpoItemMatchingRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch15IpoItemMatchingSaveReq;
import kr.co.kfs.asseterp.biz.sch.service.SchIpoItemMatchingService;
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

/** 종목코드 매칭 (AS-IS Sch15_Lookup_IpoItemMatching → server/sch/Sch15_IpoItemMatching) */
@RestController
@RequestMapping("/api/v1/sch/ipo-item-matchings")
@RequiredArgsConstructor
public class SchIpoItemMatchingController {

    private final SchIpoItemMatchingService service;

    /** AS-IS sch.Sch15_IpoItemMatching.selectByText */
    @GetMapping
    public ApiResponse<List<Sch15IpoItemMatchingRes>> search(@RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(searchText));
    }

    /** AS-IS sch.Sch15_IpoItemMatching.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<Sch15IpoItemMatchingRes>> update(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestBody List<Sch15IpoItemMatchingSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sch.Sch15_IpoItemMatching.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
