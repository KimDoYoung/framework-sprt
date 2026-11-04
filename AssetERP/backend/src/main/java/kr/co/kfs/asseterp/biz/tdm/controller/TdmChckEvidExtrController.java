package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckEvidExtrReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckEvidExtrRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmChckEvidExtrService;
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

/** 외부보관 증빙자료 (AS-IS Tdm00_Lookup_RelateAppr의 두 번째 그리드 → server/tdm/Tdm64_ChckEvidExtr, EE49) */
@RestController
@RequestMapping("/api/v1/tdm/chck-evid-extrs")
@RequiredArgsConstructor
public class TdmChckEvidExtrController {

    private final TdmChckEvidExtrService service;

    /** AS-IS tdm.Tdm64_ChckEvidExtr.selectByTargetId */
    @GetMapping
    public ApiResponse<List<ChckEvidExtrRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long targetId) {
        return ApiResponse.ok(service.search(principal, targetId));
    }

    /** AS-IS tdm.Tdm64_ChckEvidExtr.update */
    @PutMapping
    public ApiResponse<List<ChckEvidExtrRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long targetId,
                                                    @RequestBody List<ChckEvidExtrReq> rows) {
        return ApiResponse.ok(service.save(principal, targetId, rows));
    }

    /** AS-IS tdm.Tdm64_ChckEvidExtr.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long targetId,
                                       @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, targetId, ids));
    }
}
